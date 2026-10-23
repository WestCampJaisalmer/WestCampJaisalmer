import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { query, queryOne } from "@/lib/db";
import { EmptyState, PageHeader, Pagination, Pill, formatDateTime } from "@/components/admin/ui";

export const metadata = { title: "Activity log" };

const SIZE = 30;

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ page?: string; entity?: string }> }) {
  await requireUser("viewer");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const entity = sp.entity && /^[a-z0-9_-]+$/i.test(sp.entity) ? sp.entity : null;

  const where = entity ? "where entity = $1" : "";
  const params = entity ? [entity] : [];
  const [rows, total, entities] = await Promise.all([
    query<{ id: number; user_name: string | null; action: string; entity: string | null; summary: string | null; created_at: Date }>(
      `select id,user_name,action,entity,summary,created_at from activity_log ${where} order by created_at desc limit ${SIZE} offset ${(page - 1) * SIZE}`,
      params
    ),
    queryOne<{ n: number }>(`select count(*)::int as n from activity_log ${where}`, params),
    query<{ entity: string }>(`select distinct entity from activity_log where entity is not null order by entity`),
  ]);

  const href = (p: number) => `/admin/activity?${new URLSearchParams({ ...(entity ? { entity } : {}), page: String(p) })}`;

  return (
    <>
      <PageHeader title="Activity log" description="An audit trail of who changed what, and when." />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {[{ v: "", l: "Everything" }, ...entities.map((e) => ({ v: e.entity, l: e.entity }))].map((t) => {
          const active = (entity ?? "") === t.v;
          return (
            <Link
              key={t.v || "all"}
              href={t.v ? `/admin/activity?entity=${t.v}` : "/admin/activity"}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                active ? "border-deep-teal bg-deep-teal text-white" : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              {t.l}
            </Link>
          );
        })}
      </div>

      <div className="adm-card overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState title="Nothing logged yet" />
        ) : (
          <ul className="divide-y divide-border-light">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-5">
                <Pill tone={r.action === "delete" ? "muted" : r.action === "create" ? "green" : "neutral"}>{r.action}</Pill>
                <span className="min-w-0 flex-1 text-sm text-text-main">{r.summary}</span>
                <span className="text-xs text-text-muted">{r.user_name}</span>
                <span className="text-xs text-text-light">{formatDateTime(r.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} pageSize={SIZE} total={total?.n ?? 0} hrefFor={href} />
      </div>
    </>
  );
}
