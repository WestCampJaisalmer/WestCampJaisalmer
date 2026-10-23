import { NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { getClientIp } from "@/lib/auth/dal";
import { slugify } from "@/lib/resources";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  city: z.string().trim().max(80).optional(),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email.")]).optional(),
  rating: z.coerce.number().int().min(1, "Please choose a rating.").max(5, "Please choose a rating from 1 to 5."),
  review: z.string().trim().min(15, "Please write at least a couple of sentences (15+ characters).").max(1000, "Please keep it under 1000 characters."),
  // honeypot: real users never fill this in
  website: z.string().optional(),
});

const MAX_PER_HOUR = 3;

/** Public: a guest submits a review. It is stored as pending and stays hidden until approved in the admin. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 400 });
  }
  const d = parsed.data;

  // Bots fill the honeypot; pretend success so they don't retry.
  if (d.website) return NextResponse.json({ ok: true });

  const ip = await getClientIp();
  const recent = await queryOne<{ n: number }>(
    `select count(*)::int as n from testimonials where ip = $1 and created_at > now() - interval '1 hour'`,
    [ip]
  );
  if ((recent?.n ?? 0) >= MAX_PER_HOUR) {
    return NextResponse.json({ ok: false, error: "You've submitted several reviews recently. Please try again later." }, { status: 429 });
  }

  const base = `review-${slugify(d.name)}`;
  const id = `${base}-${Date.now().toString(36)}`;
  const maxRow = await queryOne<{ m: number | null }>(`select max(sort_order) as m from testimonials`);

  await query(
    `insert into testimonials (id,name,city,avatar,rating,review,active,featured,sort_order,status,guest_email,ip)
     values ($1,$2,$3,'',$4,$5,false,false,$6,'pending',$7,$8)`,
    [id, d.name, d.city ?? "", d.rating, d.review, (maxRow?.m ?? -10) + 10, d.email || null, ip]
  );

  return NextResponse.json({ ok: true });
}
