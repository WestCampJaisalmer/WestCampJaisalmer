"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { createManualEnquiry } from "@/app/admin/actions/enquiries";
import { ENQUIRY_TYPES } from "@/lib/enquiry-constants";
import type { FormState } from "@/lib/action-types";

export default function ManualEnquiryForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createManualEnquiry, undefined);
  const v = state?.values ?? {};

  return (
    <form action={action} className="adm-card max-w-3xl space-y-5 p-5 sm:p-6">
      {state?.error && <div role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="adm-label">Guest name *</label>
          <input id="name" name="name" required defaultValue={v.name ?? ""} className="adm-input" />
        </div>
        <div>
          <label htmlFor="type" className="adm-label">Type *</label>
          <select id="type" name="type" defaultValue={v.type ?? "booking"} className="adm-input">
            {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="adm-label">Phone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" defaultValue={v.phone ?? ""} className="adm-input" placeholder="+91 …" />
        </div>
        <div>
          <label htmlFor="email" className="adm-label">Email</label>
          <input id="email" name="email" type="email" defaultValue={v.email ?? ""} className="adm-input" />
        </div>
      </div>
      <div>
        <label htmlFor="itemName" className="adm-label">Interested in</label>
        <input id="itemName" name="itemName" defaultValue={v.itemName ?? ""} className="adm-input" placeholder="e.g. Luxury Swiss Camp, 2 nights" />
      </div>
      <div>
        <label htmlFor="message" className="adm-label">Notes</label>
        <textarea id="message" name="message" rows={4} defaultValue={v.message ?? ""} className="adm-input" placeholder="Dates, number of guests, special requests…" />
      </div>
      <button type="submit" disabled={pending} className="adm-btn-primary">
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save enquiry
      </button>
    </form>
  );
}
