"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  KeyRound, 
  Loader2, 
  Trash2, 
  UserPlus, 
  Shield, 
  Clock, 
  Mail, 
  X,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  Users
} from "lucide-react";
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

/* ────────── Reset Password Popup Modal ────────── */
function ResetPasswordModal({ 
  user, 
  onClose 
}: { 
  user: UserRow; 
  onDone?: () => void;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetUserPassword.bind(null, user.id), undefined);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog" 
        aria-modal="true" 
        className="adm-card w-full max-w-md p-5 sm:p-6 shadow-2xl bg-white border border-border-light relative animate-in zoom-in-95"
      >
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1.5 text-text-muted hover:text-text-main rounded-md hover:bg-cream transition cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
            <KeyRound size={20} />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="font-serif text-lg font-bold text-deep-teal">Reset Password</h3>
            <p className="text-xs text-text-muted truncate">
              For <span className="font-semibold text-deep-teal">{user.name}</span> ({user.email})
            </p>
          </div>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="modal-new-pw" className="adm-label">New Password</label>
            <input 
              id="modal-new-pw"
              name="password" 
              type="text" 
              autoComplete="new-password" 
              placeholder="8+ characters, letters & numbers" 
              className="adm-input text-sm font-mono" 
              aria-label="New password" 
              required
              autoFocus
            />
            <p className="adm-help">Must be at least 8 characters with letters & numbers.</p>
          </div>

          {state?.error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
              <AlertCircle size={14} className="shrink-0 text-red-600" />
              <span>{state.error}</span>
            </div>
          )}
          {state?.success && (
            <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
              <span>{state.success}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="adm-btn-ghost w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={pending} 
              className="adm-btn-dark w-full sm:w-auto shadow-sm"
            >
              {pending ? <Loader2 size={15} className="animate-spin" /> : "Set new password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ────────── Main UserManager Component ────────── */
export default function UserManager({ users, meId }: { users: UserRow[]; meId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(createUser, undefined);
  const [busy, start] = useTransition();
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
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
    <div className="space-y-6">
      {/* Reset Password Modal Popup */}
      {resetUser && (
        <ResetPasswordModal 
          user={resetUser} 
          onClose={() => setResetUser(null)} 
        />
      )}

      {/* ────────── 1. Users List (Compact Height on Desktop & Mobile Responsive) ────────── */}
      <section className="adm-card overflow-hidden w-full">
        <div className="flex items-center justify-between border-b border-border-light bg-cream/30 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-deep-teal">
              Dashboard Users ({users.length})
            </h2>
          </div>
          <span className="text-xs text-text-muted hidden sm:inline">
            Manage roles, passwords & permissions
          </span>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <ul className="divide-y divide-border-light">
          {users.map((u) => (
            <li key={u.id} className="transition hover:bg-cream/15">
              {/* DESKTOP COMPACT ROW (Single Streamlined Row) */}
              <div className="hidden md:flex items-center justify-between gap-4 px-5 py-3">
                {/* User info & badges */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div 
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                      u.active 
                        ? "bg-gold/20 text-gold-dark ring-2 ring-gold/30" 
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-deep-teal text-sm truncate">
                      {u.name}
                    </span>
                    {u.id === meId && <Pill tone="gold">You</Pill>}
                    {!u.active && <Pill tone="muted">Disabled</Pill>}
                    <span className="text-xs text-text-muted truncate">
                      · {u.email}
                    </span>
                    <span className="text-[11px] text-text-light truncate hidden lg:inline">
                      · Last sign-in: {u.lastLogin}
                    </span>
                  </div>
                </div>

                {/* Role select & Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={u.role}
                    disabled={busy || u.id === meId}
                    onChange={(e) => change(u.id, { role: e.target.value })}
                    className="adm-input !w-auto !py-1 !px-2.5 text-xs font-semibold uppercase tracking-wider text-deep-teal cursor-pointer disabled:cursor-not-allowed"
                    aria-label={`Role for ${u.name}`}
                    title={u.id === meId ? "You can't change your own role" : ROLE_HELP[u.role]}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  <button 
                    type="button" 
                    className="adm-btn-ghost adm-btn-sm !py-1" 
                    onClick={() => setResetUser(u)}
                    title="Reset user password in popup"
                  >
                    <KeyRound size={12} className="text-gold" /> Reset
                  </button>

                  {u.id !== meId && (
                    <>
                      <button 
                        type="button" 
                        disabled={busy} 
                        className="adm-btn-ghost adm-btn-sm !py-1" 
                        onClick={() => change(u.id, { active: !u.active })}
                      >
                        {u.active ? (
                          <>
                            <UserX size={12} className="text-stone-400" /> Disable
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} className="text-emerald-600" /> Enable
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        disabled={busy} 
                        className="adm-btn-danger adm-btn-sm !py-1" 
                        onClick={() => remove(u)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* MOBILE COMPACT CARD */}
              <div className="md:hidden p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div 
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                        u.active 
                          ? "bg-gold/20 text-gold-dark ring-2 ring-gold/30" 
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-deep-teal text-sm leading-tight">
                          {u.name}
                        </span>
                        {u.id === meId && <Pill tone="gold">You</Pill>}
                        {!u.active && <Pill tone="muted">Disabled</Pill>}
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5">{u.email}</p>
                      <p className="text-[11px] text-text-light mt-0.5">Last: {u.lastLogin}</p>
                    </div>
                  </div>

                  <select
                    value={u.role}
                    disabled={busy || u.id === meId}
                    onChange={(e) => change(u.id, { role: e.target.value })}
                    className="adm-input !w-auto !py-1 !px-2 text-xs font-semibold uppercase tracking-wider text-deep-teal cursor-pointer shrink-0 disabled:cursor-not-allowed"
                    aria-label={`Role for ${u.name}`}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                {/* Mobile action buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border-light/60">
                  <button 
                    type="button" 
                    className="adm-btn-ghost adm-btn-sm !py-1 text-xs" 
                    onClick={() => setResetUser(u)}
                  >
                    <KeyRound size={12} className="text-gold" /> Reset pw
                  </button>

                  {u.id !== meId && (
                    <>
                      <button 
                        type="button" 
                        disabled={busy} 
                        className="adm-btn-ghost adm-btn-sm !py-1 text-xs" 
                        onClick={() => change(u.id, { active: !u.active })}
                      >
                        {u.active ? (
                          <>
                            <UserX size={12} className="text-stone-400" /> Disable
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} className="text-emerald-600" /> Enable
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        disabled={busy} 
                        className="adm-btn-danger adm-btn-sm !py-1 text-xs" 
                        onClick={() => remove(u)}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ────────── 2. Add User Form (BELOW the users list, Responsive & Compact) ────────── */}
      <section className="adm-card p-4 sm:p-6 w-full">
        <div className="flex items-center justify-between border-b border-border-light pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold-dark">
              <UserPlus size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-deep-teal">Add a new user</h2>
              <p className="text-xs text-text-muted">
                New team members sign in at <code className="bg-cream px-1.5 py-0.5 rounded text-[11px] font-mono">/admin/login</code> with these credentials.
              </p>
            </div>
          </div>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {state.error}
            </p>
          )}

          {/* Responsive 4-column Grid on Desktop, 2 on Tablet, 1 on Mobile */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="u-name" className="adm-label">Full Name</label>
              <input 
                id="u-name" 
                name="name" 
                required 
                defaultValue={v.name ?? ""} 
                className="adm-input" 
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label htmlFor="u-email" className="adm-label">Email Address</label>
              <input 
                id="u-email" 
                name="email" 
                type="email" 
                required 
                defaultValue={v.email ?? ""} 
                className="adm-input" 
                placeholder="name@westcamp.in"
              />
            </div>

            <div>
              <label htmlFor="u-role" className="adm-label">Role</label>
              <select id="u-role" name="role" defaultValue={v.role ?? "editor"} className="adm-input">
                <option value="admin">Admin (Full access)</option>
                <option value="editor">Editor (Content & enquiries)</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
            </div>

            <div>
              <label htmlFor="u-pw" className="adm-label">Temporary Password</label>
              <input 
                id="u-pw" 
                name="password" 
                type="text" 
                autoComplete="new-password" 
                required 
                className="adm-input font-mono text-xs" 
                placeholder="8+ chars, letters & numbers" 
              />
            </div>
          </div>

          {/* Tips and Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border-light/60">
            <div className="text-[11px] text-text-muted flex flex-wrap gap-x-4 gap-y-1">
              <span><b className="text-deep-teal">Admin:</b> Full access</span>
              <span><b className="text-deep-teal">Editor:</b> Content & enquiries</span>
              <span><b className="text-deep-teal">Viewer:</b> Read-only access</span>
            </div>

            <button 
              type="submit" 
              disabled={pending} 
              className="adm-btn-primary w-full sm:w-auto px-6 py-2.5 justify-center shadow-hover"
            >
              {pending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} Create user
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
