"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Destination } from "@/data/jaisalmerData";
import { useContent } from "@/context/ContentContext";

interface DestinationsSectionProps {
  onSelectDestination: (dest: Destination) => void;
  onViewAll: () => void;
}

export default function DestinationsSection({ onSelectDestination, onViewAll }: DestinationsSectionProps) {
  const { destinations: destinationsData } = useContent();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 260;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="destinations" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-border-light scroll-mt-20">
      <div className="max-w-[1350px] mx-auto px-3 sm:px-6">
        {/* Section Header (Centered on mobile, left on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 text-center sm:text-left items-center sm:items-start">
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <span className="block text-center sm:text-left w-full font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold mb-1.5 sm:mb-2">
              ICONIC LANDMARKS
            </span>
            <h2 className="block text-center sm:text-left w-full font-serif text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-teal tracking-tight my-1 sm:my-2">
              Top Destinations in Jaisalmer
            </h2>
            <p className="block text-center sm:text-left w-full font-sans text-xs sm:text-base text-text-muted mt-0.5 sm:mt-1 max-w-xl mx-auto sm:mx-0">
              Explore the golden sandstone forts, serene desert lakes and legendary royal cenotaphs
            </p>
          </div>

          {/* Actions & Carousel Nav */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
            <button 
              className="inline-flex items-center gap-1.5 text-gold font-sans font-semibold text-xs sm:text-sm hover:text-gold-dark hover:translate-x-1 transition-all" 
              onClick={onViewAll}
            >
              <span>View All Places</span>
              <ArrowRight size={14} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white flex items-center justify-center text-text-main shadow-xs transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold" 
                onClick={() => handleScroll("left")}
                aria-label="Previous destinations"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white flex items-center justify-center text-text-main shadow-xs transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold" 
                onClick={() => handleScroll("right")}
                aria-label="Next destinations"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Destination Cards Carousel/Grid */}
        <div 
          className="flex overflow-x-auto no-scrollbar gap-3.5 sm:gap-5 pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-5 pt-1 px-1 sm:px-0" 
          ref={carouselRef}
        >
          {destinationsData.map((dest) => (
            <div 
              key={dest.id} 
              className="w-[76vw] max-w-[250px] sm:w-[260px] lg:w-auto shrink-0 snap-start group relative h-52 sm:h-60 rounded-[6px] overflow-hidden shadow-card border border-border-light/60 cursor-pointer flex flex-col justify-end p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover hover:border-gold/60" 
              onClick={() => onSelectDestination(dest)}
            >
              {/* Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 80vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal/95 via-teal/45 to-transparent group-hover:from-teal/90 transition-all" />
              </div>

              {/* Info */}
              <div className="relative z-10 flex flex-col">
                <h3 className="font-serif  text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-sm group-hover:text-gold-light transition-colors">
                  {dest.name}
                </h3>
                <span className="font-sans text-xs sm:text-sm text-gold-light font-medium mt-1">
                  {dest.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
