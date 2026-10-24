"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveResource } from "@/app/admin/actions/content";
import type { FieldDef, ItineraryDay, ResourceDef } from "@/lib/resources";
import type { FormState } from "@/lib/action-types";
import ImageField from "@/components/admin/ImageField";
import TagsField from "@/components/admin/TagsField";
import ItineraryField from "@/components/admin/ItineraryField";

interface Props {
  def: ResourceDef;
  id: string | null;
  item: Record<string, any> | null;
}

function parseJson<T>(s: string | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export default function ResourceForm({ def, id, item }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveResource.bind(null, def.key, id), undefined);
  const errs = state?.fieldErrors ?? {};
  const vals = state?.values;

  const text = (f: FieldDef): string => {
    const v = vals ? vals[f.name] : item?.[f.name];
    return v === undefined || v === null ? String(f.default ?? "") : String(v);
  };

  const renderField = (f: FieldDef) => {
    const label = (
      <label htmlFor={f.name} className="adm-label">
        {f.label}
        {f.required && <span className="text-red-500"> *</span>}
      </label>
    );
    const tail = (
      <>
        {f.help && <p className="adm-help">{f.help}</p>}
        {errs[f.name] && <p role="alert" className="adm-error">{errs[f.name]}</p>}
      </>
    );

    switch (f.type) {
      case "image":
        return <ImageField name={f.name} label={f.label} initial={vals ? vals[f.name] : item?.[f.name] ?? ""} required={f.required} help={f.help} error={errs[f.name]} />;
      case "tags":
        return <TagsField name={f.name} label={f.label} help={f.help} initial={vals ? parseJson<string[]>(vals[f.name], []) : item?.[f.name] ?? []} />;
      case "itinerary":
        return <ItineraryField name={f.name} label={f.label} initial={vals ? parseJson<ItineraryDay[]>(vals[f.name], []) : item?.[f.name] ?? []} />;
      case "textarea":
        return (
          <>
            {label}
            <textarea id={f.name} name={f.name} rows={5} defaultValue={text(f)} className="adm-input" placeholder={f.placeholder} aria-invalid={!!errs[f.name]} />
            {tail}
          </>
        );
      case "select":
        return (
          <>
            {label}
            <select id={f.name} name={f.name} defaultValue={text(f)} className="adm-input" aria-invalid={!!errs[f.name]}>
              {!f.required && <option value="">—</option>}
              {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {tail}
          </>
        );
      case "number":
        return (
          <>
            {label}
            <input id={f.name} name={f.name} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step ?? (f.integer ? 1 : "any")} defaultValue={text(f)} className="adm-input" placeholder={f.placeholder} aria-invalid={!!errs[f.name]} />
            {tail}
          </>
        );
      default:
        return (
          <>
            {label}
            <input id={f.name} name={f.name} type="text" defaultValue={text(f)} className="adm-input" placeholder={f.placeholder} aria-invalid={!!errs[f.name]} />
            {tail}
          </>
        );
    }
  };

  const active = vals ? vals.active === "on" : item?.active ?? true;
  const featured = vals ? vals.featured === "on" : item?.featured ?? false;

  return (
    <form action={action} className="grid gap-5 sm:gap-6 lg:grid-cols-3">
      <div className="adm-card p-4 sm:p-6 lg:col-span-2">
        {state?.error && (
          <div role="alert" className="mb-4 sm:mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
          {def.fields.map((f) => (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              {renderField(f)}
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit space-y-4 sm:space-y-5 lg:sticky lg:top-6">
        <div className="adm-card p-4 sm:p-5">
          <h2 className="mb-3 sm:mb-4 font-serif text-base sm:text-lg font-bold text-deep-teal">Publishing</h2>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="active" defaultChecked={active} className="mt-0.5 h-4 w-4 cursor-pointer accent-gold" />
            <span>
              <span className="block text-sm font-semibold text-text-main">Visible on website</span>
              <span className="block text-xs text-text-muted">Untick to hide it without deleting.</span>
            </span>
          </label>
          {def.hasFeatured && (
            <label className="mt-3.5 sm:mt-4 flex cursor-pointer items-start gap-3">
              <input type="checkbox" name="featured" defaultChecked={featured} className="mt-0.5 h-4 w-4 cursor-pointer accent-gold" />
              <span>
                <span className="block text-sm font-semibold text-text-main">Featured</span>
                <span className="block text-xs text-text-muted">Marks it as a highlight.</span>
              </span>
            </label>
          )}
          <div className="mt-5 flex justify-between gap-2">
            <button type="submit" disabled={pending} className="adm-btn-primary flex-1">
              {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {pending ? "Saving…" : id ? "Save changes" : def.key === "gallery-categories" ? "Add" : `Add ${def.singular.toLowerCase()}`}
            </button>
            <Link href={`/admin/content/${def.key}`} className="adm-btn-ghost flex-1">Cancel</Link>
          </div>
          <p className="mt-3 text-center text-[11px] text-text-light">Changes appear on the live site within moments.</p>
        </div>

        {/* Mobile quick save bar */}
        <div className="sticky bottom-4 z-20 flex items-center gap-2 rounded-lg border border-border-light bg-white/95 p-2.5 shadow-hover backdrop-blur-sm lg:hidden">
          <button type="submit" disabled={pending} className="adm-btn-primary flex-1 justify-center !py-2 text-xs font-semibold">
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {pending ? "Saving…" : id ? "Save changes" : def.key === "gallery-categories" ? "Add" : `Add ${def.singular.toLowerCase()}`}
          </button>
          <Link href={`/admin/content/${def.key}`} className="adm-btn-ghost !py-2 text-xs">Cancel</Link>
        </div>
      </aside>
    </form>
  );
}
