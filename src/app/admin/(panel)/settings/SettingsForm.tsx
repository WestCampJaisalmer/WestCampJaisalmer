"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettings } from "@/app/admin/actions/settings";
import type { FormState } from "@/lib/action-types";
import type { SiteSettings } from "@/lib/settings-defaults";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="adm-card p-5 sm:p-6">
      <h2 className="font-serif text-lg font-bold text-deep-teal">{title}</h2>
      {description && <p className="mb-5 mt-0.5 text-sm text-text-muted">{description}</p>}
      <div className={`grid gap-5 sm:grid-cols-2 ${description ? "" : "mt-5"}`}>{children}</div>
    </section>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, undefined);
  const errs = state?.fieldErrors ?? {};
  const v = (k: keyof SiteSettings) => String(state?.values?.[k] ?? settings[k] ?? "");

  const Field = ({ k, label, help, type = "text", full, placeholder }: { k: keyof SiteSettings; label: string; help?: string; type?: string; full?: boolean; placeholder?: string }) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={k} className="adm-label">{label}</label>
      <input id={k} name={k} type={type} step={type === "number" ? "any" : undefined} defaultValue={v(k)} className="adm-input" placeholder={placeholder} aria-invalid={!!errs[k]} />
      {help && <p className="adm-help">{help}</p>}
      {errs[k] && <p role="alert" className="adm-error">{errs[k]}</p>}
    </div>
  );

  return (
    <form action={action} className="max-w-4xl space-y-6">
      {state?.error && <div role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</div>}
      {state?.success && <div role="status" className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{state.success}</div>}

      <Section title="Business & contact" description="Used for the WhatsApp buttons, footer and enquiry links.">
        <Field k="siteName" label="Business name" />
        <Field k="tagline" label="Tagline" />
        <Field k="whatsappNumber" label="WhatsApp number" help="Digits with country code, e.g. 917877221729. All booking buttons open this chat." />
        <Field k="phone" label="Phone (display)" placeholder="+91 78772 21729" />
        <Field k="email" label="Contact email" type="email" />
        <Field k="address" label="Address" />
        <Field k="mapEmbedUrl" label="Google Maps link" full help="Optional. Must start with https://" />
      </Section>

      <Section title="Search engines (SEO)" description="How the website appears on Google and when shared.">
        <Field k="seoTitle" label="Page title" full />
        <div className="sm:col-span-2">
          <label htmlFor="seoDescription" className="adm-label">Description</label>
          <textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={v("seoDescription")} className="adm-input" />
          <p className="adm-help">Around 150 characters works best.</p>
        </div>
        <Field k="seoKeywords" label="Keywords" full help="Comma separated." />
      </Section>

      <Section title="Announcement banner" description="A slim banner across the top of every page, e.g. for offers or closures.">
        <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
          <input type="checkbox" name="announcementEnabled" defaultChecked={state?.values ? state.values.announcementEnabled === "on" : settings.announcementEnabled} className="h-4 w-4 cursor-pointer accent-gold" />
          <span className="text-sm font-semibold text-text-main">Show the banner</span>
        </label>
        <Field k="announcementText" label="Banner text" placeholder="Winter special: 15% off all desert camps till 31 Jan" />
        <Field k="announcementLink" label="Link (optional)" placeholder="/packages or https://…" />
      </Section>

      <Section title="Social links" description="Leave blank to hide an icon.">
        <Field k="facebook" label="Facebook" placeholder="https://facebook.com/…" />
        <Field k="instagram" label="Instagram" placeholder="https://instagram.com/…" />
        <Field k="youtube" label="YouTube" placeholder="https://youtube.com/…" />
        <Field k="twitter" label="X / Twitter" placeholder="https://x.com/…" />
      </Section>

      <Section title="Currency conversion" description="How many rupees (₹) equal one unit of each currency. Prices are stored in ₹ and converted for visitors.">
        <Field k="rateUSD" label="1 USD = ₹" type="number" />
        <Field k="rateEUR" label="1 EUR = ₹" type="number" />
        <Field k="rateGBP" label="1 GBP = ₹" type="number" />
        <Field k="rateAED" label="1 AED = ₹" type="number" />
      </Section>

      <Section title="Enquiries">
        <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
          <input type="checkbox" name="enquiriesEnabled" defaultChecked={state?.values ? state.values.enquiriesEnabled === "on" : settings.enquiriesEnabled} className="mt-0.5 h-4 w-4 cursor-pointer accent-gold" />
          <span>
            <span className="block text-sm font-semibold text-text-main">Save website enquiries to this dashboard</span>
            <span className="block text-xs text-text-muted">Turn off to stop recording new form submissions (guests are still sent to WhatsApp).</span>
          </span>
        </label>
      </Section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button type="submit" disabled={pending} className="adm-btn-primary px-6 shadow-hover">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save settings
        </button>
      </div>
    </form>
  );
}
