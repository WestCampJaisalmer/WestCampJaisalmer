import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { queryOne } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySessionToken, type Role } from "./token";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const RANK: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 };

export function hasRole(role: Role, min: Role) {
  return RANK[role] >= RANK[min];
}

export async function createSession(user: { id: string; role: Role }) {
  const token = await signSession({ uid: user.id, role: user.role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Authoritative check: verifies the signed cookie AND re-reads the user from the database,
 * so a disabled / deleted / demoted account loses access immediately.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await queryOne<AdminUser & { active: boolean }>(
    `select id, name, email, role, active from admin_users where id = $1`,
    [session.uid]
  );
  if (!user || !user.active) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

/** For pages, actions and route handlers. Redirects to login / dashboard when not allowed. */
export async function requireUser(min: Role = "viewer"): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!hasRole(user.role, min)) redirect("/admin?denied=1");
  return user;
}

/** Same check for route handlers, which should answer with a status instead of redirecting. */
export async function getApiUser(min: Role = "viewer"): Promise<AdminUser | null> {
  const user = await getCurrentUser();
  if (!user || !hasRole(user.role, min)) return null;
  return user;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : h.get("x-real-ip")) || "unknown";
}
