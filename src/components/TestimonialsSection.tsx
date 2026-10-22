"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonialsData } from "@/data/jaisalmerData";

export default function TestimonialsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardOffset = () => {
    if (!carouselRef.current) return 320;
    const card = carouselRef.current.firstElementChild as HTMLElement;
    if (!card) return 320;
    const style = window.getComputedStyle(carouselRef.current);
    const gap = parseFloat(style.gap) || 16;
    return card.offsetWidth + gap;
  };

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const offset = getCardOffset();
      if (offset > 0) {
        const newIndex = Math.round(scrollLeft / offset);
        setActiveIndex(Math.min(Math.max(0, newIndex), testimonialsData.length - 1));
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const offset = getCardOffset();
      carouselRef.current.scrollBy({
        left: direction === "left" ? -offset : offset,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const offset = getCardOffset();
      carouselRef.current.scrollTo({
        left: index * offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white border-t border-border-light overflow-hidden">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6">
        {/* Section Header (Centered on mobile, left on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 text-center sm:text-left items-center sm:items-start">
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <span className="block text-center sm:text-left w-full font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold mb-1.5 sm:mb-2">
              TRAVELER STORIES
            </span>
            <h2 className="block text-center sm:text-left w-full font-serif text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-teal tracking-tight my-1 sm:my-2">
              What Our Travelers Say
            </h2>
            <p className="block text-center sm:text-left w-full font-sans text-xs sm:text-base text-text-muted mt-0.5 sm:mt-1 max-w-xl mx-auto sm:mx-0">
              Genuine reviews and unforgettable desert memories shared by our happy guests
            </p>
          </div>

          {/* Desktop Carousel Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button 
              className={`w-10 h-10 rounded-full border border-border-light flex items-center justify-center transition-all duration-300 ${
                canScrollLeft 
                  ? "bg-white text-text-main hover:bg-gold hover:text-white hover:border-gold shadow-xs hover:shadow" 
                  : "bg-cream/40 text-text-muted/40 border-border-light/60 cursor-not-allowed"
              }`}
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className={`w-10 h-10 rounded-full border border-border-light flex items-center justify-center transition-all duration-300 ${
                canScrollRight 
                  ? "bg-white text-text-main hover:bg-gold hover:text-white hover:border-gold shadow-xs hover:shadow" 
                  : "bg-cream/40 text-text-muted/40 border-border-light/60 cursor-not-allowed"
              }`}
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Track */}
        <div 
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1 px-1 sm:px-0 snap-x snap-mandatory scroll-smooth" 
          ref={carouselRef}
          onScroll={checkScroll}
        >
          {testimonialsData.map((item) => (
            <div 
              key={item.id} 
              className="snap-start shrink-0 w-[84vw] max-w-[380px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] flex flex-col p-5 sm:p-6 rounded-[8px] bg-cream/40 border border-border-light shadow-xs sm:shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-gold/40 hover:bg-white"
            >
              {/* Header: Avatar & Info */}
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold/40 shrink-0 relative bg-cream">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    unoptimized
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-text-main truncate">{item.name}</h4>
                  <p className="font-sans text-[11px] sm:text-xs text-text-muted truncate">{item.city}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>

              {/* Quote text */}
              <div className="relative pl-5 sm:pl-6 flex-1">
                <Quote size={16} className="absolute left-0 top-0 text-gold/40 sm:w-[18px] sm:h-[18px]" />
                <p className="font-sans text-xs sm:text-sm text-text-main/90 leading-relaxed italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots & Mobile Controls */}
        <div className="flex items-center justify-center gap-2.5 pt-3 sm:pt-4">
          <button
            className={`sm:hidden w-8 h-8 rounded-full border border-border-light flex items-center justify-center transition-all duration-200 ${
              canScrollLeft 
                ? "bg-white text-text-main active:bg-gold active:text-white" 
                : "bg-cream/40 text-text-muted/30 border-border-light/50"
            }`}
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous review"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="flex items-center gap-1.5">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i 
                    ? "w-6 bg-gold" 
                    : "w-2 bg-border-light hover:bg-gold/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={`sm:hidden w-8 h-8 rounded-full border border-border-light flex items-center justify-center transition-all duration-200 ${
              canScrollRight 
                ? "bg-white text-text-main active:bg-gold active:text-white" 
                : "bg-cream/40 text-text-muted/30 border-border-light/50"
            }`}
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next review"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
