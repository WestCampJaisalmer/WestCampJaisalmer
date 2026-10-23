import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { hasRole, requireUser } from "@/lib/auth/dal";
import { getEnquiry, getEnquiryNotes } from "@/lib/enquiries";
import { query } from "@/lib/db";
import { typeLabel } from "@/lib/enquiry-constants";
import { Pill, PageHeader, StatusBadge, formatDateTime } from "@/components/admin/ui";
import { EnquiryControls, NoteForm } from "@/components/admin/EnquiryControls";

export const metadata = { title: "Enquiry" };

function humanKey(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function renderValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  if (v && typeof v === "object") return JSON.stringify(v);
  return String(v ?? "—");
}

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("viewer");
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();

  const [notes, staff] = await Promise.all([
    getEnquiryNotes(id),
    query<{ id: string; name: string }>(`select id, name from admin_users where active = true order by name`),
  ]);
  const details = Object.entries(enquiry.details ?? {}).filter(([, v]) => v !== "" && v !== null && v !== undefined);
  const digits = (enquiry.phone ?? "").replace(/[^0-9]/g, "");
  // 10-digit local numbers are assumed to be Indian
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const waText = encodeURIComponent(`Hello ${enquiry.name}, thank you for your enquiry with West Camp Jaisalmer (ref ${enquiry.ref}).`);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/enquiries", label: "All enquiries" }}
        title={enquiry.name}
        description={`${enquiry.ref} · received ${formatDateTime(enquiry.created_at)}`}
        actions={<StatusBadge status={enquiry.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="adm-card p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Pill tone="gold">{typeLabel(enquiry.type)}</Pill>
              {enquiry.item_name && <Pill>{enquiry.item_name}</Pill>}
              {enquiry.source_page && <span className="text-xs text-text-light">from {enquiry.source_page}</span>}
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Phone</dt>
                <dd className="mt-0.5 text-sm font-medium">{enquiry.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Email</dt>
                <dd className="mt-0.5 break-all text-sm font-medium">{enquiry.email || "—"}</dd>
              </div>
              {enquiry.subject && (
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Subject</dt>
                  <dd className="mt-0.5 text-sm font-medium">{enquiry.subject}</dd>
                </div>
              )}
            </dl>

            {enquiry.message && (
              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap rounded-sm bg-cream p-4 text-sm leading-relaxed">{enquiry.message}</p>
              </div>
            )}

            {details.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">Booking details</p>
                <dl className="grid gap-x-6 gap-y-3 rounded-sm border border-border-light p-4 sm:grid-cols-2">
                  {details.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-text-muted">{humanKey(k)}</dt>
                      <dd className="text-sm font-semibold">{renderValue(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {hasRole(user.role, "viewer") && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border-light pt-5">
                {enquiry.phone && (
                  <>
                    <a href={`tel:${enquiry.phone}`} className="adm-btn-ghost adm-btn-sm"><Phone size={14} /> Call</a>
                    <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer" className="adm-btn adm-btn-sm bg-[#25D366] text-white hover:bg-[#1fb857]">
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </>
                )}
                {enquiry.email && (
                  <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Your enquiry ${enquiry.ref} - West Camp Jaisalmer`)}`} className="adm-btn-ghost adm-btn-sm">
                    <Mail size={14} /> Email
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="adm-card p-5 sm:p-6">
            <h2 className="font-serif text-lg font-bold text-deep-teal">Activity & notes</h2>
            {notes.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">No activity yet.</p>
            ) : (
              <ol className="mt-4 space-y-4 border-l-2 border-border-light pl-5">
                {notes.map((n) => (
                  <li key={n.id} className="relative">
                    <span className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${n.kind === "note" ? "bg-gold" : "bg-stone-300"}`} />
                    <p className={`text-sm ${n.kind === "note" ? "whitespace-pre-wrap rounded-sm bg-cream p-3" : "text-text-muted"}`}>{n.body}</p>
                    <p className="mt-1 text-[11px] text-text-light">{n.user_name ?? "System"} · {formatDateTime(n.created_at)}</p>
                  </li>
                ))}
              </ol>
            )}
            {hasRole(user.role, "editor") && <NoteForm id={id} />}
          </section>
        </div>

        <aside className="adm-card h-fit p-5 sm:p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-deep-teal">Manage</h2>
          <EnquiryControls
            id={id}
            status={enquiry.status}
            assignedTo={enquiry.assigned_to}
            staff={staff}
            canWrite={hasRole(user.role, "editor")}
            canDelete={user.role === "admin"}
          />
        </aside>
      </div>
    </>
  );
}
