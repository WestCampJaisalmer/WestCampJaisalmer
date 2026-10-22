"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // 1 INR in target currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", label: "INR (₹)", rate: 1 },
  USD: { code: "USD", symbol: "$", label: "USD ($)", rate: 1 / 86 },
  EUR: { code: "EUR", symbol: "€", label: "EUR (€)", rate: 1 / 93 },
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", rate: 1 / 110 },
  AED: { code: "AED", symbol: "AED ", label: "AED (د.إ)", rate: 1 / 23.4 },
};

export const CURRENCY_LIST: CurrencyConfig[] = [
  CURRENCIES.INR,
  CURRENCIES.USD,
  CURRENCIES.EUR,
  CURRENCIES.GBP,
  CURRENCIES.AED,
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInINR: number) => string;
  currencyConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_currency") as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }

      const handleStorageOrEvent = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        const code = (customEvent.detail || localStorage.getItem("preferred_currency")) as CurrencyCode;
        if (code && CURRENCIES[code]) {
          setCurrencyState(code);
        }
      };

      window.addEventListener("currencyChange", handleStorageOrEvent);
      window.addEventListener("storage", handleStorageOrEvent);

      return () => {
        window.removeEventListener("currencyChange", handleStorageOrEvent);
        window.removeEventListener("storage", handleStorageOrEvent);
      };
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (!CURRENCIES[code]) return;
    setCurrencyState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_currency", code);
      window.dispatchEvent(new CustomEvent("currencyChange", { detail: code }));
    }
  };

  const formatPrice = (amountInINR: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.INR;
    if (config.code === "INR") {
      return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
    }
    const converted = Math.round(amountInINR * config.rate);
    return `${config.symbol}${converted.toLocaleString("en-US")}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencyConfig: CURRENCIES[currency] || CURRENCIES.INR,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  const [fallbackCurrency, setFallbackCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    if (context) return;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_currency") as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setFallbackCurrency(saved);
      }
      const handleCurrencyChange = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        const code = (customEvent.detail || localStorage.getItem("preferred_currency")) as CurrencyCode;
        if (code && CURRENCIES[code]) {
          setFallbackCurrency(code);
        }
      };
      window.addEventListener("currencyChange", handleCurrencyChange);
      return () => window.removeEventListener("currencyChange", handleCurrencyChange);
    }
  }, [context]);

  if (context) {
    return context;
  }

  const activeCode = fallbackCurrency;
  const config = CURRENCIES[activeCode] || CURRENCIES.INR;

  const setCurrency = (code: CurrencyCode) => {
    if (!CURRENCIES[code]) return;
    setFallbackCurrency(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_currency", code);
      window.dispatchEvent(new CustomEvent("currencyChange", { detail: code }));
    }
  };

  const formatPrice = (amountInINR: number): string => {
    if (config.code === "INR") {
      return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
    }
    const converted = Math.round(amountInINR * config.rate);
    return `${config.symbol}${converted.toLocaleString("en-US")}`;
  };

  return {
    currency: activeCode,
    setCurrency,
    formatPrice,
    currencyConfig: config,
  };
}
