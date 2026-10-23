"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, Pencil, Search, Star, Trash2, X } from "lucide-react";
import { bulkResource, deleteResource, moveResource, reviewDecision, toggleResourceFlag } from "@/app/admin/actions/content";
import type { ResourceDef } from "@/lib/resources";
import { EmptyState, Pill } from "@/components/admin/ui";

interface Props {
  def: ResourceDef;
  rows: Record<string, any>[];
  canWrite: boolean;
  /** category id -> label, for gallery photos */
  categoryLabels?: Record<string, string>;
  /** false when the list is filtered, because arrows reorder the full list */
  canReorder?: boolean;
}

function cellValue(def: ResourceDef, name: string, row: Record<string, any>, categoryLabels?: Record<string, string>) {
  const v = row[name];
  if (v === undefined || v === null || v === "") return <span className="text-text-light">—</span>;
  if (name === "price") return <b className="text-deep-teal">₹{Number(v).toLocaleString("en-IN")}</b>;
  if (name === "rating") return <span className="inline-flex items-center gap-1"><Star size={13} className="fill-gold text-gold" />{Number(v).toFixed(1)}</span>;
  if (name === "category") return <Pill tone="neutral">{categoryLabels?.[v] ?? v}</Pill>;
  return String(v);
}

export default function ResourceTable({ def, rows, canWrite, categoryLabels, canReorder = true }: Props) {
  const isReviews = def.key === "testimonials";
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => def.searchColumns.some((c) => {
      const field = def.fields.find((f) => f.column === c);
      const val = r[field?.name ?? c] ?? r[c];
      return String(val ?? "").toLowerCase().includes(needle);
    }));
  }, [rows, q, def]);

  const searching = q.trim() !== "";
  const allOn = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  function run(id: string | null, fn: () => Promise<{ ok: boolean; error?: string; message?: string }>) {
    setBusyId(id);
    start(async () => {
      const res = await fn();
      setMsg(res.ok ? (res.message ? { tone: "ok", text: res.message } : null) : { tone: "err", text: res.error ?? "Something went wrong." });
      setBusyId(null);
      if (res.ok) setSelected(new Set());
      router.refresh();
    });
  }

  const onDelete = (r: Record<string, any>) => {
    const name = r[def.titleField] ?? r.id;
    if (!window.confirm(`Delete "${name}"? This removes it from the website and cannot be undone.`)) return;
    run(r.id, () => deleteResource(def.key, r.id));
  };

  const onBulk = (op: "show" | "hide" | "delete") => {
    if (op === "delete" && !window.confirm(`Delete ${selected.size} selected item(s)? This cannot be undone.`)) return;
    run(null, () => bulkResource(def.key, [...selected], op));
  };

  const thumb = def.imageField;
  const colFields = def.listColumns.map((c) => def.fields.find((f) => f.name === c)!).filter(Boolean);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-border-light p-4">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${def.plural.toLowerCase()}…`} className="adm-input pl-9" aria-label={`Search ${def.plural}`} />
        </div>
        <span className="text-xs text-text-muted">{filtered.length} of {rows.length}</span>
        {pending && <Loader2 size={16} className="animate-spin text-gold" />}
      </div>

      {canWrite && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gold/30 bg-gold/10 px-4 py-2.5 text-sm">
          <span className="font-semibold text-deep-teal">{selected.size} selected</span>
          <button className="adm-btn-ghost adm-btn-sm" disabled={pending} onClick={() => onBulk("show")}><Eye size={13} /> Show</button>
          <button className="adm-btn-ghost adm-btn-sm" disabled={pending} onClick={() => onBulk("hide")}><EyeOff size={13} /> Hide</button>
          <button className="adm-btn-danger adm-btn-sm" disabled={pending} onClick={() => onBulk("delete")}><Trash2 size={13} /> Delete</button>
          <button className="ml-auto text-xs font-semibold text-text-muted hover:text-deep-teal" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}
      {msg && (
        <p role={msg.tone === "err" ? "alert" : "status"} className={`px-4 py-2 text-sm font-medium ${msg.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={rows.length ? "Nothing matches your search" : `No ${def.plural.toLowerCase()} yet`}
          text={rows.length ? undefined : `Add your first ${def.singular.toLowerCase()} to show it on the website.`}
          action={!rows.length && canWrite ? <Link href={`/admin/content/${def.key}/new`} className="adm-btn-primary">Add {def.singular.toLowerCase()}</Link> : undefined}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-border-light bg-cream">
              <tr>
                {canWrite && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allOn}
                      onChange={() => setSelected(allOn ? new Set() : new Set(filtered.map((r) => r.id)))}
                      className="h-4 w-4 cursor-pointer accent-gold"
                      aria-label="Select all"
                    />
                  </th>
                )}
                <th className="adm-th">{def.singular}</th>
                {colFields.map((f) => <th key={f.name} className="adm-th">{f.label.replace(/ \(₹\)| per night \(₹\)/, "")}</th>)}
                <th className="adm-th">Status</th>
                {canWrite && <th className="adm-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((r) => {
                const idx = rows.findIndex((x) => x.id === r.id);
                const busy = busyId === r.id;
                return (
                  <tr key={r.id} className={`transition hover:bg-cream ${!r.active && !(isReviews && r.status === "pending") ? "opacity-60" : ""} ${selected.has(r.id) ? "bg-gold/5" : ""}`}>
                    {canWrite && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => setSelected((s) => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                          className="h-4 w-4 cursor-pointer accent-gold"
                          aria-label={`Select ${r[def.titleField]}`}
                        />
                      </td>
                    )}
                    <td className="adm-td">
                      <div className="flex items-center gap-3">
                        {thumb && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r[thumb] || "/images/Jaisalmer_logo.png"}
                            alt=""
                            loading="lazy"
                            className="h-11 w-14 shrink-0 rounded-sm bg-cream-alt object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <Link href={`/admin/content/${def.key}/${r.id}`} className="block truncate font-semibold text-deep-teal hover:text-gold">
                            {r[def.titleField]}
                          </Link>
                          {def.subtitleField && <span className="block truncate text-xs text-text-muted">{r[def.subtitleField]}</span>}
                          {isReviews && (
                            <>
                              <span className="mt-1 line-clamp-2 block max-w-md whitespace-normal text-xs text-text-main/80">&ldquo;{r.review}&rdquo;</span>
                              {(r.fromGuest || r.guestEmail) && (
                                <span className="mt-0.5 block text-[11px] text-text-light">
                                  Submitted by guest{r.guestEmail ? ` · ${r.guestEmail}` : ""}{r.submittedAt ? ` · ${r.submittedAt}` : ""}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    {colFields.map((f) => <td key={f.name} className="adm-td">{cellValue(def, f.name, r, categoryLabels)}</td>)}
                    <td className="adm-td">
                      <div className="flex flex-wrap gap-1.5">
                        {isReviews && r.status === "pending" ? (
                          <Pill tone="gold">Awaiting approval</Pill>
                        ) : isReviews && r.status === "rejected" ? (
                          <Pill tone="muted">Rejected</Pill>
                        ) : (
                          <Pill tone={r.active ? "green" : "muted"}>{r.active ? "Live" : "Hidden"}</Pill>
                        )}
                        {def.hasFeatured && r.featured && <Pill tone="gold">Featured</Pill>}
                      </div>
                    </td>
                    {canWrite && (
                      <td className="adm-td">
                        <div className="flex items-center justify-end gap-0.5">
                          {isReviews && r.status !== "approved" && (
                            <button
                              title="Approve and publish" disabled={pending}
                              onClick={() => run(r.id, () => reviewDecision(r.id, "approve"))}
                              className="adm-btn adm-btn-sm mr-1 bg-emerald-600 text-white hover:bg-emerald-700"
                            ><Check size={13} /> Approve</button>
                          )}
                          {isReviews && r.status === "pending" && (
                            <button
                              title="Reject (keeps it hidden)" disabled={pending}
                              onClick={() => run(r.id, () => reviewDecision(r.id, "reject"))}
                              className="adm-btn-ghost adm-btn-sm mr-1"
                            ><X size={13} /> Reject</button>
                          )}
                          {isReviews && r.status === "approved" && (
                            <button
                              title="Unpublish and mark as rejected" disabled={pending}
                              onClick={() => run(r.id, () => reviewDecision(r.id, "reject"))}
                              className="adm-btn-ghost adm-btn-sm mr-1"
                            ><X size={13} /> Unpublish</button>
                          )}
                          <button
                            title="Move up" aria-label="Move up" disabled={pending || searching || !canReorder || idx === 0}
                            onClick={() => run(r.id, () => moveResource(def.key, r.id, "up"))}
                            className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt hover:text-deep-teal disabled:cursor-not-allowed disabled:opacity-30"
                          ><ArrowUp size={15} /></button>
                          <button
                            title="Move down" aria-label="Move down" disabled={pending || searching || !canReorder || idx === rows.length - 1}
                            onClick={() => run(r.id, () => moveResource(def.key, r.id, "down"))}
                            className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt hover:text-deep-teal disabled:cursor-not-allowed disabled:opacity-30"
                          ><ArrowDown size={15} /></button>
                          {def.hasFeatured && (
                            <button
                              title={r.featured ? "Remove from featured" : "Mark as featured"} aria-label="Toggle featured" disabled={pending}
                              onClick={() => run(r.id, () => toggleResourceFlag(def.key, r.id, "featured"))}
                              className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt hover:text-gold"
                            ><Star size={15} className={r.featured ? "fill-gold text-gold" : ""} /></button>
                          )}
                          <button
                            title={r.active ? "Hide from website" : "Show on website"} aria-label="Toggle visibility" disabled={pending}
                            onClick={() => run(r.id, () => toggleResourceFlag(def.key, r.id, "active"))}
                            className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt hover:text-deep-teal"
                          >{busy ? <Loader2 size={15} className="animate-spin" /> : r.active ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                          <Link title="Edit" aria-label="Edit" href={`/admin/content/${def.key}/${r.id}`} className="rounded-sm p-1.5 text-text-muted hover:bg-cream-alt hover:text-deep-teal"><Pencil size={15} /></Link>
                          <button
                            title="Delete" aria-label="Delete" disabled={pending} onClick={() => onDelete(r)}
                            className="cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-red-50 hover:text-red-600"
                          ><Trash2 size={15} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
