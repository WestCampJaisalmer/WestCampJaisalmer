"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, Loader2, Phone, Trash2 } from "lucide-react";
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
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-gold/30 bg-gold/15 px-3.5 py-2.5 text-xs sm:gap-3 sm:px-4 sm:text-sm">
          <span className="font-semibold text-deep-teal">{selected.size} selected</span>
          <select
            className="adm-input !w-auto !py-1 text-xs"
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
            <button type="button" className="adm-btn-danger adm-btn-sm !py-1 text-xs" disabled={pending} onClick={() => run("delete")}>
              <Trash2 size={13} /> Delete
            </button>
          )}
          {pending && <Loader2 size={14} className="animate-spin text-gold" />}
          <button type="button" className="ml-auto font-semibold text-text-muted hover:text-deep-teal" onClick={() => setSelected(new Set())}>
            Clear
          </button>
        </div>
      )}
      {msg && (
        <p role="status" className={`px-4 py-2 text-sm font-medium ${msg.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      {/* Mobile card list view */}
      {canWrite && (
        <div className="flex items-center justify-between border-b border-border-light bg-cream/40 px-3.5 py-2 text-xs md:hidden">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-text-muted">
            <input
              type="checkbox"
              checked={allOn}
              onChange={() => setSelected(allOn ? new Set() : new Set(rows.map((r) => r.id)))}
              className="h-4 w-4 cursor-pointer accent-gold"
            />
            <span>Select all inquiries</span>
          </label>
          <span className="text-[11px] text-text-light">{rows.length} total</span>
        </div>
      )}

      <div className="divide-y divide-border-light md:hidden">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`p-3.5 transition hover:bg-cream/40 ${selected.has(r.id) ? "bg-gold/5" : ""} ${r.status === "new" ? "bg-amber-50/20" : ""}`}
          >
            {/* Top row: Checkbox, Name, Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2.5">
                {canWrite && (
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    aria-label={`Select ${r.name}`}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-gold"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {r.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="New" />}
                    <Link href={`/admin/enquiries/${r.id}`} className="truncate text-sm font-semibold text-deep-teal hover:text-gold">
                      {r.name}
                    </Link>
                    <span className="font-mono text-[10px] text-text-light">({r.ref})</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {r.phone || r.email || "No contact info"}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <StatusBadge status={r.status} />
              </div>
            </div>

            {/* Middle row: Request info */}
            <div className="mt-2.5 rounded-sm bg-cream/60 px-2.5 py-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-text-main">{typeLabel(r.type)}</span>
                <span className="text-[11px] text-text-light">{r.ago}</span>
              </div>
              {r.item_name && (
                <p className="mt-0.5 truncate text-[11px] text-text-muted">{r.item_name}</p>
              )}
            </div>

            {/* Bottom row: Assigned & Action Buttons */}
            <div className="mt-2.5 flex items-center justify-between gap-2 pt-1 text-xs">
              <div className="truncate text-[11px] text-text-muted">
                <span className="text-text-light">Assigned: </span>
                <span className="font-medium text-text-main">{r.assigned_name ?? "—"}</span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {r.phone && (
                  <a
                    href={`tel:${r.phone}`}
                    className="flex h-7 w-7 items-center justify-center rounded-sm border border-border-light bg-white text-text-muted transition hover:border-gold hover:text-gold"
                    title={`Call ${r.phone}`}
                  >
                    <Phone size={13} />
                  </a>
                )}
                <Link
                  href={`/admin/enquiries/${r.id}`}
                  className="adm-btn-ghost adm-btn-sm inline-flex items-center gap-1.5 !py-1 text-xs font-semibold text-deep-teal hover:border-gold hover:text-gold"
                  title={`View ${r.name}'s enquiry`}
                >
                  <Eye size={13} />
                  <span>View</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[880px]">
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
              <th className="adm-th text-right">Actions</th>
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
                <td className="adm-td text-right">
                  <Link
                    href={`/admin/enquiries/${r.id}`}
                    className="adm-btn-ghost adm-btn-sm inline-flex items-center gap-1.5 hover:border-gold hover:text-gold"
                    title={`View ${r.name}'s enquiry`}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
