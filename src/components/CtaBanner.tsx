"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

interface CtaBannerProps {
  onQuoteClick: () => void;
  onVideoClick?: () => void;
}

export default function CtaBanner({ onQuoteClick, onVideoClick }: CtaBannerProps) {
  return (
    <section className="relative py-12 sm:py-14 lg:py-16 overflow-hidden">
      {/* Background Image with Beneath_Fort.png Desert Night Theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/Beneath_Fort.png"
          alt="Plan Your Jaisalmer Getaway with glowing lanterns and luxury desert camp"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Balanced atmospheric overlay so lanterns & desert camp imagery remain vivid while text is perfectly legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-bold text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg leading-tight">
          Plan Your Jaisalmer Getaway Today
        </h2>

        <p className="font-sans text-xs sm:text-sm md:text-base lg:text-lg text-white/95 mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow font-normal leading-relaxed">
          Hotels, Camps, Tours and Unique Experiences — All in One Place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Get Free Quote Button */}
          <button 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-[5px] bg-gradient-to-r from-[#e39237] to-[#c97b28] hover:from-[#d5842c] hover:to-[#b86d1f] text-white font-sans font-semibold text-sm sm:text-base shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group" 
            onClick={onQuoteClick}
          >
            <span>Get Free Quote</span>
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Watch Video Button */}
          <button 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-[5px] bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/80 hover:border-white text-white font-sans font-semibold text-sm sm:text-base shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group" 
            onClick={onVideoClick || onQuoteClick}
          >
            <span className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Play size={11} className="fill-white translate-x-[0.5px]" />
            </span>
            <span>Watch Video</span>
          </button>
        </div>
      </div>
    </section>
  );
}
