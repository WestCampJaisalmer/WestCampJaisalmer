"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Package,
  Compass,
  Users,
  Heart,
  Smile,
  Briefcase,
} from "lucide-react";

interface TharMagicSectionProps {
  onPlanTripClick: () => void;
}

export default function TharMagicSection({
  onPlanTripClick,
}: TharMagicSectionProps) {
  const highlights = [
    { label: "Custom Packages", icon: <Package size={15} /> },
    { label: "Private Tours", icon: <Compass size={15} /> },
    { label: "Group Bookings", icon: <Users size={15} /> },
    { label: "Honeymoon Special", icon: <Heart size={15} /> },
    { label: "Family Friendly", icon: <Smile size={15} /> },
    { label: "Corporate Trips", icon: <Briefcase size={15} /> },
  ];

  return (
    <section
      id="packages"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden scroll-mt-20"
    >
      {/* Sunrise Banner Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/Sunrise_Banner.png"
          alt="Sunrise Banner Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-[#FDFBF7]/40 pointer-events-none" />
      </div>

      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left: Atmospheric Photo of Woman on Sand Dune */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[380px] rounded-2xl lg:rounded-l-none lg:rounded-r-[50px] overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white group left-0 lg:-left-[80px]">
              <Image
                src="/images/thar-magic.jpg"
                alt="Woman traveler enjoying sunrise over Thar desert sand dunes in Jaisalmer"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 550px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Center: Content Block (Centered on mobile, left on desktop) */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full mx-auto lg:mx-0 max-w-xl lg:max-w-none">
            <span className="block text-center lg:text-left w-full font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold mb-2 sm:mb-3">
              DISCOVER THE REAL BEAUTY
            </span>

            <h2 className="block text-center lg:text-left w-full font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.9rem] font-bold text-teal leading-[1.16] tracking-tight mb-2.5 sm:mb-4">
              Feel the Magic<br />
              <span className="italic font-normal text-gold-dark inline-block mt-1 sm:mt-2">
                of the Thar Desert
              </span>
            </h2>

            <p className="block text-center lg:text-left w-full font-sans text-xs sm:text-sm md:text-base text-text-muted leading-relaxed mb-5 sm:mb-6 max-w-xl mx-auto lg:mx-0">
              Golden sands, starry skies and unforgettable moments await you in
              Jaisalmer. Let us create a memorable journey for your perfect
              desert getaway.
            </p>

            <button
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:py-3.5 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold transition-all duration-300 hover:from-gold hover:to-gold-dark hover:-translate-y-0.5 hover:shadow-lg w-fit mx-auto lg:mx-0 mb-6 lg:mb-0 group"
              onClick={onPlanTripClick}
            >
              <span>Plan Your Trip</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Right: Features (2-column grid on mobile/tablet, 1-col column on desktop) */}
          <div className="lg:col-span-3 xl:col-span-3 w-full">
            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2 sm:gap-3 pt-4 sm:pt-6 lg:pt-0 border-t border-border-light/80 lg:border-t-0 w-full max-w-md sm:max-w-none mx-auto lg:max-w-[260px] lg:ml-auto">
              {highlights.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-[5px] bg-white/90 backdrop-blur-sm border border-border-light transition-all duration-300 hover:bg-white hover:shadow-xs hover:border-gold/50 group"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cream flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors shrink-0">
                    {feat.icon}
                  </span>
                  <span className="font-sans text-[11px] sm:text-sm font-semibold text-text-main truncate">
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
