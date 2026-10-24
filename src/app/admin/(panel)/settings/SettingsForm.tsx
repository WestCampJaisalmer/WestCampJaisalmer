"use client";

import { useActionState, useState } from "react";
import { 
  Building2, 
  Search, 
  Megaphone, 
  Share2, 
  Coins, 
  Inbox, 
  Save, 
  Loader2, 
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { saveSettings } from "@/app/admin/actions/settings";
import type { FormState } from "@/lib/action-types";
import type { SiteSettings } from "@/lib/settings-defaults";

const TABS = [
  { id: "all", label: "All Settings", icon: Layers },
  { id: "business", label: "Business & Contact", icon: Building2 },
  { id: "seo", label: "SEO & Google", icon: Search },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "currency", label: "Currencies", icon: Coins },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
] as const;

type TabId = typeof TABS[number]["id"];

function Section({ 
  id, 
  icon: Icon, 
  title, 
  description, 
  children,
  activeTab
}: { 
  id: TabId; 
  icon?: any; 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  activeTab: TabId;
}) {
  const isVisible = activeTab === "all" || activeTab === id;
  return (
    <section className={`adm-card p-4 sm:p-6 transition-all ${isVisible ? "block" : "hidden"}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-dark">
            <Icon size={18} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg font-bold text-deep-teal">{title}</h2>
          {description && <p className="mt-0.5 text-xs sm:text-sm text-text-muted">{description}</p>}
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, undefined);
  const errs = state?.fieldErrors ?? {};
  const v = (k: keyof SiteSettings) => String(state?.values?.[k] ?? settings[k] ?? "");

  const Field = ({ 
    k, 
    label, 
    help, 
    type = "text", 
    full, 
    placeholder 
  }: { 
    k: keyof SiteSettings; 
    label: string; 
    help?: string; 
    type?: string; 
    full?: boolean; 
    placeholder?: string 
  }) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={k} className="adm-label">{label}</label>
      <input 
        id={k} 
        name={k} 
        type={type} 
        step={type === "number" ? "any" : undefined} 
        defaultValue={v(k)} 
        className="adm-input" 
        placeholder={placeholder} 
        aria-invalid={!!errs[k]} 
      />
      {help && <p className="adm-help">{help}</p>}
      {errs[k] && <p role="alert" className="adm-error">{errs[k]}</p>}
    </div>
  );

  return (
    <form action={action} className="max-w-4xl space-y-5">
      {/* Messages */}
      {state?.error && (
        <div role="alert" className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div role="status" className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{state.success}</span>
        </div>
      )}

      {/* Responsive Section Filter Tabs */}
      <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 py-1 sm:mx-0 sm:px-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                active 
                  ? "border-deep-teal bg-deep-teal text-white shadow-sm" 
                  : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              <Icon size={14} className={active ? "text-gold" : "text-stone-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sections - Note: all rendered so form always includes every field */}
      <div className="space-y-5">
        <Section 
          id="business" 
          activeTab={activeTab} 
          icon={Building2} 
          title="Business & contact" 
          description="Used for the WhatsApp buttons, footer and enquiry links."
        >
          <Field k="siteName" label="Business name" />
          <Field k="tagline" label="Tagline" />
          <Field k="whatsappNumber" label="WhatsApp number" help="Digits with country code, e.g. 917877221729. All booking buttons open this chat." />
          <Field k="phone" label="Phone (display)" placeholder="+91 78772 21729" />
          <Field k="email" label="Contact email" type="email" />
          <Field k="address" label="Address" />
          <Field k="mapEmbedUrl" label="Google Maps link" full help="Optional. Must start with https://" />
        </Section>

        <Section 
          id="seo" 
          activeTab={activeTab} 
          icon={Search} 
          title="Search engines (SEO)" 
          description="How the website appears on Google and when shared."
        >
          <Field k="seoTitle" label="Page title" full />
          <div className="sm:col-span-2">
            <label htmlFor="seoDescription" className="adm-label">Description</label>
            <textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={v("seoDescription")} className="adm-input" />
            <p className="adm-help">Around 150 characters works best.</p>
          </div>
          <Field k="seoKeywords" label="Keywords" full help="Comma separated." />
        </Section>

        <Section 
          id="announcement" 
          activeTab={activeTab} 
          icon={Megaphone} 
          title="Announcement banner" 
          description="A slim banner across the top of every page, e.g. for offers or closures."
        >
          <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
            <input type="checkbox" name="announcementEnabled" defaultChecked={state?.values ? state.values.announcementEnabled === "on" : settings.announcementEnabled} className="h-4 w-4 cursor-pointer accent-gold" />
            <span className="text-sm font-semibold text-text-main">Show the banner</span>
          </label>
          <Field k="announcementText" label="Banner text" placeholder="Winter special: 15% off all desert camps till 31 Jan" />
          <Field k="announcementLink" label="Link (optional)" placeholder="/packages or https://…" />
        </Section>

        <Section 
          id="social" 
          activeTab={activeTab} 
          icon={Share2} 
          title="Social links" 
          description="Leave blank to hide an icon."
        >
          <Field k="facebook" label="Facebook" placeholder="https://facebook.com/…" />
          <Field k="instagram" label="Instagram" placeholder="https://instagram.com/…" />
          <Field k="youtube" label="YouTube" placeholder="https://youtube.com/…" />
          <Field k="twitter" label="X / Twitter" placeholder="https://x.com/…" />
        </Section>

        <Section 
          id="currency" 
          activeTab={activeTab} 
          icon={Coins} 
          title="Currency conversion" 
          description="How many rupees (₹) equal one unit of each currency. Prices are stored in ₹ and converted for visitors."
        >
          <Field k="rateUSD" label="1 USD = ₹" type="number" />
          <Field k="rateEUR" label="1 EUR = ₹" type="number" />
          <Field k="rateGBP" label="1 GBP = ₹" type="number" />
          <Field k="rateAED" label="1 AED = ₹" type="number" />
        </Section>

        <Section 
          id="enquiries" 
          activeTab={activeTab} 
          icon={Inbox} 
          title="Enquiries"
        >
          <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
            <input type="checkbox" name="enquiriesEnabled" defaultChecked={state?.values ? state.values.enquiriesEnabled === "on" : settings.enquiriesEnabled} className="mt-0.5 h-4 w-4 cursor-pointer accent-gold" />
            <span>
              <span className="block text-sm font-semibold text-text-main">Save website enquiries to this dashboard</span>
              <span className="block text-xs text-text-muted">Turn off to stop recording new form submissions (guests are still sent to WhatsApp).</span>
            </span>
          </label>
        </Section>
      </div>

      {/* Floating / Sticky Bottom Save Bar */}
      <div className="sticky bottom-3 z-20 rounded-xl border border-border-light bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-center text-xs text-text-muted sm:text-left">
            Changes will take effect immediately across all website pages.
          </p>
          <button 
            type="submit" 
            disabled={pending} 
            className="adm-btn-primary w-full px-6 py-2.5 shadow-hover sm:w-auto"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save settings
          </button>
        </div>
      </div>
    </form>
  );
}
