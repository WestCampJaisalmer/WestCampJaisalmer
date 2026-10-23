"use client";

import React, { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/content";
import { setWhatsAppNumber } from "@/utils/whatsapp";
import { applyCurrencyRates } from "@/context/CurrencyContext";

const ContentContext = createContext<SiteContent | null>(null);

/**
 * Supplies everything the admin dashboard manages (hotels, camps, tours, packages, gallery,
 * testimonials, settings) to the public components, so they no longer import static files.
 */
export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  // Synchronous on purpose: click handlers and price formatting read these module values.
  setWhatsAppNumber(content.settings.whatsappNumber);
  applyCurrencyRates({
    USD: content.settings.rateUSD,
    EUR: content.settings.rateEUR,
    GBP: content.settings.rateGBP,
    AED: content.settings.rateAED,
  });
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent(): SiteContent {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>.");
  return ctx;
}
