"use server";

import { query, queryOne } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/audit";
import { deleteFromImageKit } from "@/lib/imagekit";
import { mediaUsage } from "@/lib/media-usage";
import type { ActionResult } from "@/lib/action-types";

const UUID = /^[0-9a-f-]{36}$/i;

/**
 * Removes the file from ImageKit and the library. Pages that still reference the URL will
 * show a broken image, so the UI warns before calling this.
 */
export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await requireUser("editor");
  if (!UUID.test(id)) return { ok: false, error: "Invalid request." };

  const row = await queryOne<{ file_id: string; name: string; url: string }>(`select file_id, name, url from media where id = $1`, [id]);
  if (!row) return { ok: false, error: "File not found." };

  const usedIn = (await mediaUsage([row.url])).get(row.url);
  if (usedIn?.length) {
    return { ok: false, error: `This image is still used in: ${usedIn.join(", ")}. Replace it there first.` };
  }

  try {
    await deleteFromImageKit(row.file_id);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  await query(`delete from media where id = $1`, [id]);
  await logActivity(user, "delete", "media", id, `Deleted image ${row.name}`);
  return { ok: true };
}
