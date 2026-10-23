"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Phone } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const { settings } = useContent();
  const telHref = `tel:+${settings.phone.replace(/[^0-9]/g, "")}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <aside
      aria-label="Quick contact and navigation"
      className="fixed bottom-3.5 right-3 sm:bottom-5 sm:right-5 z-[999] flex flex-col items-center gap-2 sm:gap-2.5 pointer-events-none select-none"
    >
      {/* 1. Scroll To Top Button (Responsive with increased size) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-md text-[#123038] hover:text-[#C97F2C] border border-[#DECDB3] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer group ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <ArrowUp size={18} className="sm:w-5 sm:h-5 stroke-[2.5] transition-transform duration-200 text-[#123038] group-hover:text-[#C97F2C]" />
      </button>

      {/* 2. Modern Call Button (Brand Colors: #123038 & #C97F2C Gold, Small & Sleek) */}
      <a
        href={telHref}
        aria-label={`Call ${settings.phone}`}
        className="pointer-events-auto group relative w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#123038] via-[#1A4550] to-[#123038] border-2 border-[#C97F2C] text-[#C97F2C] shadow-md shadow-[#123038]/30 hover:shadow-lg hover:shadow-[#C97F2C]/30 flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
      >
        {/* Subtle pulsing gold ring */}
        <span className="absolute -inset-0.5 rounded-full bg-[#C97F2C]/35 animate-ping opacity-60 pointer-events-none" />

        {/* Brand Call Icon */}
        <div className="relative flex items-center justify-center">
          <Phone size={17} className="sm:w-5 sm:h-5 fill-[#C97F2C] text-[#C97F2C] transition-transform duration-300 group-hover:rotate-12" />
        </div>

        {/* Hover Tooltip for Desktop */}
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#123038] text-white text-[11px] font-semibold whitespace-nowrap shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-1.5 border border-[#C97F2C]/40">
          <span>Call: {settings.phone}</span>
        </span>
      </a>

      {/* 3. WhatsApp Floating Button (User Specified SVG, Small & Sleek) */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=Hello!%20I%20would%20like%20to%20inquire%20about%20West%20Camp%20Jaisalmer.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp (${settings.phone})`}
        className="pointer-events-auto group relative w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 drop-shadow-[0_4px_10px_rgba(39,180,62,0.35)] hover:drop-shadow-[0_6px_16px_rgba(39,180,62,0.55)] cursor-pointer"
      >
        {/* SVG Provided by User */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:rotate-6"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z" 
            fill="#BFC8D0"
          />
          <path 
            d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" 
            fill="url(#paint0_linear_87_7264_floating)"
          />
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z" 
            fill="white"
          />
          <path 
            d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z" 
            fill="white"
          />
          <defs>
            <linearGradient id="paint0_linear_87_7264_floating" x1="26.5" y1="7" x2="4" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5BD066"/>
              <stop offset="1" stopColor="#27B43E"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip for Desktop */}
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#123038] text-white text-[11px] font-semibold whitespace-nowrap shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-1.5 border border-[#C97F2C]/40">
          <span>Chat on WhatsApp</span>
        </span>
      </a>
    </aside>
  );
}
