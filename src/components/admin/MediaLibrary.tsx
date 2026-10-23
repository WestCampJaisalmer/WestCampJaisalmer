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
          className={`adm-card flex flex-col items-center gap-2 border-2 border-dashed px-6 py-9 text-center transition ${drag ? "border-gold bg-gold/10" : "border-[#DDD2BF]"}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-alt text-gold">
            {busy ? <Loader2 className="animate-spin" size={22} /> : <UploadCloud size={22} />}
          </div>
          <p className="font-serif text-lg font-bold text-deep-teal">{busy ? "Uploading…" : "Drag & drop images here"}</p>
          <p className="text-xs text-text-muted">JPG, PNG, WebP, GIF or AVIF · up to 10 MB each · max 10 at a time</p>
          <button type="button" className="adm-btn-primary mt-1" disabled={busy} onClick={() => input.current?.click()}>
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
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="adm-card group flex flex-col overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${m.url}?tr=w-400,h-300,fo-auto`} alt={m.name} loading="lazy" className="aspect-[4/3] w-full bg-cream-alt object-cover" />
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <p className="truncate text-xs font-semibold text-deep-teal" title={m.name}>{m.name}</p>
                <p className="text-[11px] text-text-light">
                  {[m.width && m.height ? `${m.width}×${m.height}` : "", kb(m.size)].filter(Boolean).join(" · ")}
                </p>
                <p className="text-[11px] text-text-light">{m.when}{m.by ? ` · ${m.by}` : ""}</p>
                {m.usedIn.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.usedIn.map((u) => <Pill key={u} tone="green">{u}</Pill>)}
                  </div>
                )}
                <div className="mt-auto flex gap-1.5 pt-2">
                  <button type="button" onClick={() => copy(m.url, m.id)} className="adm-btn-ghost adm-btn-sm flex-1">
                    {copied === m.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy URL</>}
                  </button>
                  {canWrite && (
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      disabled={pending}
                      className="adm-btn-danger adm-btn-sm"
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
