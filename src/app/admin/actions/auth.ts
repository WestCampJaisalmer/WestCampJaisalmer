"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { createSession, destroySession, getClientIp, requireUser } from "@/lib/auth/dal";
import { isLoginBlocked, recordLoginAttempt, validatePassword } from "@/lib/rate-limit";
import { logActivity } from "@/lib/audit";
import type { FormState } from "@/lib/action-types";

// Compared against when the email is unknown, so response time doesn't reveal valid emails.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("not-a-real-password", 12));

function safeNext(next: FormDataEntryValue | null): string {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/admin") && !n.startsWith("//") && !n.startsWith("/admin/login") ? n : "/admin";
}

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const ip = await getClientIp();

  if (!email || !password) return { error: "Enter your email and password.", values: { email } };

  if (await isLoginBlocked(email, ip)) {
    return { error: "Too many failed attempts. Please wait 15 minutes and try again.", values: { email } };
  }

  const user = await queryOne<{ id: string; name: string; password_hash: string; role: "admin" | "editor" | "viewer"; active: boolean }>(
    `select id, name, password_hash, role, active from admin_users where email = $1`,
    [email]
  );

  const ok = await bcrypt.compare(password, user?.password_hash ?? (await getDummyHash()));
  if (!user || !ok || !user.active) {
    await recordLoginAttempt(email, ip, false);
    return { error: "Invalid email or password.", values: { email } };
  }

  await recordLoginAttempt(email, ip, true);
  await query(`update admin_users set last_login_at = now() where id = $1`, [user.id]);
  await createSession({ id: user.id, role: user.role });
  await logActivity({ id: user.id, name: user.name }, "login", "session", user.id, `${user.name} signed in`);

  redirect(safeNext(fd.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
});

export async function updateProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("viewer");
  const parsed = profileSchema.safeParse({ name: fd.get("name"), email: fd.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values: Object.fromEntries([...fd].map(([k, v]) => [k, String(v)])) };
  }
  const taken = await queryOne(`select 1 from admin_users where email = $1 and id <> $2`, [parsed.data.email, user.id]);
  if (taken) return { error: "That email is already used by another account.", values: { name: parsed.data.name, email: parsed.data.email } };

  await query(`update admin_users set name = $1, email = $2 where id = $3`, [parsed.data.name, parsed.data.email, user.id]);
  await logActivity(user, "update", "profile", user.id, "Updated own profile");
  return { success: "Profile updated." };
}

export async function changePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("viewer");
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");

  const row = await queryOne<{ password_hash: string }>(`select password_hash from admin_users where id = $1`, [user.id]);
  if (!row || !(await bcrypt.compare(current, row.password_hash))) return { error: "Current password is incorrect." };
  const problem = validatePassword(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "New passwords do not match." };
  if (next === current) return { error: "Choose a password different from the current one." };

  await query(`update admin_users set password_hash = $1 where id = $2`, [await bcrypt.hash(next, 12), user.id]);
  await logActivity(user, "update", "profile", user.id, "Changed own password");
  return { success: "Password changed." };
}
