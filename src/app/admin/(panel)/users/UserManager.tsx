"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { createUser, deleteUser, resetUserPassword, updateUser } from "@/app/admin/actions/users";
import type { FormState } from "@/lib/action-types";
import { Pill } from "@/components/admin/ui";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
  lastLogin: string;
}

const ROLE_HELP: Record<string, string> = {
  admin: "Full access: users, settings, content, enquiries.",
  editor: "Edit content and handle enquiries. No users or settings.",
  viewer: "Read-only access to everything except users & settings.",
};

function ResetPassword({ id, onDone }: { id: string; onDone: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetUserPassword.bind(null, id), undefined);
  return (
    <form action={action} className="mt-2 flex flex-wrap items-start gap-2 rounded-sm bg-cream p-3">
      <div className="min-w-[200px] flex-1">
        <input name="password" type="text" autoComplete="new-password" placeholder="New password (8+ chars, letters & numbers)" className="adm-input !py-2 text-xs" aria-label="New password" />
        {state?.error && <p role="alert" className="adm-error">{state.error}</p>}
        {state?.success && <p role="status" className="mt-1 text-xs font-medium text-emerald-700">{state.success}</p>}
      </div>
      <button type="submit" disabled={pending} className="adm-btn-dark adm-btn-sm">{pending ? <Loader2 size={13} className="animate-spin" /> : "Set password"}</button>
      <button type="button" onClick={onDone} className="adm-btn-ghost adm-btn-sm">Close</button>
    </form>
  );
}

export default function UserManager({ users, meId }: { users: UserRow[]; meId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(createUser, undefined);
  const [busy, start] = useTransition();
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const v = state?.values ?? {};

  const change = (id: string, patch: { role?: string; active?: boolean }) =>
    start(async () => {
      setError("");
      const res = await updateUser(id, patch);
      if (!res.ok) setError(res.error);
      router.refresh();
    });

  const remove = (u: UserRow) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? They will lose access immediately.`)) return;
    start(async () => {
      setError("");
      const res = await deleteUser(u.id);
      if (!res.ok) setError(res.error);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="adm-card overflow-hidden xl:col-span-2">
        {error && <p role="alert" className="border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>}
        <ul className="divide-y divide-border-light">
          {users.map((u) => (
            <li key={u.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${u.active ? "bg-gold/15 text-gold-dark" : "bg-stone-200 text-stone-500"}`}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-deep-teal">
                    {u.name}
                    {u.id === meId && <Pill tone="gold">You</Pill>}
                    {!u.active && <Pill tone="muted">Disabled</Pill>}
                  </p>
                  <p className="truncate text-xs text-text-muted">{u.email} · last sign-in {u.lastLogin}</p>
                </div>
                <select
                  value={u.role}
                  disabled={busy || u.id === meId}
                  onChange={(e) => change(u.id, { role: e.target.value })}
                  className="adm-input !w-auto !py-1.5 text-xs"
                  aria-label={`Role for ${u.name}`}
                  title={u.id === meId ? "You can't change your own role" : ROLE_HELP[u.role]}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-0 sm:pl-[52px]">
                <button type="button" className="adm-btn-ghost adm-btn-sm" onClick={() => setResetFor(resetFor === u.id ? null : u.id)}>
                  <KeyRound size={13} /> Reset password
                </button>
                {u.id !== meId && (
                  <>
                    <button type="button" disabled={busy} className="adm-btn-ghost adm-btn-sm" onClick={() => change(u.id, { active: !u.active })}>
                      {u.active ? "Disable" : "Enable"}
                    </button>
                    <button type="button" disabled={busy} className="adm-btn-danger adm-btn-sm" onClick={() => remove(u)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </>
                )}
              </div>
              {resetFor === u.id && <div className="sm:pl-[52px]"><ResetPassword id={u.id} onDone={() => setResetFor(null)} /></div>}
            </li>
          ))}
        </ul>
      </section>

      <section className="adm-card h-fit p-5 sm:p-6">
        <h2 className="mb-1 font-serif text-lg font-bold text-deep-teal">Add a user</h2>
        <p className="mb-4 text-xs text-text-muted">They sign in at /admin/login with this email and password.</p>
        <form action={action} className="space-y-4">
          {state?.error && <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{state.error}</p>}
          <div>
            <label htmlFor="u-name" className="adm-label">Name</label>
            <input id="u-name" name="name" required defaultValue={v.name ?? ""} className="adm-input" />
          </div>
          <div>
            <label htmlFor="u-email" className="adm-label">Email</label>
            <input id="u-email" name="email" type="email" required defaultValue={v.email ?? ""} className="adm-input" />
          </div>
          <div>
            <label htmlFor="u-role" className="adm-label">Role</label>
            <select id="u-role" name="role" defaultValue={v.role ?? "editor"} className="adm-input">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <ul className="adm-help space-y-0.5">
              {Object.entries(ROLE_HELP).map(([r, t]) => <li key={r}><b className="capitalize">{r}:</b> {t}</li>)}
            </ul>
          </div>
          <div>
            <label htmlFor="u-pw" className="adm-label">Temporary password</label>
            <input id="u-pw" name="password" type="text" autoComplete="new-password" required className="adm-input" placeholder="8+ characters, letters & numbers" />
          </div>
          <button type="submit" disabled={pending} className="adm-btn-primary w-full">
            {pending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} Create user
          </button>
        </form>
      </section>
    </div>
  );
}
