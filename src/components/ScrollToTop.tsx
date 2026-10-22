"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold text-white shadow-gold flex items-center justify-center transition-all duration-300 hover:bg-gold-dark hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} className="sm:w-5 sm:h-5 stroke-[2.5]" />
    </button>
  );
}
