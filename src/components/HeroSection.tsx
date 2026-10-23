"use client";

import React from "react";
import Image from "next/image";
import { Building2, Tent, Compass, Sparkles } from "lucide-react";
import SearchCard from "./SearchCard";

interface HeroSectionProps {
  onSearch: (params: any) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[auto] lg:min-h-[88vh] flex flex-col justify-between pt-36 sm:pt-25 md:pt-30 pb-8 sm:pb-6"
    >
      {/* Hero Background Image with Parallax & Amber Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/banners/hero-fort.jpg"
          alt="Jaisalmer Golden Fort at sunset with traditional rooftop terrace"
          fill
          priority
          className="object-cover object-[center_38%] scale-105"
          sizes="100vw"
        />
        {/* Cinematic Vignette Overlay: Vertical & Directional for supreme text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2026]/75 via-black/55 via-50% to-cream to-98%" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 sm:from-black/45 via-black/45 via-60% to-black/20 pointer-events-none" />
      </div>

      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 relative z-10 flex flex-col lg:flex-row justify-between items-center sm:items-start gap-6 sm:gap-8 w-full mb-4 sm:mb-6 text-center sm:text-left">
        <div className="max-w-2xl text-white flex flex-col items-center sm:items-start mx-auto sm:mx-0">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 mb-2.5 sm:mb-3.5 bg-black/40 backdrop-blur-md px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-md">
            <span className="w-2.5 sm:w-3 h-[1.5px] bg-[#DF9745]" />
            <span className="font-sans text-[10.5px] sm:text-xs font-bold tracking-[0.18em] sm:tracking-[0.24em] text-[#FDF0D5] uppercase whitespace-nowrap">
              DISCOVER • EXPLORE • EXPERIENCE
            </span>
            <span className="w-2.5 sm:w-3 h-[1.5px] bg-[#DF9745]" />
          </div>

          {/* Main Title */}
          <h1 className="flex flex-col items-center sm:items-start mb-3 sm:mb-4">
            <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-extrabold text-white leading-tight sm:leading-none tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] [text-shadow:0_3px_12px_rgba(0,0,0,0.9)]">
              Jaisalmer
            </span>
            <span className="font-serif text-base sm:text-2xl md:text-3xl font-medium italic text-[#FFE8C2] mt-1.5 sm:mt-2.5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
              — A Land of Golden Stories
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-xs sm:text-base md:text-lg text-white font-medium leading-relaxed max-w-xl mb-4 sm:mb-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] [text-shadow:0_2px_6px_rgba(0,0,0,0.85)] mx-auto sm:mx-0">
            Heritage stays, luxury desert camps, thrilling tours and
            unforgettable experiences in the heart of Rajasthan.
          </p>

          {/* Category Feature Pills */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2.5">
            <a
              href="#hotels"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] bg-[#123038]/85 backdrop-blur-md border border-[#DF9745]/60 text-[#FBF8F2] font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#C97F2C] hover:border-white hover:-translate-y-0.5 shadow-md"
            >
              <Building2 size={14} className="sm:w-[15px] sm:h-[15px] text-[#DF9745]" />
              <span>Heritage Hotels</span>
            </a>
            <a
              href="#camps"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] bg-[#123038]/85 backdrop-blur-md border border-[#DF9745]/60 text-[#FBF8F2] font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#C97F2C] hover:border-white hover:-translate-y-0.5 shadow-md"
            >
              <Tent size={14} className="sm:w-[15px] sm:h-[15px] text-[#DF9745]" />
              <span>Desert Camps</span>
            </a>
            <a
              href="#tours"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] bg-[#123038]/85 backdrop-blur-md border border-[#DF9745]/60 text-[#FBF8F2] font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#C97F2C] hover:border-white hover:-translate-y-0.5 shadow-md"
            >
              <Compass size={14} className="sm:w-[15px] sm:h-[15px] text-[#DF9745]" />
              <span>Guided Tours</span>
            </a>
            <a
              href="#experiences"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] bg-[#123038]/85 backdrop-blur-md border border-[#DF9745]/60 text-[#FBF8F2] font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-[#C97F2C] hover:border-white hover:-translate-y-0.5 shadow-md"
            >
              <Sparkles size={14} className="sm:w-[15px] sm:h-[15px] text-[#DF9745]" />
              <span>Local Experiences</span>
            </a>
          </div>
        </div>

        {/* Script Badge Overlay on Right */}
        <div className="hidden md:flex flex-col self-center mr-8 lg:mr-16 rotate-[-9deg] pointer-events-none select-none text-left">
          <span className="font-autumn text-2xl sm:text-[20px] lg:text-[40px] font-[280] text-white h-[200px] leading-[1.8] tracking-[0.5px] capitalize drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] [text-shadow:0_0_25px_rgba(223,151,69,0.5)] opacity-80">
            More <br />
            than a<br />
            Destination
          </span>
        </div>
      </div>

      {/* Embedded Search Card Overlapping Hero Bottom */}
      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 w-full relative z-30">
        <SearchCard onSearch={onSearch} />
      </div>
    </section>
  );
}
