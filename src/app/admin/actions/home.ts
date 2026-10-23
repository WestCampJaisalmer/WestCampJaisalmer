"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { CONTENT_TAG } from "@/lib/content";
import { DEFAULT_HOME, HOME_SECTIONS, type HomeContent } from "@/lib/home-defaults";
import { IMAGE_URL_ERROR, isAllowedImageUrl } from "@/lib/image-url";
import type { FormState } from "@/lib/action-types";

const FIELD_BY_KEY = new Map(HOME_SECTIONS.flatMap((s) => s.fields).map((f) => [f.key, f]));

export async function saveHome(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("editor");

  const stored: Partial<HomeContent> = {};
  const fieldErrors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const key of Object.keys(DEFAULT_HOME) as (keyof HomeContent)[]) {
    const field = FIELD_BY_KEY.get(key);
    const raw = typeof fd.get(key) === "string" ? (fd.get(key) as string).trim() : "";
    values[key] = raw;
    if (!field) continue;

    if (field.type === "image") {
      if (raw && !isAllowedImageUrl(raw)) fieldErrors[key] = IMAGE_URL_ERROR;
    } else if (raw.length > (field.type === "textarea" ? 600 : 200)) {
      fieldErrors[key] = "That's too long.";
    }
    // Only keep values that differ from the original, so "reset" is simply clearing a field.
    if (raw && raw !== DEFAULT_HOME[key]) stored[key] = raw;
  }

  if (Object.keys(fieldErrors).length) {
    return { error: "Please fix the highlighted fields.", fieldErrors, values };
  }

  await query(
    `insert into settings (key, value, updated_at) values ('home', $1, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [JSON.stringify(stored)]
  );
  await logActivity(user, "update", "home-page", "home", "Updated home page content");
  updateTag(CONTENT_TAG);
  return { success: "Home page updated. Visitors will see the changes within moments." };
}

export async function resetHome(): Promise<void> {
  const user = await requireUser("editor");
  await query(`delete from settings where key = 'home'`);
  await logActivity(user, "reset", "home-page", "home", "Reset home page to the original design");
  updateTag(CONTENT_TAG);
  redirect("/admin/home-page?reset=1");
}
