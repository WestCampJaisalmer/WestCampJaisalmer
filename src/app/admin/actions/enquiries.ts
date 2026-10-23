"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { ENQUIRY_STATUSES, ENQUIRY_TYPES, statusLabel } from "@/lib/enquiry-constants";
import type { ActionResult, FormState } from "@/lib/action-types";

const UUID = z.string().uuid();
const STATUS_VALUES = ENQUIRY_STATUSES.map((s) => s.value) as [string, ...string[]];

export async function setEnquiryStatus(id: string, status: string): Promise<ActionResult> {
  const user = await requireUser("editor");
  if (!UUID.safeParse(id).success || !STATUS_VALUES.includes(status)) return { ok: false, error: "Invalid request." };

  const before = await queryOne<{ status: string; ref: string }>(`select status, ref from enquiries where id = $1`, [id]);
  if (!before) return { ok: false, error: "Enquiry not found." };
  if (before.status === status) return { ok: true };

  await query(`update enquiries set status = $1, updated_at = now() where id = $2`, [status, id]);
  await query(
    `insert into enquiry_notes (enquiry_id, user_name, body, kind) values ($1,$2,$3,'status')`,
    [id, user.name, `Status changed: ${statusLabel(before.status)} → ${statusLabel(status)}`]
  );
  await logActivity(user, "status", "enquiry", before.ref, `${before.ref} → ${statusLabel(status)}`);
  return { ok: true };
}

export async function addEnquiryNote(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("editor");
  const body = String(fd.get("body") ?? "").trim();
  if (!UUID.safeParse(id).success) return { error: "Invalid enquiry." };
  if (!body) return { error: "Write a note first." };
  if (body.length > 2000) return { error: "Note is too long (max 2000 characters)." };

  const exists = await queryOne(`select 1 from enquiries where id = $1`, [id]);
  if (!exists) return { error: "Enquiry not found." };
  await query(`insert into enquiry_notes (enquiry_id, user_name, body) values ($1,$2,$3)`, [id, user.name, body]);
  await query(`update enquiries set updated_at = now() where id = $1`, [id]);
  return { success: "Note added." };
}

export async function assignEnquiry(id: string, userId: string | null): Promise<ActionResult> {
  const user = await requireUser("editor");
  if (!UUID.safeParse(id).success || (userId && !UUID.safeParse(userId).success)) return { ok: false, error: "Invalid request." };

  let assigneeName = "nobody";
  if (userId) {
    const u = await queryOne<{ name: string }>(`select name from admin_users where id = $1 and active = true`, [userId]);
    if (!u) return { ok: false, error: "User not found." };
    assigneeName = u.name;
  }
  const row = await queryOne<{ ref: string }>(
    `update enquiries set assigned_to = $1, updated_at = now() where id = $2 returning ref`,
    [userId, id]
  );
  if (!row) return { ok: false, error: "Enquiry not found." };
  await query(`insert into enquiry_notes (enquiry_id, user_name, body, kind) values ($1,$2,$3,'status')`, [
    id, user.name, `Assigned to ${assigneeName}`,
  ]);
  await logActivity(user, "assign", "enquiry", row.ref, `${row.ref} assigned to ${assigneeName}`);
  return { ok: true };
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  const user = await requireUser("admin");
  if (!UUID.safeParse(id).success) return { ok: false, error: "Invalid request." };
  const row = await queryOne<{ ref: string }>(`delete from enquiries where id = $1 returning ref`, [id]);
  if (!row) return { ok: false, error: "Enquiry not found." };
  await logActivity(user, "delete", "enquiry", row.ref, `Deleted enquiry ${row.ref}`);
  return { ok: true };
}

export async function deleteEnquiryAndReturn(id: string) {
  const res = await deleteEnquiry(id);
  if (res.ok) redirect("/admin/enquiries?deleted=1");
}

export async function bulkEnquiries(ids: string[], op: string): Promise<ActionResult> {
  const clean = ids.filter((i) => UUID.safeParse(i).success).slice(0, 500);
  if (!clean.length) return { ok: false, error: "Nothing selected." };

  if (op === "delete") {
    const user = await requireUser("admin");
    await query(`delete from enquiries where id = any($1::uuid[])`, [clean]);
    await logActivity(user, "delete", "enquiry", null, `Bulk deleted ${clean.length} enquiries`);
    return { ok: true, message: `${clean.length} enquiries deleted.` };
  }
  const user = await requireUser("editor");
  if (!STATUS_VALUES.includes(op)) return { ok: false, error: "Invalid action." };
  await query(`update enquiries set status = $1, updated_at = now() where id = any($2::uuid[])`, [op, clean]);
  await logActivity(user, "status", "enquiry", null, `Bulk set ${clean.length} enquiries to ${statusLabel(op)}`);
  return { ok: true, message: `${clean.length} enquiries marked ${statusLabel(op)}.` };
}

const manualSchema = z.object({
  type: z.enum(ENQUIRY_TYPES.map((t) => t.value) as [string, ...string[]]),
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().max(40).optional(),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email.")]).optional(),
  itemName: z.string().trim().max(200).optional(),
  message: z.string().trim().max(5000).optional(),
});

/** Lets staff log phone / walk-in / WhatsApp leads so everything lives in one place. */
export async function createManualEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("editor");
  const values = Object.fromEntries([...fd].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = manualSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const d = parsed.data;
  if (!d.phone && !d.email) return { error: "Add a phone number or an email so you can follow up.", values };

  const row = await queryOne<{ id: string; ref: string }>(
    `insert into enquiries (type,name,email,phone,item_name,message,source_page,details)
     values ($1,$2,$3,$4,$5,$6,'admin (manual)','{}') returning id, ref`,
    [d.type, d.name, d.email || null, d.phone || null, d.itemName || null, d.message || null]
  );
  await logActivity(user, "create", "enquiry", row!.ref, `Logged enquiry ${row!.ref} from ${d.name}`);
  redirect(`/admin/enquiries/${row!.id}`);
}
