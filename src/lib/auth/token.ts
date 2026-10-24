import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "wcj_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

export type Role = "admin" | "editor" | "viewer";

export interface SessionPayload {
  uid: string;
  role: Role;
}

function key() {
  const secret = process.env.SESSION_SECRET || "wcj_super_secret_jwt_admin_session_key_2026_west_camp_jaisalmer";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (typeof payload.uid !== "string") return null;
    return { uid: payload.uid, role: payload.role as Role };
  } catch {
    return null;
  }
}
