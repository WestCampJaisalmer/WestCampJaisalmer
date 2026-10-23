import { hasRole, requireUser } from "@/lib/auth/dal";
import { query, queryOne } from "@/lib/db";
import { mediaUsage } from "@/lib/media-usage";
import { PageHeader, Pagination, formatDate } from "@/components/admin/ui";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata = { title: "Media library" };

const SIZE = 30;

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireUser("viewer");
  const page = Math.max(1, Number((await searchParams).page) || 1);

  const [rows, total] = await Promise.all([
    query<{ id: string; url: string; name: string; size: number | null; width: number | null; height: number | null; uploaded_by: string | null; created_at: Date }>(
      `select id,url,name,size,width,height,uploaded_by,created_at from media order by created_at desc limit ${SIZE} offset ${(page - 1) * SIZE}`
    ),
    queryOne<{ n: number }>(`select count(*)::int as n from media`),
  ]);
  const usage = await mediaUsage(rows.map((r) => r.url));

  return (
    <>
      <PageHeader title="Media library" description="Images uploaded to ImageKit. Pick them from any content form." />
      <MediaLibrary
        canWrite={hasRole(user.role, "editor")}
        items={rows.map((r) => ({
          id: r.id, url: r.url, name: r.name, size: r.size, width: r.width, height: r.height,
          by: r.uploaded_by, when: formatDate(r.created_at), usedIn: usage.get(r.url) ?? [],
        }))}
      />
      <div className="adm-card mt-5 overflow-hidden empty:hidden">
        <Pagination page={page} pageSize={SIZE} total={total?.n ?? 0} hrefFor={(p) => `/admin/media?page=${p}`} />
      </div>
      <p className="mt-4 text-xs text-text-light">
        The original images that shipped with the website live in the project&apos;s <code>public/images</code> folder and aren&apos;t listed here.
      </p>
    </>
  );
}
