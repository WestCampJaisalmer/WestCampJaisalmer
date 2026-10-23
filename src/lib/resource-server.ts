import "server-only";
import { query } from "@/lib/db";
import { getResource, type ResourceDef } from "@/lib/resources";

/** Returns the resource definition with runtime-dependent select options filled in. */
export async function resolveResource(key: string): Promise<ResourceDef | null> {
  const def = getResource(key);
  if (!def) return null;
  if (key === "gallery-images") {
    const cats = await query<{ id: string; label: string }>(
      `select id, label from gallery_categories order by sort_order asc, created_at asc`
    );
    return {
      ...def,
      fields: def.fields.map((f) =>
        f.name === "category" ? { ...f, options: cats.map((c) => ({ value: c.id, label: c.label })) } : f
      ),
    };
  }
  return def;
}
