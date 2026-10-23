"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Inbox, Building2, Tent, Compass, MapPin, Package, Quote, Images, Tags,
  ImageIcon, LayoutTemplate, Settings, Users, History, UserCircle, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { logout } from "@/app/admin/actions/auth";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building2, Tent, Compass, MapPin, Package, Quote, Images, Tags,
};

export interface NavContent {
  key: string;
  label: string;
  icon: string;
  badge?: number;
}

interface Props {
  user: { name: string; email: string; role: string };
  content: NavContent[];
  newEnquiries: number;
}

export default function Sidebar({ user, content, newEnquiries }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string, exact = false) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  const Item = ({ href, icon: Icon, label, exact, badge }: { href: string; icon: any; label: string; exact?: boolean; badge?: number }) => {
    const active = isActive(href, exact);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center gap-3 rounded-sm px-3 py-2 text-[13.5px] font-medium transition ${
          active ? "bg-gold text-white shadow-gold" : "text-white/75 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon size={17} className={active ? "text-white" : "text-gold-light"} />
        <span className="flex-1 truncate">{label}</span>
        {!!badge && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white text-gold-dark" : "bg-gold text-white"}`}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </Link>
    );
  };

  const Heading = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-1.5 mt-5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">{children}</p>
  );

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-serif text-lg font-bold text-white">W</div>
        <div className="min-w-0 leading-tight">
          <p className="truncate font-serif text-[15px] font-bold text-white">West Camp</p>
          <p className="text-[11px] text-white/50">Admin Dashboard</p>
        </div>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-4">
        <Heading>Overview</Heading>
        <Item href="/admin" icon={LayoutDashboard} label="Dashboard" exact />
        <Item href="/admin/enquiries" icon={Inbox} label="Enquiries" badge={newEnquiries} />

        <Heading>Website content</Heading>
        {user.role !== "viewer" && <Item href="/admin/home-page" icon={LayoutTemplate} label="Home page" />}
        {content.map((c) => (
          <Item key={c.key} href={`/admin/content/${c.key}`} icon={ICONS[c.icon] ?? Package} label={c.label} badge={c.badge} />
        ))}
        <Item href="/admin/media" icon={ImageIcon} label="Media library" />

        <Heading>Manage</Heading>
        {user.role === "admin" && <Item href="/admin/settings" icon={Settings} label="Site settings" />}
        {user.role === "admin" && <Item href="/admin/users" icon={Users} label="Users & roles" />}
        <Item href="/admin/activity" icon={History} label="Activity log" />
        <Item href="/admin/profile" icon={UserCircle} label="My profile" />
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={15} /> View live website
        </a>
        <div className="flex items-center gap-3 rounded-sm bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-light/90 text-sm font-bold text-deep-teal">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
            <p className="text-[11px] capitalize text-white/50">{user.role}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="cursor-pointer rounded-sm p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-deep-teal px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold font-serif font-bold text-white">W</div>
          <span className="font-serif text-[15px] font-bold text-white">Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="cursor-pointer rounded-sm p-2 text-white" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 bg-deep-teal lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-deep-teal shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 cursor-pointer rounded-sm p-1.5 text-white/70 hover:text-white" aria-label="Close menu">
              <X size={20} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
