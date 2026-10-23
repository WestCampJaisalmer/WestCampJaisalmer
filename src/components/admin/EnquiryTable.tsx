"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { bulkEnquiries } from "@/app/admin/actions/enquiries";
import { ENQUIRY_STATUSES, typeLabel } from "@/lib/enquiry-constants";
import { StatusBadge, EmptyState } from "@/components/admin/ui";

export interface EnquiryListItem {
  id: string;
  ref: string;
  name: string;
  phone: string | null;
  email: string | null;
  type: string;
  status: string;
  item_name: string | null;
  assigned_name: string | null;
  created: string; // pre-formatted
  ago: string;
}

export default function EnquiryTable({ rows, canWrite, canDelete }: { rows: EnquiryListItem[]; canWrite: boolean; canDelete: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const allOn = rows.length > 0 && selected.size === rows.length;
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  function run(op: string) {
    if (!selected.size) return;
    if (op === "delete" && !window.confirm(`Permanently delete ${selected.size} enquiries? This cannot be undone.`)) return;
    start(async () => {
      const res = await bulkEnquiries([...selected], op);
      if (res.ok) {
        setMsg({ tone: "ok", text: res.message ?? "Done." });
        setSelected(new Set());
        router.refresh();
      } else setMsg({ tone: "err", text: res.error });
    });
  }

  if (!rows.length) {
    return <EmptyState title="No enquiries found" text="Try clearing the filters, or wait for guests to use the website forms." />;
  }

  return (
    <div>
      {canWrite && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-gold/30 bg-gold/10 px-4 py-2.5 text-sm">
          <span className="font-semibold text-deep-teal">{selected.size} selected</span>
          <select
            className="adm-input !w-auto !py-1.5 text-xs"
            defaultValue=""
            disabled={pending}
            onChange={(e) => {
              if (e.target.value) run(e.target.value);
              e.target.value = "";
            }}
            aria-label="Set status for selected"
          >
            <option value="" disabled>Set status…</option>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {canDelete && (
            <button type="button" className="adm-btn-danger adm-btn-sm" disabled={pending} onClick={() => run("delete")}>
              <Trash2 size={13} /> Delete
            </button>
          )}
          {pending && <Loader2 size={15} className="animate-spin text-gold" />}
          <button type="button" className="ml-auto text-xs font-semibold text-text-muted hover:text-deep-teal" onClick={() => setSelected(new Set())}>
            Clear
          </button>
        </div>
      )}
      {msg && (
        <p role="status" className={`px-4 py-2 text-sm font-medium ${msg.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-border-light bg-cream">
            <tr>
              {canWrite && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOn}
                    onChange={() => setSelected(allOn ? new Set() : new Set(rows.map((r) => r.id)))}
                    aria-label="Select all"
                    className="h-4 w-4 cursor-pointer accent-gold"
                  />
                </th>
              )}
              <th className="adm-th">Guest</th>
              <th className="adm-th">Request</th>
              <th className="adm-th">Status</th>
              <th className="adm-th">Assigned</th>
              <th className="adm-th">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {rows.map((r) => (
              <tr key={r.id} className={`transition hover:bg-cream ${selected.has(r.id) ? "bg-gold/5" : ""} ${r.status === "new" ? "font-medium" : ""}`}>
                {canWrite && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggle(r.id)}
                      aria-label={`Select ${r.name}`}
                      className="h-4 w-4 cursor-pointer accent-gold"
                    />
                  </td>
                )}
                <td className="adm-td">
                  <Link href={`/admin/enquiries/${r.id}`} className="block">
                    <span className="flex items-center gap-2">
                      {r.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="New" />}
                      <span className="font-semibold text-deep-teal hover:text-gold">{r.name}</span>
                    </span>
                    <span className="block text-xs text-text-muted">{r.phone || r.email || "—"}</span>
                  </Link>
                </td>
                <td className="adm-td">
                  <span className="block">{typeLabel(r.type)}</span>
                  {r.item_name && <span className="block max-w-[220px] truncate text-xs text-text-muted">{r.item_name}</span>}
                </td>
                <td className="adm-td"><StatusBadge status={r.status} /></td>
                <td className="adm-td text-xs text-text-muted">{r.assigned_name ?? "—"}</td>
                <td className="adm-td whitespace-nowrap text-xs text-text-muted">
                  {r.created}
                  <span className="block text-text-light">{r.ago}</span>
                  <span className="block font-mono text-[10px] text-text-light">{r.ref}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
