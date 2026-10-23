"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { validatePassword } from "@/lib/rate-limit";
import type { ActionResult, FormState } from "@/lib/action-types";

const UUID = z.string().uuid();
const ROLES = ["admin", "editor", "viewer"] as const;

const createSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role: z.enum(ROLES),
  password: z.string(),
});

export async function createUser(_prev: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser("admin");
  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && k !== "password") values[k] = v;

  const parsed = createSchema.safeParse({
    name: fd.get("name"), email: fd.get("email"), role: fd.get("role"), password: fd.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const problem = validatePassword(parsed.data.password);
  if (problem) return { error: problem, values };

  const taken = await queryOne(`select 1 from admin_users where email = $1`, [parsed.data.email]);
  if (taken) return { error: "A user with that email already exists.", values };

  const row = await queryOne<{ id: string }>(
    `insert into admin_users (name,email,password_hash,role) values ($1,$2,$3,$4) returning id`,
    [parsed.data.name, parsed.data.email, await bcrypt.hash(parsed.data.password, 12), parsed.data.role]
  );
  await logActivity(actor, "create", "user", row!.id, `Created ${parsed.data.role} account for ${parsed.data.email}`);
  redirect("/admin/users?created=1");
}

async function otherActiveAdmins(excludeId: string) {
  const r = await queryOne<{ n: number }>(
    `select count(*)::int as n from admin_users where role = 'admin' and active = true and id <> $1`,
    [excludeId]
  );
  return r?.n ?? 0;
}

export async function updateUser(id: string, patch: { role?: string; active?: boolean }): Promise<ActionResult> {
  const actor = await requireUser("admin");
  if (!UUID.safeParse(id).success) return { ok: false, error: "Invalid request." };
  const target = await queryOne<{ email: string; role: string; active: boolean }>(`select email, role, active from admin_users where id = $1`, [id]);
  if (!target) return { ok: false, error: "User not found." };

  const role = patch.role ?? target.role;
  const active = patch.active ?? target.active;
  if (!ROLES.includes(role as any)) return { ok: false, error: "Invalid role." };

  if (id === actor.id && (!active || role !== "admin")) {
    return { ok: false, error: "You can't remove your own admin access. Ask another admin." };
  }
  if (target.role === "admin" && (role !== "admin" || !active) && (await otherActiveAdmins(id)) === 0) {
    return { ok: false, error: "There must always be at least one active admin." };
  }

  await query(`update admin_users set role = $1, active = $2 where id = $3`, [role, active, id]);
  await logActivity(actor, "update", "user", id, `${target.email}: role ${role}, ${active ? "active" : "disabled"}`);
  return { ok: true };
}

export async function resetUserPassword(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser("admin");
  if (!UUID.safeParse(id).success) return { error: "Invalid request." };
  const pw = String(fd.get("password") ?? "");
  const problem = validatePassword(pw);
  if (problem) return { error: problem };
  const row = await queryOne<{ email: string }>(
    `update admin_users set password_hash = $1 where id = $2 returning email`,
    [await bcrypt.hash(pw, 12), id]
  );
  if (!row) return { error: "User not found." };
  await logActivity(actor, "update", "user", id, `Reset password for ${row.email}`);
  return { success: "Password reset. Share it with the user securely." };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const actor = await requireUser("admin");
  if (!UUID.safeParse(id).success) return { ok: false, error: "Invalid request." };
  if (id === actor.id) return { ok: false, error: "You can't delete your own account." };
  const target = await queryOne<{ email: string; role: string }>(`select email, role from admin_users where id = $1`, [id]);
  if (!target) return { ok: false, error: "User not found." };
  if (target.role === "admin" && (await otherActiveAdmins(id)) === 0) {
    return { ok: false, error: "There must always be at least one active admin." };
  }
  await query(`delete from admin_users where id = $1`, [id]);
  await logActivity(actor, "delete", "user", id, `Deleted user ${target.email}`);
  return { ok: true };
}
