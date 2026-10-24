import Link from "next/link";
import { Clock, History, User } from "lucide-react";
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
      <PageHeader 
        title="Activity log" 
        description="An audit trail of who changed what, and when across the entire website." 
      />

      {/* Filter Tabs */}
      <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 py-1 sm:mx-0 sm:px-0 mb-4">
        {[{ v: "", l: "All activity" }, ...entities.map((e) => ({ v: e.entity, l: e.entity }))].map((t) => {
          const active = (entity ?? "") === t.v;
          return (
            <Link
              key={t.v || "all"}
              href={t.v ? `/admin/activity?entity=${t.v}` : "/admin/activity"}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                active 
                  ? "border-deep-teal bg-deep-teal text-white shadow-sm" 
                  : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              {t.l}
            </Link>
          );
        })}
      </div>

      <div className="adm-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-light bg-cream/30 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <History size={16} className="text-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-deep-teal">
              Audit Trail {total?.n ? `(${total.n} events)` : ""}
            </h2>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Nothing logged yet" />
        ) : (
          <ul className="divide-y divide-border-light">
            {rows.map((r) => (
              <li key={r.id} className="p-3.5 sm:px-5 sm:py-3.5 transition hover:bg-cream/15">
                {/* Mobile Feed Item */}
                <div className="flex flex-col gap-1.5 sm:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Pill tone={r.action === "delete" ? "muted" : r.action === "create" ? "green" : "neutral"}>
                        {r.action}
                      </Pill>
                      {r.entity && (
                        <span className="text-[11px] font-semibold text-deep-teal/80 uppercase tracking-wider bg-cream px-2 py-0.5 rounded border border-border-light/60">
                          {r.entity}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-text-light flex items-center gap-1 shrink-0">
                      <Clock size={11} className="shrink-0 text-stone-400" />
                      {formatDateTime(r.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text-main leading-snug break-words">
                    {r.summary}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold-dark">
                      {(r.user_name || "S").charAt(0).toUpperCase()}
                    </div>
                    <span>{r.user_name || "System"}</span>
                  </div>
                </div>

                {/* Desktop Row Item */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="shrink-0">
                    <Pill tone={r.action === "delete" ? "muted" : r.action === "create" ? "green" : "neutral"}>
                      {r.action}
                    </Pill>
                  </div>
                  {r.entity && (
                    <span className="shrink-0 text-[11px] font-semibold text-deep-teal/80 uppercase tracking-wider bg-cream px-2 py-0.5 rounded border border-border-light">
                      {r.entity}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 text-sm text-text-main truncate">
                    {r.summary}
                  </span>
                  <span className="shrink-0 text-xs text-text-muted flex items-center gap-1.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold-dark">
                      {(r.user_name || "S").charAt(0).toUpperCase()}
                    </div>
                    <span>{r.user_name || "System"}</span>
                  </span>
                  <span className="shrink-0 text-xs text-text-light whitespace-nowrap">
                    {formatDateTime(r.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} pageSize={SIZE} total={total?.n ?? 0} hrefFor={href} />
      </div>
    </>
  );
}
