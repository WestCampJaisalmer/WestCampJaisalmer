import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/dal";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Paged list of uploaded images, used by the "choose from library" picker. */
export async function GET(req: Request) {
  const user = await getApiUser("editor");
  if (!user) return NextResponse.json({ ok: false, error: "Not authorised." }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const size = 24;
  const q = (sp.get("q") ?? "").trim();
  const like = `%${q.replace(/[%_\\]/g, (m) => "\\" + m)}%`;

  const [files, total] = await Promise.all([
    query(
      `select id, url, name, width, height from media where name ilike $1 order by created_at desc limit ${size} offset ${(page - 1) * size}`,
      [like]
    ),
    queryOne<{ n: number }>(`select count(*)::int as n from media where name ilike $1`, [like]),
  ]);
  return NextResponse.json({ ok: true, files, total: total?.n ?? 0, page, pages: Math.max(1, Math.ceil((total?.n ?? 0) / size)) });
}
