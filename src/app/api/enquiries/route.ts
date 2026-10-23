import { NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { getClientIp } from "@/lib/auth/dal";
import { enquiryFloodCount } from "@/lib/rate-limit";
import { getSettings } from "@/lib/content";
import { ENQUIRY_TYPES } from "@/lib/enquiry-constants";

export const dynamic = "force-dynamic";

const clean = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);

const schema = z.object({
  type: z.enum(ENQUIRY_TYPES.map((t) => t.value) as [string, ...string[]]),
  name: z.string().trim().min(1).max(120),
  email: clean(200),
  phone: clean(40),
  subject: clean(200),
  message: clean(5000),
  details: z.record(z.string(), z.unknown()).optional(),
  itemType: clean(40),
  itemId: clean(120),
  itemName: clean(200),
  sourcePage: clean(300),
  // honeypot: real users never fill this in
  website: z.string().optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form fields." }, { status: 400 });
  }
  const d = parsed.data;

  // Bots fill the honeypot; pretend success so they don't retry.
  if (d.website) return NextResponse.json({ ok: true });

  if (d.email && !z.string().email().safeParse(d.email).success) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
  }

  const ip = await getClientIp();
  if ((await enquiryFloodCount(ip)) >= 15) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try later." }, { status: 429 });
  }

  const settings = await getSettings();
  if (!settings.enquiriesEnabled) {
    return NextResponse.json({ ok: false, error: "Enquiries are currently paused." }, { status: 503 });
  }

  // Cap stored details so nobody can stuff the table with huge JSON.
  let details = d.details ?? {};
  if (JSON.stringify(details).length > 8000) details = {};

  const row = await queryOne<{ ref: string }>(
    `insert into enquiries (type,name,email,phone,subject,message,details,item_type,item_id,item_name,source_page,ip)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning ref`,
    [d.type, d.name, d.email ?? null, d.phone ?? null, d.subject ?? null, d.message ?? null,
      JSON.stringify(details), d.itemType ?? null, d.itemId ?? null, d.itemName ?? null, d.sourcePage ?? null, ip]
  );

  return NextResponse.json({ ok: true, ref: row?.ref });
}
