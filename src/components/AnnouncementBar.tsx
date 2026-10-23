"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";

/** Dismissible banner controlled from Admin > Site settings. Sits at the bottom to avoid the fixed navbar. */
export default function AnnouncementBar() {
  const { settings } = useContent();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // hidden until we've checked storage (avoids a flash)
  const key = `announcement_dismissed:${settings.announcementText}`;

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(key) === "1");
    } catch {
      setDismissed(false);
    }
  }, [key]);

  if (pathname?.startsWith("/admin") || !settings.announcementEnabled || !settings.announcementText.trim() || dismissed) return null;

  const text = (
    <span className="flex items-center gap-2">
      <Megaphone size={15} className="shrink-0" />
      <span>{settings.announcementText}</span>
    </span>
  );
  const link = settings.announcementLink.trim();

  return (
    <div role="region" aria-label="Announcement" className="fixed inset-x-0 bottom-0 z-[990] bg-[#123038] px-4 py-2.5 pr-14 text-center text-xs font-medium text-white shadow-2xl sm:text-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        {link ? (
          link.startsWith("/") ? (
            <Link href={link} className="underline-offset-2 hover:underline">{text}</Link>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{text}</a>
          )
        ) : (
          text
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setDismissed(true);
          try { sessionStorage.setItem(key, "1"); } catch { /* ignore */ }
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
