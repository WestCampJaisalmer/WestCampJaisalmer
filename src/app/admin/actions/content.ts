"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { query, queryOne, withTransaction } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { CONTENT_TAG } from "@/lib/content";
import { parseResourceForm, slugify } from "@/lib/resources";
import { resolveResource } from "@/lib/resource-server";
import type { ActionResult, FormState } from "@/lib/action-types";

const TABLE_ID = /^[a-z0-9][a-z0-9-]{0,80}$/;

function rawValues(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  return out;
}

async function uniqueId(table: string, base: string): Promise<string> {
  let candidate = base;
  for (let i = 2; i < 50; i++) {
    const hit = await queryOne(`select 1 from ${table} where id = $1`, [candidate]);
    if (!hit) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function saveResource(resourceKey: string, id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("editor");
  const def = await resolveResource(resourceKey);
  if (!def) return { error: "Unknown content type." };

  const { values, errors } = parseResourceForm(def, fd);
  const raw = rawValues(fd);
  if (Object.keys(errors).length) {
    return { error: "Please fix the highlighted fields.", fieldErrors: errors, values: raw };
  }

  const active = fd.get("active") === "on";
  const featured = def.hasFeatured && fd.get("featured") === "on";
  const title = String(values[def.fields.find((f) => f.name === def.titleField)!.column] ?? "item");

  const columns = def.fields.map((f) => f.column);
  const vals = columns.map((c) => values[c]);

  try {
    if (id) {
      if (!TABLE_ID.test(id)) return { error: "Invalid item id." };
      const sets = columns.map((c, i) => `${c} = $${i + 1}`);
      const extra = def.hasFeatured ? `, featured = $${columns.length + 2}` : "";
      const params: unknown[] = [...vals, active, ...(def.hasFeatured ? [featured] : []), id];
      const res = await query(
        `update ${def.table} set ${sets.join(", ")}, active = $${columns.length + 1}${extra}, updated_at = now()
         where id = $${params.length} returning id`,
        params
      );
      if (!res.length) return { error: "This item no longer exists.", values: raw };
      // Making a guest review visible is the same thing as approving it.
      if (def.key === "testimonials" && active) {
        await query(`update testimonials set status = 'approved' where id = $1 and status <> 'approved'`, [id]);
      }
      await logActivity(user, "update", def.key, id, `Updated ${def.singular.toLowerCase()} "${title}"`);
    } else {
      const newId = await uniqueId(def.table, slugify(title));
      const maxRow = await queryOne<{ m: number | null }>(`select max(sort_order) as m from ${def.table}`);
      const sort = (maxRow?.m ?? -10) + 10;
      const cols = ["id", ...columns, "active", ...(def.hasFeatured ? ["featured"] : []), "sort_order"];
      const params: unknown[] = [newId, ...vals, active, ...(def.hasFeatured ? [featured] : []), sort];
      await query(
        `insert into ${def.table} (${cols.join(",")}) values (${cols.map((_, i) => `$${i + 1}`).join(",")})`,
        params
      );
      await logActivity(user, "create", def.key, newId, `Added ${def.singular.toLowerCase()} "${title}"`);
    }
  } catch (err) {
    console.error("[saveResource]", err);
    return { error: "Could not save. Please try again.", values: raw };
  }

  updateTag(CONTENT_TAG);
  redirect(`/admin/content/${def.key}?saved=1`);
}

export async function deleteResource(resourceKey: string, id: string): Promise<ActionResult> {
  const user = await requireUser("editor");
  const def = await resolveResource(resourceKey);
  if (!def || !TABLE_ID.test(id)) return { ok: false, error: "Invalid request." };

  if (def.key === "gallery-categories") {
    const used = await queryOne<{ n: number }>(`select count(*)::int as n from gallery_images where category = $1`, [id]);
    if (used && used.n > 0) {
      return { ok: false, error: `${used.n} photo(s) still use this category. Move or delete them first.` };
    }
  }

  const row = await queryOne<{ id: string }>(`delete from ${def.table} where id = $1 returning id`, [id]);
  if (!row) return { ok: false, error: "Item not found." };
  await logActivity(user, "delete", def.key, id, `Deleted ${def.singular.toLowerCase()} "${id}"`);
  updateTag(CONTENT_TAG);
  return { ok: true };
}

/** Moderation for guest-submitted reviews: approve publishes it, reject hides it. */
export async function reviewDecision(id: string, decision: "approve" | "reject"): Promise<ActionResult> {
  const user = await requireUser("editor");
  if (!TABLE_ID.test(id) || (decision !== "approve" && decision !== "reject")) return { ok: false, error: "Invalid request." };

  const approve = decision === "approve";
  const row = await queryOne<{ name: string }>(
    `update testimonials set status = $1, active = $2, updated_at = now() where id = $3 returning name`,
    [approve ? "approved" : "rejected", approve, id]
  );
  if (!row) return { ok: false, error: "Review not found." };
  await logActivity(user, decision, "testimonials", id, `${approve ? "Approved" : "Rejected"} review from ${row.name}`);
  updateTag(CONTENT_TAG);
  return { ok: true };
}

export async function toggleResourceFlag(resourceKey: string, id: string, flag: "active" | "featured"): Promise<ActionResult> {
  const user = await requireUser("editor");
  const def = await resolveResource(resourceKey);
  if (!def || !TABLE_ID.test(id)) return { ok: false, error: "Invalid request." };
  if (flag === "featured" && !def.hasFeatured) return { ok: false, error: "Not supported." };

  const col = flag === "active" ? "active" : "featured";
  const row = await queryOne<{ v: boolean }>(
    `update ${def.table} set ${col} = not ${col}, updated_at = now() where id = $1 returning ${col} as v`,
    [id]
  );
  if (!row) return { ok: false, error: "Item not found." };
  await logActivity(user, "update", def.key, id, `${flag === "active" ? (row.v ? "Published" : "Hid") : row.v ? "Featured" : "Unfeatured"} "${id}"`);
  updateTag(CONTENT_TAG);
  return { ok: true };
}

export async function moveResource(resourceKey: string, id: string, direction: "up" | "down"): Promise<ActionResult> {
  const user = await requireUser("editor");
  const def = await resolveResource(resourceKey);
  if (!def || !TABLE_ID.test(id)) return { ok: false, error: "Invalid request." };

  await withTransaction(async (c) => {
    const { rows } = await c.query<{ id: string }>(
      `select id from ${def.table} order by sort_order asc, created_at asc for update`
    );
    const ids = rows.map((r) => r.id);
    const i = ids.indexOf(id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    // renumber the whole list so ties can never make the order ambiguous
    await c.query(
      `update ${def.table} t set sort_order = v.pos * 10
       from (select unnest($1::text[]) as id, generate_series(0, $2) as pos) v where t.id = v.id`,
      [ids, ids.length - 1]
    );
  });

  await logActivity(user, "reorder", def.key, id, `Moved "${id}" ${direction}`);
  updateTag(CONTENT_TAG);
  return { ok: true };
}

export async function bulkResource(resourceKey: string, ids: string[], op: "show" | "hide" | "delete"): Promise<ActionResult> {
  const user = await requireUser("editor");
  const def = await resolveResource(resourceKey);
  const clean = ids.filter((i) => TABLE_ID.test(i)).slice(0, 500);
  if (!def || !clean.length) return { ok: false, error: "Nothing selected." };

  if (op === "delete") {
    if (def.key === "gallery-categories") {
      const used = await queryOne<{ n: number }>(`select count(*)::int as n from gallery_images where category = any($1::text[])`, [clean]);
      if (used && used.n > 0) return { ok: false, error: "Some categories still have photos. Move or delete those photos first." };
    }
    await query(`delete from ${def.table} where id = any($1::text[])`, [clean]);
  } else {
    await query(`update ${def.table} set active = $1, updated_at = now() where id = any($2::text[])`, [op === "show", clean]);
  }
  await logActivity(user, op, def.key, null, `Bulk ${op} on ${clean.length} ${def.plural.toLowerCase()}`);
  updateTag(CONTENT_TAG);
  return { ok: true, message: `${clean.length} item(s) updated.` };
}
