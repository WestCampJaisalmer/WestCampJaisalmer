"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { CONTENT_TAG, getSettings } from "@/lib/content";
import type { FormState } from "@/lib/action-types";
import type { SiteSettings } from "@/lib/settings-defaults";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Links must start with http:// or https://");

const rate = z.coerce.number().positive("Exchange rates must be greater than 0.").max(100000);

const schema = z.object({
  siteName: z.string().trim().min(1, "Site name is required.").max(80),
  tagline: z.string().trim().max(120),
  whatsappNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^0-9]/g, ""))
    .refine((v) => v.length >= 8 && v.length <= 15, "WhatsApp number must be 8-15 digits including country code."),
  phone: z.string().trim().min(3, "Phone is required.").max(40),
  email: z.string().trim().email("Enter a valid contact email."),
  address: z.string().trim().max(300),
  mapEmbedUrl: optionalUrl,
  seoTitle: z.string().trim().max(120),
  seoDescription: z.string().trim().max(320),
  seoKeywords: z.string().trim().max(400),
  announcementText: z.string().trim().max(240),
  announcementLink: optionalUrl.or(z.string().trim().startsWith("/")),
  facebook: optionalUrl,
  instagram: optionalUrl,
  youtube: optionalUrl,
  twitter: optionalUrl,
  rateUSD: rate,
  rateEUR: rate,
  rateGBP: rate,
  rateAED: rate,
});

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("admin");
  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") values[k] = v;

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { error: parsed.error.issues[0].message, fieldErrors, values };
  }

  const current = await getSettings();
  const next: SiteSettings = {
    ...current,
    ...parsed.data,
    announcementEnabled: fd.get("announcementEnabled") === "on",
    enquiriesEnabled: fd.get("enquiriesEnabled") === "on",
  };

  await query(
    `insert into settings (key, value, updated_at) values ('site', $1, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [JSON.stringify(next)]
  );
  await logActivity(user, "update", "settings", "site", "Updated site settings");
  updateTag(CONTENT_TAG);
  return { success: "Settings saved. The public site updates within moments." };
}
