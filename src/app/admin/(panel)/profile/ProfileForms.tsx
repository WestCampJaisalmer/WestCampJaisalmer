"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound, Loader2, Save } from "lucide-react";
import { changePassword, updateProfile } from "@/app/admin/actions/auth";
import type { FormState } from "@/lib/action-types";
import { Pill } from "@/components/admin/ui";

function Msg({ state }: { state: FormState }) {
  if (state?.error) return <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p>;
  if (state?.success) return <p role="status" className="rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">{state.success}</p>;
  return null;
}

export default function ProfileForms({ name, email, role }: { name: string; email: string; role: string }) {
  const [profile, profileAction, profilePending] = useActionState<FormState, FormData>(updateProfile, undefined);
  const [pw, pwAction, pwPending] = useActionState<FormState, FormData>(changePassword, undefined);
  const pwForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (pw?.success) pwForm.current?.reset();
  }, [pw]);

  return (
    <div className="grid max-w-4xl gap-6 md:grid-cols-2">
      <form action={profileAction} className="adm-card space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-deep-teal">Details</h2>
          <Pill tone="gold">{role}</Pill>
        </div>
        <Msg state={profile} />
        <div>
          <label htmlFor="p-name" className="adm-label">Name</label>
          <input id="p-name" name="name" required defaultValue={profile?.values?.name ?? name} className="adm-input" />
        </div>
        <div>
          <label htmlFor="p-email" className="adm-label">Email</label>
          <input id="p-email" name="email" type="email" required defaultValue={profile?.values?.email ?? email} className="adm-input" />
        </div>
        <button type="submit" disabled={profilePending} className="adm-btn-primary">
          {profilePending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save details
        </button>
      </form>

      <form ref={pwForm} action={pwAction} className="adm-card space-y-4 p-5 sm:p-6">
        <h2 className="font-serif text-lg font-bold text-deep-teal">Change password</h2>
        <Msg state={pw} />
        <div>
          <label htmlFor="pw-cur" className="adm-label">Current password</label>
          <input id="pw-cur" name="current" type="password" autoComplete="current-password" required className="adm-input" />
        </div>
        <div>
          <label htmlFor="pw-new" className="adm-label">New password</label>
          <input id="pw-new" name="next" type="password" autoComplete="new-password" required className="adm-input" />
          <p className="adm-help">At least 8 characters, with letters and numbers.</p>
        </div>
        <div>
          <label htmlFor="pw-conf" className="adm-label">Confirm new password</label>
          <input id="pw-conf" name="confirm" type="password" autoComplete="new-password" required className="adm-input" />
        </div>
        <button type="submit" disabled={pwPending} className="adm-btn-dark">
          {pwPending ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Update password
        </button>
      </form>
    </div>
  );
}
