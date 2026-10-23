"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, Tent, Luggage, Plus } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import Lines from "@/components/Lines";

interface ExperienceBannerProps {
  onSelectCategory: (category: string) => void;
}

export default function ExperienceBanner({ onSelectCategory }: ExperienceBannerProps) {
  const { home } = useContent();
  const experiences = [
    {
      id: "hotels",
      title: "Hotels",
      desc: "Heritage stays in historic surroundings.",
      icon: BedDouble,
      image: home.experienceHotelsImage,
      link: "/camps-hotels?type=hotels",
    },
    {
      id: "camps",
      title: "Camps",
      desc: "Luxury desert camps in the heart of desert.",
      icon: Tent,
      image: home.experienceCampsImage,
      link: "/camps-hotels?type=camps",
    },
    {
      id: "tours",
      title: "Tours & Activities",
      desc: "Fort, culture, adventure and local experiences.",
      icon: Luggage,
      image: home.experienceToursImage,
      link: "/#tours",
    },
  ];

  return (
    <section id="experiences" className="relative py-12 sm:py-16 lg:py-24 text-white overflow-hidden scroll-mt-20">
      {/* Foliage Banner Background Image with Rich Teal Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={home.experienceBackground}
          alt="Foliage Pattern Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="max-w-[1350px] mx-auto px-3 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle & Action (Centered on mobile, left on desktop) */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full mx-auto lg:mx-0">
            <span className="block text-center lg:text-left w-full font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold-light mb-2.5 sm:mb-3">
              {home.experienceEyebrow}
            </span>

            <h2 className="block text-center sm:pb-0 pb-6 lg:text-left w-full font-serif text-2xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem] font-bold text-black !leading-[1.15] sm:mb-4 tracking-tight drop-shadow-sm lg:text-white ">
              <Lines text={home.experienceHeading} />
            </h2>

            <p className="block text-center lg:text-left w-full font-sans text-xs sm:text-base text-white/85 leading-relaxed mb-6 sm:mb-7 max-w-md mx-auto lg:mx-0 lg:mt-0 pt-8">
              {home.experienceDescription}
            </p>

            <Link 
              href="/camps-hotels" 
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-[5px] bg-[#C97F2C] hover:bg-[#AD671D] text-white font-sans font-semibold text-xs sm:text-sm shadow-gold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg w-fit mx-auto lg:mx-0 group"
            >
              <span>Explore Camps &amp; Hotels</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column: 3 Experience Cards */}
          <div className="lg:col-span-8 xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pt-2 lg:pt-0 max-w-md sm:max-w-none mx-auto w-full">
            {experiences.map((item) => {
              const IconComponent = item.icon;

              return (
                <Link 
                  href={item.link} 
                  key={item.id} 
                  className="group relative rounded-[5px] border border-white/25 bg-[#072027]/75 backdrop-blur-md overflow-hidden sm:overflow-visible shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 flex flex-col cursor-pointer"
                  onClick={(e) => {
                    if (item.link.startsWith("#") || item.link.startsWith("/#")) {
                      onSelectCategory(item.id);
                    }
                  }}
                >
                  {/* Top Photo Frame */}
                  <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-t-[5px] overflow-hidden bg-black/40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#072027]/95 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Bottom Content Frame */}
                  <div className="p-4 flex items-center gap-3 relative rounded-b-[5px]">
                    {/* Round Gold Icon Badge */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#C97F2C] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:bg-[#AD671D] transition-all">
                      <IconComponent size={20} className="stroke-[2.2]" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 pr-6 sm:pr-2">
                      <h4 className="font-sans font-bold text-sm sm:text-base text-white group-hover:text-gold-light transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="font-sans text-[11px] sm:text-xs text-white/75 mt-0.5 line-clamp-2 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    {/* Round Plus Button */}
                    <div className="absolute bottom-3 right-3 sm:-bottom-2.5 sm:-right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DF9745] group-hover:bg-[#C97F2C] text-white flex items-center justify-center shadow-lg border-2 border-[#0B252E] group-hover:scale-110 transition-transform">
                      <Plus size={14} className="stroke-[3]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
