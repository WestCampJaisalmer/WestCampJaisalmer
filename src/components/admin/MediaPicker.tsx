"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

interface Item {
  id: string;
  url: string;
  name: string;
}

export default function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (p: number, query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/media?page=${p}&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not load images.");
      setItems(data.files);
      setPages(data.pages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(page, q), q ? 250 : 0);
    return () => clearTimeout(t);
  }, [page, q, load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2.5 sm:p-6" role="dialog" aria-modal="true" aria-label="Choose an image">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative flex max-h-[90vh] sm:max-h-[88vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-hover overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 border-b border-border-light p-3 sm:p-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h2 className="font-serif text-base sm:text-lg font-bold text-deep-teal">Media library</h2>
            <button onClick={onClose} className="sm:hidden cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="relative w-full sm:ml-auto sm:max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by file name"
              className="adm-input pl-9"
              aria-label="Search images"
            />
          </div>
          <button onClick={onClose} className="hidden sm:block cursor-pointer rounded-sm p-1.5 text-text-muted hover:bg-cream-alt" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-[240px] flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-text-muted"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <p role="alert" className="py-10 text-center text-sm text-red-600">{error}</p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">No uploaded images yet. Close this and upload one first.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => onPick(it.url)}
                    className="group block w-full cursor-pointer overflow-hidden rounded-sm border border-border-light text-left transition hover:border-gold hover:shadow-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${it.url}?tr=w-300,h-220,fo-auto`} alt={it.name} loading="lazy" className="aspect-[4/3] w-full bg-cream-alt object-cover" />
                    <span className="block truncate px-2 py-1.5 text-[11px] text-text-muted group-hover:text-deep-teal">{it.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-border-light p-3 text-sm">
            <button className="adm-btn-ghost adm-btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span className="text-text-muted">{page} / {pages}</span>
            <button className="adm-btn-ghost adm-btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
