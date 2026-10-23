import "server-only";
import { query, queryOne } from "@/lib/db";

const WINDOW_MIN = 15;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 12;

export async function isLoginBlocked(email: string, ip: string): Promise<boolean> {
  const row = await queryOne<{ by_email: number; by_ip: number }>(
    `select
       count(*) filter (where email = $1)::int as by_email,
       count(*) filter (where ip = $2)::int as by_ip
     from login_attempts
     where success = false and created_at > now() - ($3 || ' minutes')::interval`,
    [email, ip, String(WINDOW_MIN)]
  );
  return (row?.by_email ?? 0) >= MAX_FAILS_PER_EMAIL || (row?.by_ip ?? 0) >= MAX_FAILS_PER_IP;
}

export async function recordLoginAttempt(email: string, ip: string, success: boolean) {
  await query(`insert into login_attempts (email, ip, success) values ($1,$2,$3)`, [email, ip, success]);
  if (success) {
    // a good login clears the failure streak for this account
    await query(`delete from login_attempts where email = $1 and success = false`, [email]);
  }
  // keep the table small
  await query(`delete from login_attempts where created_at < now() - interval '2 days'`);
}

/** Public enquiry endpoint flood guard: max N submissions per IP per hour. */
export async function enquiryFloodCount(ip: string): Promise<number> {
  const row = await queryOne<{ n: number }>(
    `select count(*)::int as n from enquiries where ip = $1 and created_at > now() - interval '1 hour'`,
    [ip]
  );
  return row?.n ?? 0;
}

export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Password must contain letters and numbers.";
  if (pw.length > 100) return "Password is too long.";
  return null;
}
