import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarCheck, Inbox, PhoneCall, Plus, Quote, TrendingUp,
} from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getDashboardStats } from "@/lib/stats";
import { ENQUIRY_STATUSES, statusLabel, typeLabel } from "@/lib/enquiry-constants";
import { EmptyState, Flash, PageHeader, StatusBadge, timeAgo } from "@/components/admin/ui";
import DailyChart from "@/components/admin/DailyChart";

export const metadata = { title: "Dashboard" };

function Tile({
  label, value, hint, icon: Icon, href, accent,
}: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: any; href?: string; accent?: boolean }) {
  const inner = (
    <div className={`adm-card h-full p-5 transition ${href ? "hover:-translate-y-0.5 hover:shadow-card" : ""} ${accent ? "border-gold/50 bg-gradient-to-br from-white to-gold/10" : ""}`}>
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${accent ? "bg-gold text-white" : "bg-cream-alt text-gold"}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-2 font-serif text-3xl font-bold text-deep-teal lining-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function BarList({ rows, total, labelOf }: { rows: { key: string; n: number }[]; total: number; labelOf: (k: string) => string }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-text-muted">No data yet.</p>;
  const max = Math.max(...rows.map((r) => r.n), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-text-main">{labelOf(r.key)}</span>
            <span className="text-text-muted">
              <b className="text-deep-teal">{r.n}</b> · {Math.round((r.n / Math.max(total, 1)) * 100)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream-alt" role="presentation">
            <div className="h-full rounded-full bg-gold" style={{ width: `${(r.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser("viewer");
  const { denied } = await searchParams;
  const s = await getDashboardStats();
  const t = s.totals;

  const delta = t.last7 - t.prev7;
  const pct = t.prev7 > 0 ? Math.round((delta / t.prev7) * 100) : null;
  const canWrite = user.role !== "viewer";
  const hour = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false });
  const greeting = Number(hour) < 12 ? "Good morning" : Number(hour) < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {denied && <Flash tone="error">You don&apos;t have permission to open that page.</Flash>}
      {s.pendingReviews > 0 && (
        <Link
          href="/admin/content/testimonials?status=pending"
          className="mb-5 flex items-center justify-between gap-3 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-semibold text-deep-teal transition hover:bg-gold/15"
        >
          <span className="flex items-center gap-2"><Quote size={16} className="text-gold" />
            {s.pendingReviews} guest {s.pendingReviews === 1 ? "review is" : "reviews are"} waiting for your approval
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-dark">Review <ArrowRight size={13} /></span>
        </Link>
      )}

      <PageHeader
        title={`${greeting}, ${user.name.split(" ")[0]}`}
        description="Here's what's happening with your website and guest enquiries."
        actions={
          canWrite && (
            <>
              <Link href="/admin/enquiries/new" className="adm-btn-ghost"><Plus size={16} /> Log enquiry</Link>
              <Link href="/admin/content/packages/new" className="adm-btn-primary"><Plus size={16} /> New package</Link>
            </>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="New enquiries" value={t.new} icon={Inbox} href="/admin/enquiries?status=new" accent={t.new > 0}
          hint={t.new > 0 ? "Waiting for a reply" : "All caught up"} />
        <Tile label="Open pipeline" value={t.open} icon={PhoneCall} href="/admin/enquiries"
          hint="New, contacted or quoted" />
        <Tile label="Last 7 days" value={t.last7} icon={TrendingUp}
          hint={
            pct === null ? (
              "No data for the week before"
            ) : (
              <span className={`inline-flex items-center gap-0.5 font-semibold ${delta >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                {delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(pct)}% vs previous 7 days
              </span>
            )
          } />
        <Tile label="Confirmed this month" value={t.confirmed_month} icon={CalendarCheck} hint={`${t.total} ${t.total === 1 ? "enquiry" : "enquiries"} all-time`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="adm-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-bold text-deep-teal">Enquiries — last 30 days</h2>
            <span className="text-xs text-text-muted">{s.daily.reduce((a, d) => a + d.n, 0)} total</span>
          </div>
          <DailyChart data={s.daily} />
        </section>

        <section className="adm-card p-5">
          <h2 className="mb-4 font-serif text-lg font-bold text-deep-teal">By status</h2>
          <BarList
            rows={ENQUIRY_STATUSES.map((st) => ({ key: st.value, n: s.byStatus.find((b) => b.status === st.value)?.n ?? 0 })).filter((r) => r.n > 0)}
            total={t.total}
            labelOf={statusLabel}
          />
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="adm-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
            <h2 className="font-serif text-lg font-bold text-deep-teal">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-xs font-bold text-gold hover:text-gold-dark">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {s.recent.length === 0 ? (
            <EmptyState title="No enquiries yet" text="When guests use the booking, contact or plan-a-trip forms, they'll show up here." />
          ) : (
            <ul className="divide-y divide-border-light">
              {s.recent.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-cream">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-alt text-sm font-bold text-gold-dark">
                      {e.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-main">{e.name}</p>
                      <p className="truncate text-xs text-text-muted">
                        {typeLabel(e.type)}
                        {e.item_name ? ` · ${e.item_name}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={e.status} />
                      <span className="text-[11px] text-text-light">{timeAgo(e.created_at)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="adm-card p-5">
            <h2 className="mb-4 font-serif text-lg font-bold text-deep-teal">Most requested</h2>
            <BarList
              rows={s.topItems.map((i) => ({ key: i.item_name, n: i.n }))}
              total={s.topItems.reduce((a, i) => a + i.n, 0)}
              labelOf={(k) => k}
            />
          </section>

          <section className="adm-card p-5">
            <h2 className="mb-4 font-serif text-lg font-bold text-deep-teal">Website content</h2>
            <ul className="space-y-2">
              {s.contentCounts.map((c) => (
                <li key={c.key}>
                  <Link href={`/admin/content/${c.key}`} className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition hover:bg-cream">
                    <span className="text-text-main">{c.label}</span>
                    <span className="text-xs text-text-muted">
                      <b className="text-deep-teal">{c.live}</b> live{c.total > c.live ? ` · ${c.total - c.live} hidden` : ""}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin/media" className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition hover:bg-cream">
                  <span className="text-text-main">Media files</span>
                  <b className="text-xs text-deep-teal">{s.mediaCount}</b>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
