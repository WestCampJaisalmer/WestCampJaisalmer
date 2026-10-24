import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";
import { resolveResource } from "@/lib/resource-server";
import { PageHeader } from "@/components/admin/ui";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  await requireUser("editor");
  const def = await resolveResource((await params).resource);
  if (!def) notFound();

  return (
    <>
      <PageHeader back={{ href: `/admin/content/${def.key}`, label: def.plural }} title={def.key === "gallery-categories" ? "Add" : `Add ${def.singular.toLowerCase()}`} />
      <ResourceForm def={def} id={null} item={null} />
    </>
  );
}
