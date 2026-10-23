import Link from "next/link";
import { Download, Plus, Search } from "lucide-react";
import { requireUser, hasRole } from "@/lib/auth/dal";
import { listEnquiries, statusCounts, type EnquiryFilters } from "@/lib/enquiries";
import { query } from "@/lib/db";
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from "@/lib/enquiry-constants";
import { Flash, PageHeader, Pagination, formatDateTime, timeAgo } from "@/components/admin/ui";
import EnquiryTable from "@/components/admin/EnquiryTable";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 20;

type SP = Record<string, string | undefined>;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await requireUser("viewer");
  const sp = await searchParams;
  const filters: EnquiryFilters = {
    q: sp.q, status: sp.status, type: sp.type, from: sp.from, to: sp.to, assigned: sp.assigned,
  };
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total }, counts, staff] = await Promise.all([
    listEnquiries(filters, page, PAGE_SIZE),
    statusCounts(),
    query<{ id: string; name: string }>(`select id, name from admin_users where active = true order by name`),
  ]);

  const canWrite = hasRole(user.role, "editor");
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const qs = (over: SP) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...over })) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `?${s}` : "";
  };
  const exportQs = new URLSearchParams(Object.entries({ ...filters }).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Booking requests, trip plans and messages from the website."
        actions={
          canWrite && (
            <>
              <a href={`/api/admin/enquiries/export${exportQs ? `?${exportQs}` : ""}`} className="adm-btn-ghost"><Download size={16} /> Export CSV</a>
              <Link href="/admin/enquiries/new" className="adm-btn-primary"><Plus size={16} /> Log enquiry</Link>
            </>
          )
        }
      />
      {sp.deleted && <Flash>Enquiry deleted.</Flash>}

      {/* status tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {[{ value: "", label: "All", n: allCount }, ...ENQUIRY_STATUSES.map((s) => ({ value: s.value, label: s.label, n: counts[s.value] ?? 0 }))].map((t) => {
          const active = (sp.status ?? "") === t.value;
          return (
            <Link
              key={t.value || "all"}
              href={`/admin/enquiries${qs({ status: t.value || undefined, page: undefined })}`}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                active ? "border-deep-teal bg-deep-teal text-white" : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              {t.label} <span className={active ? "text-white/70" : "text-text-light"}>{t.n}</span>
            </Link>
          );
        })}
      </div>

      <form method="get" className="adm-card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <div className="relative sm:col-span-2">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Search name, phone, email, reference…" className="adm-input pl-9" aria-label="Search" />
        </div>
        <select name="type" defaultValue={sp.type ?? ""} className="adm-input" aria-label="Type">
          <option value="">All types</option>
          {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select name="assigned" defaultValue={sp.assigned ?? ""} className="adm-input" aria-label="Assigned to">
          <option value="">Anyone</option>
          <option value="none">Unassigned</option>
          {staff.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <input type="date" name="from" defaultValue={sp.from ?? ""} className="adm-input" aria-label="From date" />
        <input type="date" name="to" defaultValue={sp.to ?? ""} className="adm-input" aria-label="To date" />
        <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-6">
          <button type="submit" className="adm-btn-dark">Apply filters</button>
          {(sp.q || sp.type || sp.assigned || sp.from || sp.to) && (
            <Link href={`/admin/enquiries${sp.status ? `?status=${sp.status}` : ""}`} className="text-xs font-semibold text-gold hover:text-gold-dark">
              Clear filters
            </Link>
          )}
        </div>
      </form>

      <div className="adm-card overflow-hidden">
        <EnquiryTable
          canWrite={canWrite}
          canDelete={user.role === "admin"}
          rows={rows.map((r) => ({
            id: r.id, ref: r.ref, name: r.name, phone: r.phone, email: r.email, type: r.type, status: r.status,
            item_name: r.item_name, assigned_name: r.assigned_name,
            created: formatDateTime(r.created_at), ago: timeAgo(r.created_at),
          }))}
        />
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefFor={(p) => `/admin/enquiries${qs({ page: String(p) })}`} />
      </div>
    </>
  );
}
