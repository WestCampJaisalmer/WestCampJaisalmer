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
      className="relative min-h-[auto] lg:min-h-[88vh] flex flex-col justify-between pt-36 sm:pt-36 md:pt-40 pb-8 sm:pb-10"
    >
      {/* Hero Background Image with Parallax & Amber Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-fort.jpg"
          alt="Jaisalmer Golden Fort at sunset with traditional rooftop terrace"
          fill
          priority
          className="object-cover object-[center_38%] scale-105"
          sizes="100vw"
        />
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal/60 via-black/25 via-45% to-cream to-98%" />
      </div>

      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 relative z-10 flex flex-col lg:flex-row justify-between items-center sm:items-start gap-6 sm:gap-8 w-full mb-6 sm:mb-10 text-center sm:text-left">
        <div className="max-w-2xl text-white drop-shadow-md flex flex-col items-center sm:items-start mx-auto sm:mx-0">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="w-4 sm:w-6 h-[1.5px] bg-gold-light" />
            <span className="font-sans text-[10px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.22em] text-[#f7e0bb] uppercase">
              DISCOVER • EXPLORE • EXPERIENCE
            </span>
            <span className="w-4 sm:w-6 h-[1.5px] bg-gold-light" />
          </div>

          {/* Main Title */}
          <h1 className="flex flex-col items-center sm:items-start mb-3 sm:mb-4">
            <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-extrabold text-white leading-tight sm:leading-none tracking-tight drop-shadow-lg">
              Jaisalmer
            </span>
            <span className="font-serif text-base sm:text-2xl md:text-3xl font-medium italic text-[#fcf4e8] mt-1 sm:mt-2 drop-shadow-md">
              — A Land of Golden Stories
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-xs sm:text-base md:text-lg text-white/95 leading-relaxed max-w-xl mb-4 sm:mb-7 drop-shadow mx-auto sm:mx-0">
            Heritage stays, luxury desert camps, thrilling tours and
            unforgettable experiences in the heart of Rajasthan.
          </p>

          {/* Category Feature Pills */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2.5">
            <a
              href="#hotels"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[5px] bg-teal/65 backdrop-blur-md border border-gold-light/40 text-cream font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-gold hover:border-white hover:-translate-y-0.5 hover:shadow-md"
            >
              <Building2 size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span>Heritage Hotels</span>
            </a>
            <a
              href="#camps"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[5px] bg-teal/65 backdrop-blur-md border border-gold-light/40 text-cream font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-gold hover:border-white hover:-translate-y-0.5 hover:shadow-md"
            >
              <Tent size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span>Desert Camps</span>
            </a>
            <a
              href="#tours"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[5px] bg-teal/65 backdrop-blur-md border border-gold-light/40 text-cream font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-gold hover:border-white hover:-translate-y-0.5 hover:shadow-md"
            >
              <Compass size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span>Guided Tours</span>
            </a>
            <a
              href="#experiences"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[5px] bg-teal/65 backdrop-blur-md border border-gold-light/40 text-cream font-sans text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-gold hover:border-white hover:-translate-y-0.5 hover:shadow-md"
            >
              <Sparkles size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span>Local Experiences</span>
            </a>
          </div>
        </div>

        {/* Script Badge Overlay on Right */}
        <div className="hidden md:flex flex-col self-center mr-8 lg:mr-16 rotate-[-9deg] pointer-events-none select-none text-left">
          <span className="font-autumn text-2xl sm:text-[20px] lg:text-[40px] font-[280] text-white h-[200px] leading-[1.8] tracking-[0.5px] capitalize drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] [text-shadow:0_0_25px_rgba(223,151,69,0.5)] opacity-60">
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
