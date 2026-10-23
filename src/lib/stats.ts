import "server-only";
import { query, queryOne } from "@/lib/db";
import { RESOURCES } from "@/lib/resources";

const IST_TODAY = `(now() at time zone 'Asia/Kolkata')::date`;
const IST_DAY = `(created_at at time zone 'Asia/Kolkata')::date`;

export async function getDashboardStats() {
  const [totals, daily, byStatus, byType, topItems, recent, contentCounts, media, users, pendingReviews] = await Promise.all([
    queryOne<{ total: number; new: number; last7: number; prev7: number; confirmed_month: number; open: number }>(`
      select
        count(*)::int as total,
        count(*) filter (where status = 'new')::int as new,
        count(*) filter (where ${IST_DAY} > ${IST_TODAY} - 7)::int as last7,
        count(*) filter (where ${IST_DAY} <= ${IST_TODAY} - 7 and ${IST_DAY} > ${IST_TODAY} - 14)::int as prev7,
        count(*) filter (where status in ('confirmed','completed') and date_trunc('month', created_at at time zone 'Asia/Kolkata') = date_trunc('month', now() at time zone 'Asia/Kolkata'))::int as confirmed_month,
        count(*) filter (where status in ('new','contacted','quoted'))::int as open
      from enquiries`),
    query<{ day: string; n: number }>(`
      select to_char(d, 'YYYY-MM-DD') as day, count(e.id)::int as n
      from generate_series(${IST_TODAY} - 29, ${IST_TODAY}, interval '1 day') d
      left join enquiries e on (e.created_at at time zone 'Asia/Kolkata')::date = d::date
      group by d order by d`),
    query<{ status: string; n: number }>(`select status, count(*)::int as n from enquiries group by status order by n desc`),
    query<{ type: string; n: number }>(`select type, count(*)::int as n from enquiries group by type order by n desc`),
    query<{ item_name: string; n: number }>(`
      select item_name, count(*)::int as n from enquiries
      where item_name is not null and item_name <> '' and status <> 'spam'
      group by item_name order by n desc, item_name limit 6`),
    query<{ id: string; ref: string; name: string; type: string; status: string; item_name: string | null; created_at: Date }>(`
      select id, ref, name, type, status, item_name, created_at from enquiries order by created_at desc limit 7`),
    Promise.all(
      ["hotels", "camps", "tours", "destinations", "packages", "testimonials", "gallery-images"].map(async (key) => {
        const def = RESOURCES[key];
        const r = await queryOne<{ total: number; live: number }>(
          `select count(*)::int as total, count(*) filter (where active)::int as live from ${def.table}`
        );
        return { key, label: def.plural, total: r?.total ?? 0, live: r?.live ?? 0 };
      })
    ),
    queryOne<{ n: number }>(`select count(*)::int as n from media`),
    queryOne<{ n: number }>(`select count(*)::int as n from admin_users where active = true`),
    queryOne<{ n: number }>(`select count(*)::int as n from testimonials where status = 'pending'`),
  ]);

  return {
    totals: totals!,
    daily,
    byStatus,
    byType,
    topItems,
    recent,
    contentCounts,
    mediaCount: media?.n ?? 0,
    userCount: users?.n ?? 0,
    pendingReviews: pendingReviews?.n ?? 0,
  };
}
