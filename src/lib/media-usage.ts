import "server-only";
import { query } from "@/lib/db";

const IMAGE_COLUMNS: { table: string; column: string; label: string }[] = [
  { table: "hotels", column: "image", label: "Hotels" },
  { table: "camps", column: "image", label: "Camps" },
  { table: "tours", column: "image", label: "Tours" },
  { table: "destinations", column: "image", label: "Destinations" },
  { table: "packages", column: "image", label: "Packages" },
  { table: "testimonials", column: "avatar", label: "Testimonials" },
  { table: "gallery_images", column: "src", label: "Gallery" },
];

/** For each given URL, the list of content sections that currently reference it. */
export async function mediaUsage(urls: string[]): Promise<Map<string, string[]>> {
  const usage = new Map<string, string[]>();
  if (!urls.length) return usage;
  const results = await Promise.all(
    IMAGE_COLUMNS.map(async (c) => ({
      label: c.label,
      rows: await query<{ u: string }>(
        `select distinct ${c.column} as u from ${c.table} where ${c.column} = any($1::text[])`,
        [urls]
      ),
    }))
  );
  for (const r of results) {
    for (const row of r.rows) {
      const list = usage.get(row.u) ?? [];
      if (!list.includes(r.label)) list.push(r.label);
      usage.set(row.u, list);
    }
  }
  return usage;
}
