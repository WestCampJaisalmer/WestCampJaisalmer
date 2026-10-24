"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Trash2, UploadCloud } from "lucide-react";
import { deleteMedia } from "@/app/admin/actions/media";
import { uploadFiles } from "@/components/admin/upload";
import { EmptyState, Pill } from "@/components/admin/ui";

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number | null;
  width: number | null;
  height: number | null;
  by: string | null;
  when: string;
  usedIn: string[];
}

const kb = (n: number | null) => (n == null ? "" : n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default function MediaLibrary({ items, canWrite }: { items: MediaItem[]; canWrite: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [ok, setOk] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function handle(files: FileList | File[] | null) {
    if (!files || !files.length) return;
    setBusy(true);
    setErrors([]);
    setOk("");
    const { uploaded, errors } = await uploadFiles(Array.from(files));
    setErrors(errors);
    if (uploaded.length) setOk(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded.`);
    setBusy(false);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  }

  function remove(m: MediaItem) {
    if (!window.confirm(`Delete "${m.name}" permanently from ImageKit?`)) return;
    start(async () => {
      const res = await deleteMedia(m.id);
      if (!res.ok) setErrors([res.error]);
      else setOk("Image deleted.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {canWrite && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
          className={`adm-card flex flex-col items-center gap-2 border-2 border-dashed p-5 text-center transition sm:p-8 ${drag ? "border-gold bg-gold/10" : "border-[#DDD2BF]"}`}
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cream-alt text-gold">
            {busy ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
          </div>
          <p className="font-serif text-base font-bold text-deep-teal sm:text-lg">{busy ? "Uploading…" : "Drag & drop images here"}</p>
          <p className="text-xs text-text-muted">JPG, PNG, WebP, GIF or AVIF · up to 10 MB each · max 10 at a time</p>
          <button type="button" className="adm-btn-primary mt-1 !py-2 text-xs sm:text-sm" disabled={busy} onClick={() => input.current?.click()}>
            Choose files
          </button>
          <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => handle(e.target.files)} />
        </div>
      )}

      {ok && <p role="status" className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">{ok}</p>}
      {errors.length > 0 && (
        <div role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {items.length === 0 ? (
        <div className="adm-card"><EmptyState title="No uploads yet" text="Images you upload here are stored on ImageKit and can be used in any content form." /></div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="adm-card group flex flex-col overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-cream-alt overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${m.url}?tr=w-400,h-300,fo-auto`} alt={m.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3">
                <p className="truncate text-xs font-semibold text-deep-teal" title={m.name}>{m.name}</p>
                <p className="text-[10px] text-text-light sm:text-[11px]">
                  {[m.width && m.height ? `${m.width}×${m.height}` : "", kb(m.size)].filter(Boolean).join(" · ")}
                </p>
                <p className="text-[10px] text-text-light sm:text-[11px] truncate">{m.when}{m.by ? ` · ${m.by}` : ""}</p>
                {m.usedIn.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {m.usedIn.map((u) => <Pill key={u} tone="green">{u}</Pill>)}
                  </div>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-2">
                  <button type="button" onClick={() => copy(m.url, m.id)} className="adm-btn-ghost adm-btn-sm !py-1 !px-2 text-xs flex-1 truncate">
                    {copied === m.id ? (
                      <span className="inline-flex items-center gap-1 truncate"><Check size={12} className="text-emerald-600 shrink-0" /> Copied</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 truncate"><Copy size={12} className="shrink-0" /> Copy URL</span>
                    )}
                  </button>
                  {canWrite && (
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      disabled={pending}
                      className="adm-btn-danger adm-btn-sm !py-1 !px-2 shrink-0"
                      aria-label={`Delete ${m.name}`}
                      title={m.usedIn.length ? "In use - replace it first" : "Delete"}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
