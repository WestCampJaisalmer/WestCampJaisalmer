"use client";

import { useActionState, useEffect, useRef } from "react";
import { 
  KeyRound, 
  Loader2, 
  Save, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Shield 
} from "lucide-react";
import { changePassword, updateProfile } from "@/app/admin/actions/auth";
import type { FormState } from "@/lib/action-types";
import { Pill } from "@/components/admin/ui";

function Msg({ state }: { state: FormState }) {
  if (state?.error) {
    return (
      <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-700">
        <AlertCircle size={16} className="shrink-0 text-red-600" />
        <span>{state.error}</span>
      </div>
    );
  }
  if (state?.success) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs sm:text-sm font-medium text-emerald-800">
        <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
        <span>{state.success}</span>
      </div>
    );
  }
  return null;
}

export default function ProfileForms({ name, email, role }: { name: string; email: string; role: string }) {
  const [profile, profileAction, profilePending] = useActionState<FormState, FormData>(updateProfile, undefined);
  const [pw, pwAction, pwPending] = useActionState<FormState, FormData>(changePassword, undefined);
  const pwForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (pw?.success) pwForm.current?.reset();
  }, [pw]);

  const displayName = profile?.values?.name ?? name;
  const displayEmail = profile?.values?.email ?? email;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Overview Card */}
      <div className="adm-card p-4 sm:p-6 bg-gradient-to-r from-cream/40 via-white to-cream/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-xl font-bold text-gold-dark ring-4 ring-gold/15">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-deep-teal leading-tight">{displayName}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted truncate">
                <Mail size={13} className="shrink-0 text-stone-400" />
                <span className="truncate">{displayEmail}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start border-t border-border-light pt-3 sm:border-0 sm:pt-0">
            <span className="text-xs text-text-muted sm:hidden">Access level:</span>
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-gold" />
              <Pill tone="gold">{role}</Pill>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Form */}
        <form action={profileAction} className="adm-card space-y-4 p-4 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-light pb-3">
              <h3 className="font-serif text-lg font-bold text-deep-teal flex items-center gap-2">
                <User size={18} className="text-gold" /> Personal Details
              </h3>
            </div>

            <Msg state={profile} />

            <div>
              <label htmlFor="p-name" className="adm-label">Full Name</label>
              <input 
                id="p-name" 
                name="name" 
                required 
                defaultValue={displayName} 
                className="adm-input" 
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="p-email" className="adm-label">Email Address</label>
              <input 
                id="p-email" 
                name="email" 
                type="email" 
                required 
                defaultValue={displayEmail} 
                className="adm-input" 
                placeholder="your.email@westcamp.in"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={profilePending} 
              className="adm-btn-primary w-full sm:w-auto px-5 py-2.5 justify-center shadow-hover"
            >
              {profilePending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save details
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form ref={pwForm} action={pwAction} className="adm-card space-y-4 p-4 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-light pb-3">
              <h3 className="font-serif text-lg font-bold text-deep-teal flex items-center gap-2">
                <ShieldCheck size={18} className="text-gold" /> Change Password
              </h3>
            </div>

            <Msg state={pw} />

            <div>
              <label htmlFor="pw-cur" className="adm-label">Current Password</label>
              <input 
                id="pw-cur" 
                name="current" 
                type="password" 
                autoComplete="current-password" 
                required 
                className="adm-input text-sm" 
              />
            </div>

            <div>
              <label htmlFor="pw-new" className="adm-label">New Password</label>
              <input 
                id="pw-new" 
                name="next" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="adm-input text-sm" 
              />
              <p className="adm-help">At least 8 characters, with letters and numbers.</p>
            </div>

            <div>
              <label htmlFor="pw-conf" className="adm-label">Confirm New Password</label>
              <input 
                id="pw-conf" 
                name="confirm" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="adm-input text-sm" 
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={pwPending} 
              className="adm-btn-dark w-full sm:w-auto px-5 py-2.5 justify-center shadow-hover"
            >
              {pwPending ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
