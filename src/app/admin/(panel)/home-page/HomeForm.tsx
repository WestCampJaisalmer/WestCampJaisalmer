"use client";

import { useActionState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { resetHome, saveHome } from "@/app/admin/actions/home";
import { DEFAULT_HOME, HOME_SECTIONS, type HomeContent, type HomeFieldDef } from "@/lib/home-defaults";
import type { FormState } from "@/lib/action-types";
import ImageField from "@/components/admin/ImageField";

export default function HomeForm({ home }: { home: HomeContent }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveHome, undefined);
  const errs = state?.fieldErrors ?? {};
  const current = (key: keyof HomeContent) => state?.values?.[key] || home[key];

  const renderField = (f: HomeFieldDef) => {
    if (f.type === "image") {
      return (
        <ImageField
          name={f.key}
          label={f.label}
          initial={current(f.key)}
          help={f.help ? `${f.help} Click Remove to go back to the original.` : "Click Remove to go back to the original image."}
          error={errs[f.key]}
        />
      );
    }
    const common = { id: f.key, name: f.key, defaultValue: current(f.key), className: "adm-input", placeholder: DEFAULT_HOME[f.key], "aria-invalid": !!errs[f.key] } as const;
    return (
      <>
        <label htmlFor={f.key} className="adm-label">{f.label}</label>
        {f.type === "textarea" ? <textarea rows={f.key.includes("Heading") || f.key.includes("Badge") || f.key.includes("Caption") ? 3 : 4} {...common} /> : <input type="text" {...common} />}
        {f.help && <p className="adm-help">{f.help}</p>}
        {errs[f.key] && <p role="alert" className="adm-error">{errs[f.key]}</p>}
      </>
    );
  };

  return (
    <div className="max-w-4xl">
      <form action={action} className="space-y-6">
        {state?.error && <div role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</div>}
        {state?.success && <div role="status" className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{state.success}</div>}

        <nav aria-label="Sections" className="flex flex-wrap gap-2">
          {HOME_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-[#DDD2BF] bg-white px-3.5 py-1.5 text-xs font-bold text-deep-teal transition hover:bg-cream-alt">
              {s.title}
            </a>
          ))}
        </nav>

        {HOME_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="adm-card scroll-mt-6 p-5 sm:p-6">
            <h2 className="font-serif text-lg font-bold text-deep-teal">{section.title}</h2>
            <p className="mb-5 mt-0.5 text-sm text-text-muted">{section.description}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>{renderField(f)}</div>
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button type="submit" disabled={pending} className="adm-btn-primary px-6 shadow-hover">
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save home page
          </button>
        </div>
      </form>

      <form
        action={resetHome}
        onSubmit={(e) => {
          if (!window.confirm("Reset the whole home page (all images and text) to the original design?")) e.preventDefault();
        }}
        className="mt-8 border-t border-border-light pt-5"
      >
        <button type="submit" className="adm-btn-danger adm-btn-sm"><RotateCcw size={13} /> Reset everything to the original design</button>
      </form>
    </div>
  );
}
