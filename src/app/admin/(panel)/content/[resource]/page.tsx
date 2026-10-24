import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { hasRole, requireUser } from "@/lib/auth/dal";
import { query } from "@/lib/db";
import { rowToItem } from "@/lib/resources";
import { resolveResource } from "@/lib/resource-server";
import { Flash, PageHeader, formatDateTime } from "@/components/admin/ui";
import ResourceTable from "@/components/admin/ResourceTable";

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }) {
  const def = await resolveResource((await params).resource);
  return { title: def?.plural ?? "Content" };
}

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ saved?: string; status?: string }>;
}) {
  const user = await requireUser("viewer");
  const { resource } = await params;
  const { saved, status: statusParam } = await searchParams;
  const def = await resolveResource(resource);
  if (!def) notFound();

  const raw = await query(`select * from ${def.table} order by sort_order asc, created_at asc`);
  let rows = raw.map((r) => {
    const item = rowToItem(def, r);
    if (def.key === "testimonials") {
      // moderation info is admin-only; it is never part of the public content payload
      item.status = r.status;
      item.guestEmail = r.guest_email ?? undefined;
      item.submittedAt = r.created_at ? formatDateTime(r.created_at) : undefined;
      item.fromGuest = !!r.ip;
    }
    return item;
  });

  const isReviews = def.key === "testimonials";
  const reviewCounts = isReviews
    ? { all: rows.length, pending: rows.filter((r) => r.status === "pending").length, approved: rows.filter((r) => r.status === "approved").length, rejected: rows.filter((r) => r.status === "rejected").length }
    : null;
  // Default to the moderation queue when something is waiting
  const tab = isReviews ? (statusParam ?? (reviewCounts!.pending > 0 ? "pending" : "all")) : "all";
  if (isReviews && tab !== "all") rows = rows.filter((r) => r.status === tab);

  let categoryLabels: Record<string, string> | undefined;
  if (def.key === "gallery-images") {
    const cats = await query<{ id: string; label: string }>(`select id, label from gallery_categories`);
    categoryLabels = Object.fromEntries(cats.map((c) => [c.id, c.label]));
  }

  const canWrite = hasRole(user.role, "editor");

  return (
    <>
      <PageHeader
        title={def.plural}
        description={def.description}
        actions={
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            {def.publicPath && (
              <a href={def.publicPath} target="_blank" rel="noreferrer" className="adm-btn-ghost flex-1 justify-center sm:flex-none"><ExternalLink size={15} /> View on site</a>
            )}
            {canWrite && (
              <Link href={`/admin/content/${def.key}/new`} className="adm-btn-primary flex-1 justify-center sm:flex-none">
                <Plus size={16} /> {def.key === "gallery-categories" ? "Add" : `Add ${def.singular.toLowerCase()}`}
              </Link>
            )}
          </div>
        }
      />
      {saved && <Flash>Saved. The website will show the change within moments.</Flash>}
      {reviewCounts && (
        <div className="-mx-3.5 mb-4 flex gap-2 overflow-x-auto px-3.5 pb-2 pt-0.5 no-scrollbar sm:mx-0 sm:px-0">
          {([["all", "All"], ["pending", "Awaiting approval"], ["approved", "Approved"], ["rejected", "Rejected"]] as const).map(([k, label]) => (
            <Link
              key={k}
              href={`/admin/content/testimonials?status=${k}`}
              aria-current={tab === k ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                tab === k ? "border-deep-teal bg-deep-teal text-white shadow-sm" : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              {label} <span className={tab === k ? "text-white/70" : k === "pending" && reviewCounts.pending > 0 ? "text-gold-dark" : "text-text-light"}>{reviewCounts[k]}</span>
            </Link>
          ))}
        </div>
      )}
      <div className="adm-card overflow-hidden">
        <ResourceTable def={def} rows={rows} canWrite={canWrite} categoryLabels={categoryLabels} canReorder={tab === "all"} />
      </div>
      {canWrite && rows.length > 1 && (
        <p className="mt-3 text-xs text-text-light">Tip: use the arrows to change the order items appear in on the website.</p>
      )}
    </>
  );
}
