"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
} from "lucide-react";
import type { Camp } from "@/data/jaisalmerData";
import { useContent } from "@/context/ContentContext";
import { useCurrency } from "@/context/CurrencyContext";

interface CampsSectionProps {
  onSelectCamp: (camp: Camp) => void;
  onViewAll: () => void;
}

export default function CampsSection({
  onSelectCamp,
  onViewAll,
}: CampsSectionProps) {
  const { formatPrice } = useCurrency();
  const { camps: campsData } = useContent();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="camps"
      className="py-12 sm:py-16 lg:py-20 bg-cream/40 border-t border-border-light scroll-mt-20"
    >
      <div className="max-w-[1350px] mx-auto px-3 sm:px-6">
        {/* Section Header (Centered on mobile, left on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 text-center sm:text-left items-center sm:items-start">
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <span className="block text-center sm:text-left w-full font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold mb-1.5 sm:mb-2">
              DESERT GLAMPING & RETREATS
            </span>
            <h2 className="block text-center sm:text-left w-full font-serif text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-teal tracking-tight my-1 sm:my-2">
              Desert Camps in Jaisalmer
            </h2>
            <p className="block text-center sm:text-left w-full font-sans text-xs sm:text-base text-text-muted mt-0.5 sm:mt-1 max-w-xl mx-auto sm:mx-0">
              Experience the tranquility of the Thar Desert with luxury Swiss
              tents and cultural campfires
            </p>
          </div>

          {/* Actions & Carousel Nav */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
            <button
              className="inline-flex items-center gap-1.5 text-gold font-sans font-semibold text-xs sm:text-sm hover:text-gold-dark hover:translate-x-1 transition-all"
              onClick={onViewAll}
            >
              <span>View All Camps</span>
              <ArrowRight size={14} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white flex items-center justify-center text-text-main shadow-xs transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold"
                onClick={() => handleScroll("left")}
                aria-label="Previous camps"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white flex items-center justify-center text-text-main shadow-xs transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold"
                onClick={() => handleScroll("right")}
                aria-label="Next camps"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Camps Grid / Carousel */}
        <div
          className="flex overflow-x-auto no-scrollbar gap-3.5 sm:gap-6 pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 pt-4 px-1 sm:px-0"
          ref={carouselRef}
        >
          {campsData.map((camp) => {
            const isFav = favorites[camp.id];
            return (
              <div
                key={camp.id}
                className="w-[82vw] max-w-[290px] sm:w-[320px] lg:w-auto shrink-0 snap-start group flex flex-col bg-white rounded-[6px] overflow-hidden border border-border-light shadow-xs sm:shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 hover:border-gold/50 cursor-pointer"
                onClick={() => onSelectCamp(camp)}
              >
                {/* Image Wrap */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-cream shrink-0">
                  <Image
                    src={camp.image}
                    alt={camp.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 768px) 85vw, 320px"
                  />
                  {/* Heart Wishlist Button */}
                  <button
                    className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isFav
                        ? "bg-white shadow-md scale-105"
                        : "bg-black/35 backdrop-blur-sm hover:bg-black/60"
                    }`}
                    onClick={(e) => toggleFavorite(camp.id, e)}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={15}
                      className={
                        isFav ? "fill-rose-500 text-rose-500" : "text-white"
                      }
                    />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3.5 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#123038] group-hover:text-[#C97F2C] transition-colors leading-snug mb-2 truncate">
                    {camp.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                    <Star size={13} className="fill-gold text-gold" />
                    <span className="font-sans font-bold text-xs text-text-main">
                      {camp.rating}
                    </span>
                    <span className="font-sans text-[11px] text-text-muted">
                      ({camp.reviews})
                    </span>
                  </div>

                  <p className="flex items-center gap-1 font-sans text-xs sm:text-sm text-[#5C5A55] leading-relaxed mb-3 sm:mb-4">
                    <MapPin size={12} className="text-gold shrink-0" />
                    <span className="truncate">{camp.location}</span>
                  </p>

                  <div className="mt-auto pt-2.5 sm:pt-3.5 border-t border-dashed border-border-light flex items-baseline justify-between">
                    <div>
                      {/* <span className="font-sans text-[11px] text-text-muted">
                        From{" "}
                      </span> */}
                      <span className="font-serif text-2xl sm:text-[1.65rem] font-bold text-[#123038]">
                        {formatPrice(camp.price)}
                      </span>
                      <span className="font-sans text-xs sm:text-sm text-muted">
                        / night
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-xs sm:text-sm font-bold text-gold group-hover:text-gold-dark group-hover:translate-x-1 transition-all">
                      <span>View</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
