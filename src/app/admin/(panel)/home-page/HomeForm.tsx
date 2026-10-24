"use client";

import { useState, useActionState } from "react";
import {
  Sparkles, Crown, Tent, Sun, Megaphone, Shield,
  Loader2, RotateCcw, Save, ChevronLeft, ChevronRight, Layers, LayoutGrid, CheckCircle2
} from "lucide-react";
import { resetHome, saveHome } from "@/app/admin/actions/home";
import { DEFAULT_HOME, HOME_SECTIONS, type HomeContent, type HomeFieldDef } from "@/lib/home-defaults";
import type { FormState } from "@/lib/action-types";
import ImageField from "@/components/admin/ImageField";

const TAB_META: Record<string, { icon: any; short: string }> = {
  hero: { icon: Sparkles, short: "Hero Banner" },
  story: { icon: Crown, short: "Story & Heritage" },
  experience: { icon: Tent, short: "Experiences" },
  thar: { icon: Sun, short: "Thar Desert" },
  cta: { icon: Megaphone, short: "Call to Action" },
  brand: { icon: Shield, short: "Logo & Brand" },
};

export default function HomeForm({ home }: { home: HomeContent }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveHome, undefined);
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [viewMode, setViewMode] = useState<"tab" | "all">("tab");

  const errs = state?.fieldErrors ?? {};
  const current = (key: keyof HomeContent) => state?.values?.[key] || home[key];

  const currentIdx = HOME_SECTIONS.findIndex((s) => s.id === activeTab);
  const activeSection = HOME_SECTIONS[currentIdx] ?? HOME_SECTIONS[0];
  const prevSection = currentIdx > 0 ? HOME_SECTIONS[currentIdx - 1] : null;
  const nextSection = currentIdx < HOME_SECTIONS.length - 1 ? HOME_SECTIONS[currentIdx + 1] : null;

  const renderField = (f: HomeFieldDef) => {
    if (f.type === "image") {
      return (
        <ImageField
          name={f.key}
          label={f.label}
          initial={current(f.key)}
          help={f.help}
          error={errs[f.key]}
          compact={true}
        />
      );
    }
    const common = {
      id: f.key,
      name: f.key,
      defaultValue: current(f.key),
      className: "adm-input !py-2 text-xs sm:text-sm",
      placeholder: DEFAULT_HOME[f.key],
      "aria-invalid": !!errs[f.key],
    } as const;

    return (
      <div className="space-y-1">
        <label htmlFor={f.key} className="adm-label !mb-1 text-xs font-semibold text-deep-teal">
          {f.label}
        </label>
        {f.type === "textarea" ? (
          <textarea
            rows={f.key.includes("Badge") ? 2 : f.key.includes("Caption") ? 2 : 3}
            {...common}
          />
        ) : (
          <input type="text" {...common} />
        )}
        {f.help && <p className="adm-help text-[11px]">{f.help}</p>}
        {errs[f.key] && <p role="alert" className="adm-error text-xs">{errs[f.key]}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-6xl space-y-4">
      {state?.error && (
        <div role="alert" className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div role="status" className="flex items-center gap-2 rounded-[5px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{state.success}</span>
        </div>
      )}

      {/* Modern Compact Section Switcher & Mode Toggle */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Horizontal Scrollable Tabs */}
        <nav aria-label="Home page sections" className="-mx-3.5 flex gap-1.5 overflow-x-auto px-3.5 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {HOME_SECTIONS.map((s) => {
            const meta = TAB_META[s.id];
            const Icon = meta?.icon ?? Sparkles;
            const isActive = viewMode === "tab" && activeTab === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveTab(s.id);
                  setViewMode("tab");
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-[5px] border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "border-deep-teal bg-deep-teal text-white shadow-sm"
                    : "border-[#DDD2BF] bg-white text-deep-teal hover:border-gold hover:bg-cream-alt"
                }`}
              >
                <Icon size={13} className={isActive ? "text-gold" : "text-text-muted"} />
                <span>{meta?.short ?? s.title}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-cream-alt text-text-muted"}`}>
                  {s.fields.length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* View Mode Toggle: Single Section vs All */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-0.5 sm:pt-0">
          <span className="text-[11px] text-text-light sm:hidden">
            Section {currentIdx + 1} of {HOME_SECTIONS.length}
          </span>
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === "tab" ? "all" : "tab"))}
            className="adm-btn-ghost adm-btn-sm inline-flex items-center gap-1.5 !py-1 text-xs"
            title="Toggle between single section and all sections view"
          >
            {viewMode === "tab" ? (
              <>
                <LayoutGrid size={13} />
                <span>Show all</span>
              </>
            ) : (
              <>
                <Layers size={13} />
                <span>Single tab</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form action={action} className="space-y-4">
        {/* Render sections: In 'tab' mode only active is visible, others are hidden in DOM so inputs submit */}
        {HOME_SECTIONS.map((section, idx) => {
          const isVisible = viewMode === "all" || activeTab === section.id;
          const meta = TAB_META[section.id];
          const Icon = meta?.icon ?? Sparkles;

          return (
            <div
              key={section.id}
              id={section.id}
              className={isVisible ? "block" : "hidden"}
            >
              <section className="adm-card p-4 sm:p-5 transition">
                {/* Section header */}
                <div className="mb-3.5 flex items-start justify-between border-b border-border-light/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gold/15 text-gold-dark font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h2 className="flex items-center gap-1.5 font-serif text-base font-bold text-deep-teal sm:text-lg">
                        <Icon size={16} className="text-gold shrink-0" />
                        <span>{section.title}</span>
                      </h2>
                      <p className="mt-0.5 text-xs text-text-muted">{section.description}</p>
                    </div>
                  </div>
                  <span className="rounded bg-cream-alt px-2 py-0.5 text-[10px] font-bold uppercase text-text-muted shrink-0 hidden sm:inline-block">
                    {section.fields.length} fields
                  </span>
                </div>

                {/* Compact Field Grid */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                  {section.fields.map((f) => (
                    <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                      {renderField(f)}
                    </div>
                  ))}
                </div>

                {/* In Tab Mode: Next & Prev section navigation buttons inside card */}
                {viewMode === "tab" && (
                  <div className="mt-4 flex items-center justify-between border-t border-border-light/60 pt-3 text-xs">
                    {prevSection ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab(prevSection.id)}
                        className="adm-btn-ghost adm-btn-sm inline-flex items-center gap-1 !py-1 text-xs"
                      >
                        <ChevronLeft size={13} />
                        <span>Prev: {TAB_META[prevSection.id]?.short ?? prevSection.title}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextSection ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab(nextSection.id)}
                        className="adm-btn-ghost adm-btn-sm inline-flex items-center gap-1 !py-1 text-xs ml-auto"
                      >
                        <span>Next: {TAB_META[nextSection.id]?.short ?? nextSection.title}</span>
                        <ChevronRight size={13} />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                )}
              </section>
            </div>
          );
        })}

        {/* Modern Sticky Bottom Action Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-[5px] border border-border-light bg-white/95 p-3 shadow-hover backdrop-blur-md">
          <div className="text-xs text-text-muted hidden sm:block">
            {viewMode === "tab" ? (
              <span>Section: <b className="text-deep-teal">{activeSection.title}</b> ({currentIdx + 1}/6)</span>
            ) : (
              <span>Editing all 6 sections</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              disabled={pending}
              className="adm-btn-primary flex-1 sm:flex-none justify-center px-6 shadow-hover"
            >
              {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{pending ? "Saving home page…" : "Save home page"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Reset Section - Compact at bottom */}
      <div className="rounded-lg border border-red-200/60 bg-red-50/40 p-3 sm:p-4 text-xs text-text-muted">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <p className="font-semibold text-red-900">Restore Default Template</p>
            <p className="text-[11px] text-text-light">Reset all images, text, and headings on the home page back to the original theme defaults.</p>
          </div>
          <form
            action={resetHome}
            onSubmit={(e) => {
              if (!window.confirm("Reset the whole home page (all images and text) to the original design?")) e.preventDefault();
            }}
            className="shrink-0"
          >
            <button type="submit" className="adm-btn-danger adm-btn-sm w-full sm:w-auto inline-flex items-center justify-center gap-1 !py-1 text-xs">
              <RotateCcw size={12} /> Reset to original
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
