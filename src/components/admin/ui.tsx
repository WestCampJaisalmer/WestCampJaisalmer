import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { statusLabel } from "@/lib/enquiry-constants";

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-gold">
            <ChevronLeft size={14} /> {back.label}
          </Link>
        )}
        <h1 className="font-serif text-xl font-bold text-deep-teal sm:text-2xl md:text-3xl lining-nums">{title}</h1>
        {description && <p className="mt-1 text-xs sm:text-sm text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{actions}</div>}
    </div>
  );
}

export function Flash({ tone = "success", children }: { tone?: "success" | "error" | "info"; children: React.ReactNode }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`mb-5 rounded-sm border px-4 py-3 text-sm font-medium ${styles}`}>
      {children}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 ring-amber-200",
  contacted: "bg-sky-100 text-sky-800 ring-sky-200",
  quoted: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  completed: "bg-teal-100 text-teal-800 ring-teal-200",
  cancelled: "bg-stone-200 text-stone-700 ring-stone-300",
  spam: "bg-red-100 text-red-700 ring-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700 ring-stone-200"}`}>
      {statusLabel(status)}
    </span>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "gold" | "green" | "muted" }) {
  const t = {
    neutral: "bg-cream-alt text-deep-teal",
    gold: "bg-gold/15 text-gold-dark",
    green: "bg-emerald-100 text-emerald-800",
    muted: "bg-stone-200 text-stone-600",
  }[tone];
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${t}`}>{children}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream-alt text-gold">
        <Inbox size={22} />
      </div>
      <p className="font-serif text-lg font-bold text-deep-teal">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  hrefFor,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-light px-4 py-3 text-xs sm:flex-row sm:text-sm text-text-muted">
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="adm-btn-ghost adm-btn-sm" aria-label="Previous page">
            <ChevronLeft size={14} /> Prev
          </Link>
        ) : (
          <span className="adm-btn-ghost adm-btn-sm pointer-events-none opacity-50"><ChevronLeft size={14} /> Prev</span>
        )}
        <span className="px-1 font-semibold text-deep-teal">
          {page} / {pages}
        </span>
        {page < pages ? (
          <Link href={hrefFor(page + 1)} className="adm-btn-ghost adm-btn-sm" aria-label="Next page">
            Next <ChevronRight size={14} />
          </Link>
        ) : (
          <span className="adm-btn-ghost adm-btn-sm pointer-events-none opacity-50">Next <ChevronRight size={14} /></span>
        )}
      </div>
    </div>
  );
}

export function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" });
}

export function timeAgo(d: Date | string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
}
