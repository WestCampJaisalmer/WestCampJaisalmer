import "server-only";
import { query } from "@/lib/db";

export interface Actor {
  id: string;
  name: string;
}

/** Best-effort audit trail; never lets a logging failure break the real operation. */
export async function logActivity(
  actor: Actor | null,
  action: string,
  entity: string,
  entityId: string | number | null,
  summary: string
) {
  try {
    await query(
      `insert into activity_log (user_id, user_name, action, entity, entity_id, summary)
       values ($1,$2,$3,$4,$5,$6)`,
      [actor?.id ?? null, actor?.name ?? "System", action, entity, entityId === null ? null : String(entityId), summary.slice(0, 300)]
    );
  } catch (err) {
    console.error("[audit] failed to write activity log", err);
  }
}
