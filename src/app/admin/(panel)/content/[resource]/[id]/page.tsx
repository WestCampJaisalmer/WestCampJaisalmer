import { notFound } from "next/navigation";
import { hasRole, requireUser } from "@/lib/auth/dal";
import { queryOne } from "@/lib/db";
import { rowToItem } from "@/lib/resources";
import { resolveResource } from "@/lib/resource-server";
import { PageHeader } from "@/components/admin/ui";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const user = await requireUser("viewer");
  const { resource, id } = await params;
  const def = await resolveResource(resource);
  if (!def) notFound();

  const row = await queryOne(`select * from ${def.table} where id = $1`, [id]);
  if (!row) notFound();
  const item = rowToItem(def, row);

  return (
    <>
      <PageHeader
        back={{ href: `/admin/content/${def.key}`, label: def.plural }}
        title={String(item[def.titleField] ?? def.singular)}
        description={hasRole(user.role, "editor") ? `Editing ${def.singular.toLowerCase()}` : "You have view-only access."}
      />
      {hasRole(user.role, "editor") ? (
        <ResourceForm def={def} id={id} item={item} />
      ) : (
        <p className="adm-card p-6 text-sm text-text-muted">Your role (viewer) can&apos;t edit content.</p>
      )}
    </>
  );
}
