"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Play, Star } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import Lines from "@/components/Lines";

interface StorySectionProps {
  onVideoClick: () => void;
  onExploreClick: () => void;
}

export default function StorySection({ onVideoClick, onExploreClick }: StorySectionProps) {
  const { home } = useContent();
  return (
    <section id="about" className="relative py-10 sm:py-16 lg:py-20 scroll-mt-20 overflow-hidden">
      {/* Dreamy Desert Fort Sunrise Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={home.storyBackground}
          alt="Dreamy Desert Fort at Sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle light tint so scenery is fully vivid while text is perfectly legible */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />
      </div>

      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Text & Stats (Centered on Mobile, Left on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0 w-full max-w-xl lg:max-w-none">
            {/* Eyebrow */}
            <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-gold mb-2 sm:mb-3.5 block">
              {home.storyEyebrow}
            </span>
            
            {/* Main Section Heading */}
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem] font-bold text-teal !leading-[1.18] sm:!leading-[1.08] tracking-tight mb-3 sm:mb-5">
              <Lines text={home.storyHeading} />
            </h2>

            {/* Subtitle Description */}
            <p className="font-sans text-xs sm:text-base text-text-muted leading-relaxed max-w-lg mb-5 sm:mb-7 mx-auto lg:mx-0">
              {home.storyDescription}
            </p>

            {/* Explore Button */}
            <button 
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:py-3.5 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold transition-all duration-300 hover:from-gold hover:to-gold-dark hover:-translate-y-0.5 hover:shadow-lg w-fit mx-auto lg:mx-0 group" 
              onClick={onExploreClick}
            >
              <span>{home.storyButton}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Stats Row with vertical dividers */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8 mt-6 sm:mt-9 border-t border-border-light/90 w-full">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif text-xl sm:text-3xl font-bold text-teal leading-none">{home.stat1Value}</span>
                <span className="font-sans text-[10px] sm:text-xs text-text-muted mt-1 font-medium">{home.stat1Label}</span>
              </div>

              <div className="w-[1px] h-8 sm:h-10 bg-border-light shrink-0" />

              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif text-xl sm:text-3xl font-bold text-teal leading-none">{home.stat2Value}</span>
                <span className="font-sans text-[10px] sm:text-xs text-text-muted mt-1 font-medium">{home.stat2Label}</span>
              </div>

              <div className="w-[1px] h-8 sm:h-10 bg-border-light shrink-0" />

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 leading-none">
                  <span className="font-serif text-xl sm:text-3xl font-bold text-teal">{home.stat3Value}</span>
                  <Star size={15} className="fill-gold text-gold" />
                </div>
                <span className="font-sans text-[10px] sm:text-xs text-text-muted mt-1 font-medium">{home.stat3Label}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Overlapping Tilted Cards Cluster matching screenshot */}
          <div className="lg:col-span-7 xl:col-span-7 relative h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px] w-full max-w-[420px] lg:max-w-none mx-auto flex items-center justify-center mt-2 lg:mt-0">
            
            {/* Card 1: Large Main Card (Left) with Desert Dining & Play Button */}
            <div 
              className="absolute left-0 sm:left-2 top-2 sm:top-2 w-[54%] sm:w-[56%] h-[250px] sm:h-[340px] md:h-[390px] lg:h-[420px] rounded-[5px] overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.2)] border-[3px] sm:border-4 border-white rotate-[-2.5deg] hover:rotate-0 hover:scale-[1.02] hover:z-30 transition-all duration-500 cursor-pointer group z-10"
              onClick={onVideoClick}
            >
              <Image
                src={home.storyMainImage}
                alt="Desert Dining Under the Stars"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 768px) 55vw, 400px"
              />
              {/* Subtle cinematic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-75 transition-opacity" />

              {/* Text Label on Bottom Left */}
              <div className="absolute bottom-3 left-3 right-12 sm:bottom-4 sm:left-4 sm:right-16 z-10 text-left">
                <h4 className="font-serif text-xs sm:text-base md:text-lg font-bold text-white drop-shadow-md leading-tight">
                  <Lines text={home.storyMainCaption} />
                </h4>
              </div>

              {/* Circular Play Button on Bottom Right */}
              <div 
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-14 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-teal shadow-xl transition-all duration-300 group-hover:scale-115 group-hover:bg-gold group-hover:text-white z-10" 
                title="Play Video Preview"
              >
                <Play size={16} className="fill-current ml-0.5 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Card 2: Top Right Card (Luxury Camps) */}
            <div className="absolute right-0 sm:right-2 top-0 sm:top-1 w-[43%] sm:w-[44%] h-[120px] sm:h-[165px] md:h-[190px] lg:h-[220px] rounded-[5px] overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.18)] border-[3px] sm:border-4 border-white rotate-[2.5deg] hover:rotate-0 hover:scale-[1.03] hover:z-30 transition-all duration-500 cursor-pointer group z-20">
              <Image
                src={home.storyTopImage}
                alt="Luxury Camps in Jaisalmer"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 768px) 45vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-10 text-left">
                <h4 className="font-serif text-[11px] sm:text-sm md:text-base font-bold text-white drop-shadow-md">
                  {home.storyTopCaption}
                </h4>
              </div>
            </div>

            {/* Card 3: Bottom Right Card (Camel Safari) */}
            <div className="absolute right-0 sm:right-2 bottom-1 sm:bottom-3 w-[43%] sm:w-[44%] h-[120px] sm:h-[165px] md:h-[190px] lg:h-[220px] rounded-[5px] overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.18)] border-[3px] sm:border-4 border-white rotate-[3.5deg] hover:rotate-0 hover:scale-[1.03] hover:z-30 transition-all duration-500 cursor-pointer group z-20">
              <Image
                src={home.storyBottomImage}
                alt="Camel Safari in Thar Desert"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 768px) 45vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-10 text-left">
                <h4 className="font-serif text-[11px] sm:text-sm md:text-base font-bold text-white drop-shadow-md">
                  {home.storyBottomCaption}
                </h4>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
