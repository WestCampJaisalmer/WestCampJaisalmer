import "server-only";
import { query, queryOne } from "@/lib/db";

export interface EnquiryRow {
  id: string;
  ref: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  details: Record<string, unknown>;
  item_type: string | null;
  item_id: string | null;
  item_name: string | null;
  status: string;
  assigned_to: string | null;
  assigned_name: string | null;
  source_page: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EnquiryFilters {
  q?: string;
  status?: string;
  type?: string;
  from?: string; // yyyy-mm-dd (IST)
  to?: string;
  assigned?: string; // user id | "none"
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-f-]{36}$/i;

function buildWhere(f: EnquiryFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, v: unknown) => {
    params.push(v);
    where.push(sql.replace("?", `$${params.length}`));
  };

  if (f.q?.trim()) {
    params.push(`%${f.q.trim().replace(/[%_\\]/g, (m) => "\\" + m)}%`);
    const p = `$${params.length}`;
    where.push(`(e.name ilike ${p} or e.email ilike ${p} or e.phone ilike ${p} or e.ref ilike ${p} or e.item_name ilike ${p} or e.message ilike ${p} or e.subject ilike ${p})`);
  }
  if (f.status) add("e.status = ?", f.status);
  if (f.type) add("e.type = ?", f.type);
  if (f.from && DATE.test(f.from)) add("(e.created_at at time zone 'Asia/Kolkata')::date >= ?::date", f.from);
  if (f.to && DATE.test(f.to)) add("(e.created_at at time zone 'Asia/Kolkata')::date <= ?::date", f.to);
  if (f.assigned === "none") where.push("e.assigned_to is null");
  else if (f.assigned && UUID.test(f.assigned)) add("e.assigned_to = ?", f.assigned);

  return { sql: where.length ? `where ${where.join(" and ")}` : "", params };
}

const SELECT = `
  select e.*, u.name as assigned_name
  from enquiries e left join admin_users u on u.id = e.assigned_to`;

export async function listEnquiries(f: EnquiryFilters, page = 1, pageSize = 20) {
  const { sql, params } = buildWhere(f);
  const totalRow = await queryOne<{ n: number }>(`select count(*)::int as n from enquiries e ${sql}`, params);
  const rows = await query<EnquiryRow>(
    `${SELECT} ${sql} order by e.created_at desc limit ${pageSize} offset ${(Math.max(page, 1) - 1) * pageSize}`,
    params
  );
  return { rows, total: totalRow?.n ?? 0 };
}

export async function listEnquiriesForExport(f: EnquiryFilters, limit = 10000) {
  const { sql, params } = buildWhere(f);
  return query<EnquiryRow>(`${SELECT} ${sql} order by e.created_at desc limit ${limit}`, params);
}

export async function getEnquiry(id: string) {
  if (!UUID.test(id)) return null;
  return queryOne<EnquiryRow>(`${SELECT} where e.id = $1`, [id]);
}

export async function getEnquiryNotes(id: string) {
  return query<{ id: number; user_name: string | null; body: string; kind: string; created_at: Date }>(
    `select id, user_name, body, kind, created_at from enquiry_notes where enquiry_id = $1 order by created_at asc`,
    [id]
  );
}

export async function statusCounts() {
  const rows = await query<{ status: string; n: number }>(`select status, count(*)::int as n from enquiries group by status`);
  return Object.fromEntries(rows.map((r) => [r.status, r.n])) as Record<string, number>;
}
