"use client";

import { useRef, useState } from "react";
import { FolderOpen, ImageOff, Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadFiles } from "@/components/admin/upload";
import MediaPicker from "@/components/admin/MediaPicker";

interface Props {
  name: string;
  label: string;
  initial?: string;
  required?: boolean;
  help?: string;
  error?: string;
  compact?: boolean;
}

export default function ImageField({ name, label, initial = "", required, help, error, compact = false }: Props) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [pick, setPick] = useState(false);
  const [drag, setDrag] = useState(false);
  const [broken, setBroken] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function handle(files: FileList | File[] | null) {
    const list = files ? Array.from(files).slice(0, 1) : [];
    if (!list.length) return;
    setBusy(true);
    setProblem("");
    const { uploaded, errors } = await uploadFiles(list);
    if (uploaded[0]) {
      setValue(uploaded[0].url);
      setBroken(false);
    }
    if (errors.length) setProblem(errors[0]);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  if (compact) {
    return (
      <div>
        <label className="adm-label text-xs">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <input type="hidden" name={name} value={value} />

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
          className={`flex items-center gap-3 rounded-md border p-2 transition ${
            drag ? "border-gold bg-gold/10" : "border-[#DDD2BF] bg-cream/40"
          }`}
        >
          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded bg-cream-alt border border-border-light/60">
            {value && !broken ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Preview" className="h-full w-full object-cover" onError={() => setBroken(true)} />
            ) : (
              <div className="flex flex-col items-center gap-0.5 text-text-light">
                <ImageOff size={16} />
                <span className="text-[9px]">No image</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                className="adm-btn-dark adm-btn-sm !py-1 !px-2.5 text-xs inline-flex items-center gap-1"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                {busy ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                {/* keyed so the label is re-created (and re-translated) instead of edited in place */}
                <span key={busy ? "busy" : "idle"}>{busy ? "…" : "Upload"}</span>
              </button>
              <button
                type="button"
                className="adm-btn-ghost adm-btn-sm !py-1 !px-2.5 text-xs inline-flex items-center gap-1"
                disabled={busy}
                onClick={() => setPick(true)}
              >
                <FolderOpen size={12} />
                <span>Media</span>
              </button>
              {value && (
                <button
                  type="button"
                  className="adm-btn-danger adm-btn-sm !py-1 !px-2 text-xs"
                  onClick={() => { setValue(""); setBroken(false); }}
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <input
              type="text"
              inputMode="url"
              value={value}
              onChange={(e) => { setValue(e.target.value); setBroken(false); }}
              placeholder="Paste image path or URL…"
              className="adm-input !py-1 !px-2 text-xs font-mono"
              aria-label={`${label} URL`}
            />
          </div>
        </div>

        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => handle(e.target.files)} />
        {help && <p className="adm-help text-[11px] mt-1">{help}</p>}
        {(problem || error) && <p role="alert" className="adm-error">{problem || error}</p>}
        {pick && <MediaPicker onClose={() => setPick(false)} onPick={(url) => { setValue(url); setBroken(false); setPick(false); }} />}
      </div>
    );
  }

  return (
    <div>
      <label className="adm-label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input type="hidden" name={name} value={value} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        className={`flex flex-col gap-4 rounded-sm border-2 border-dashed p-3 transition sm:flex-row sm:items-center ${
          drag ? "border-gold bg-gold/10" : "border-[#DDD2BF] bg-cream/50"
        }`}
      >
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-sm bg-cream-alt sm:w-44">
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <div className="flex flex-col items-center gap-1 text-text-light">
              <ImageOff size={24} />
              <span className="text-[11px]">{value ? "Can't load image" : "No image"}</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="adm-btn-dark adm-btn-sm flex-1 sm:flex-none justify-center" disabled={busy} onClick={() => input.current?.click()}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              <span key={busy ? "busy" : "idle"}>{busy ? "Uploading…" : "Upload"}</span>
            </button>
            <button type="button" className="adm-btn-ghost adm-btn-sm flex-1 sm:flex-none justify-center" disabled={busy} onClick={() => setPick(true)}>
              <FolderOpen size={14} /> Media library
            </button>
            {value && (
              <button type="button" className="adm-btn-danger adm-btn-sm flex-1 sm:flex-none justify-center" onClick={() => { setValue(""); setBroken(false); }}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          <input
            type="text"
            inputMode="url"
            value={value}
            onChange={(e) => { setValue(e.target.value); setBroken(false); }}
            placeholder="…or paste an image URL / site path (e.g. /images/camps/royal-camp.jpg)"
            className="adm-input !py-2 text-xs"
            aria-label={`${label} URL`}
          />
          <p className="text-[11px] text-text-light">Drag &amp; drop an image here · JPG, PNG, WebP up to 10 MB</p>
        </div>
      </div>

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => handle(e.target.files)} />
      {help && <p className="adm-help">{help}</p>}
      {(problem || error) && <p role="alert" className="adm-error">{problem || error}</p>}

      {pick && <MediaPicker onClose={() => setPick(false)} onPick={(url) => { setValue(url); setBroken(false); setPick(false); }} />}
    </div>
  );
}
