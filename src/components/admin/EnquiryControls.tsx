"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Trash2 } from "lucide-react";
import { addEnquiryNote, assignEnquiry, deleteEnquiryAndReturn, setEnquiryStatus } from "@/app/admin/actions/enquiries";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-constants";
import type { FormState } from "@/lib/action-types";

interface Props {
  id: string;
  status: string;
  assignedTo: string | null;
  staff: { id: string; name: string }[];
  canWrite: boolean;
  canDelete: boolean;
}

export function EnquiryControls({ id, status, assignedTo, staff, canWrite, canDelete }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      setError("");
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      router.refresh();
    });

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="status" className="adm-label">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {ENQUIRY_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={!canWrite || pending}
              aria-pressed={status === s.value}
              title={s.hint}
              onClick={() => run(() => setEnquiryStatus(id, s.value))}
              className={`cursor-pointer rounded-sm border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                status === s.value ? "border-deep-teal bg-deep-teal text-white" : "border-[#DDD2BF] bg-white text-deep-teal hover:bg-cream-alt"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="assign" className="adm-label">Assigned to</label>
        <select
          id="assign"
          className="adm-input"
          value={assignedTo ?? ""}
          disabled={!canWrite || pending}
          onChange={(e) => run(() => assignEnquiry(id, e.target.value || null))}
        >
          <option value="">Unassigned</option>
          {staff.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="adm-error">{error}</p>}
      {pending && <p className="flex items-center gap-2 text-xs text-text-muted"><Loader2 size={13} className="animate-spin" /> Saving…</p>}

      {canDelete && (
        <form
          action={deleteEnquiryAndReturn.bind(null, id)}
          onSubmit={(e) => {
            if (!window.confirm("Permanently delete this enquiry and its notes?")) e.preventDefault();
          }}
        >
          <button type="submit" className="adm-btn-danger adm-btn-sm"><Trash2 size={13} /> Delete enquiry</button>
        </form>
      )}
    </div>
  );
}

export function NoteForm({ id }: { id: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(addEnquiryNote.bind(null, id), undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      ref.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={ref} action={action} className="mt-4">
      <label htmlFor="note" className="adm-label">Add internal note</label>
      <textarea id="note" name="body" rows={3} maxLength={2000} className="adm-input" placeholder="Called the guest, sent the quote on WhatsApp…" />
      {state?.error && <p role="alert" className="adm-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="adm-btn-dark adm-btn-sm mt-2">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Add note
      </button>
    </form>
  );
}
