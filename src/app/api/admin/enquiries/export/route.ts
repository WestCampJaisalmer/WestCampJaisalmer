import { getApiUser } from "@/lib/auth/dal";
import { listEnquiriesForExport } from "@/lib/enquiries";
import { logActivity } from "@/lib/audit";
import { statusLabel, typeLabel } from "@/lib/enquiry-constants";

export const dynamic = "force-dynamic";

/** Neutralises spreadsheet formula injection (=, +, -, @) in guest-supplied text. */
function cell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const user = await getApiUser("editor");
  if (!user) return new Response("Not authorised", { status: 401 });

  const sp = new URL(req.url).searchParams;
  const rows = await listEnquiriesForExport({
    q: sp.get("q") ?? undefined,
    status: sp.get("status") ?? undefined,
    type: sp.get("type") ?? undefined,
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
    assigned: sp.get("assigned") ?? undefined,
  });

  const header = ["Reference", "Received (IST)", "Type", "Status", "Name", "Phone", "Email", "Item", "Subject", "Message", "Assigned to", "Source page"];
  const lines = [header.map(cell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.ref,
        new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        typeLabel(r.type),
        statusLabel(r.status),
        r.name,
        r.phone,
        r.email,
        r.item_name,
        r.subject,
        r.message,
        r.assigned_name,
        r.source_page,
      ].map(cell).join(",")
    );
  }
  await logActivity(user, "export", "enquiry", null, `Exported ${rows.length} enquiries to CSV`);

  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
