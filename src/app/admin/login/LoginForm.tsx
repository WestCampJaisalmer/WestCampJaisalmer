"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { login } from "@/app/admin/actions/auth";
import type { FormState } from "@/lib/action-types";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      {state?.error && (
        <div role="alert" className="rounded-sm border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="adm-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email ?? ""} className="adm-input" placeholder="you@example.com" autoFocus />
      </div>

      <div>
        <label htmlFor="password" className="adm-label">Password</label>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className="adm-input pr-11" placeholder="••••••••" />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-text-muted hover:text-deep-teal"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={pending} className="adm-btn-primary w-full py-3">
        {pending ? <Loader2 size={17} className="animate-spin" /> : <LogIn size={17} />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
