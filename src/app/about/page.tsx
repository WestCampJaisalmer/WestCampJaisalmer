"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Leaf, 
  Heart, 
  Sparkles, 
  Gem,
  ArrowRight
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";
import BookingModal from "@/components/BookingModal";

export default function AboutPage() {
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#1F2022] antialiased">
      {/* Top Navigation */}
      <Navbar
        onPlanTripClick={() => setIsPlanTripOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* ========================================================= */}
      {/* SECTION 1: HERO - Our Story Begins in Jaisalmer (bg1.webp) */}
      {/* ========================================================= */}
      <section className="relative pt-28 sm:pt-28 md:pt-28 lg:pt-28 pb-8 sm:pb-9 md:pb-10 lg:pb-10 overflow-hidden border-b border-[#EBDCC8]/80 bg-[#FAF6F0]">
        {/* Panoramic Background Image: bg1.webp */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/about/bg1.webp"
            alt="Our Story Begins in Jaisalmer - Golden Fort at Sunset with royal terrace"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-top sm:object-right"
          />
          {/* Subtle soft gradient overlay on the left so typography is crystal clear across all devices */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 to-transparent sm:via-[#FAF6F0]/75 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#FAF6F0]/85 sm:hidden pointer-events-none" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-xl lg:max-w-2xl flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
            {/* Breadcrumbs matching other subpages */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-2 text-[#8C765E]">
              <Link href="/" className="hover:text-gold transition-colors">
                HOME
              </Link>
              <span className="text-[#C68339] font-bold">›</span>
              <span className="text-[#C68339] font-bold">ABOUT US</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-3 sm:mb-3.5">
              Our Story Begins in<br />
              Jaisalmer
            </h1>

            {/* Intro Paragraph */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-lg leading-relaxed font-normal">
              We are passionate about showcasing the magic of Jaisalmer — its golden forts, vast deserts, rich culture and unforgettable experiences.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: WHO WE ARE - Share the Beauty of Jaisalmer     */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF6F0] border-b border-[#EBDCC8]/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          {/* Header (Centered) */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#B07129]">
                WHO WE ARE
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-[2.65rem] font-bold text-[#123038] tracking-tight mb-3 sm:mb-4">
              Share the Beauty of Jaisalmer
            </h2>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#6C6962] leading-relaxed max-w-2xl mx-auto">
              We are a team of travel enthusiasts, local experts and storytellers who believe that Jaisalmer is not just a destination, but an emotion. Our mission is to create meaningful travel experiences that connect you with the real Rajasthan.
            </p>
          </div>

          {/* 4 Feature Pillars Grid with Vertical Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 lg:gap-0">
            {/* Feature 1: Local Expertise */}
            <div className="flex flex-col items-center text-center px-4 lg:px-6 xl:px-8 lg:border-r border-[#E9DFD1]">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-2xs border border-[#ECDDC7]">
                {/* Traditional Fort / Palace Silhouette */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l3-3 3 3v14" />
                  <path d="M19 21V11l-3-3-3 3v10" />
                  <path d="M9 9h2" />
                  <path d="M9 13h2" />
                  <path d="M9 17h2" />
                  <path d="M15 13h2" />
                  <path d="M15 17h2" />
                </svg>
              </div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#142B36] mb-1.5 sm:mb-2">
                Local Expertise
              </h3>
              <p className="font-sans text-xs text-[#7A7670] leading-relaxed max-w-[220px]">
                Deep knowledge of Jaisalmer&apos;s hidden gems and authentic experiences.
              </p>
            </div>

            {/* Feature 2: Personalized Trips */}
            <div className="flex flex-col items-center text-center px-4 lg:px-6 xl:px-8 lg:border-r border-[#E9DFD1]">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-2xs border border-[#ECDDC7]">
                <Users size={26} className="stroke-[1.8]" />
              </div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#142B36] mb-1.5 sm:mb-2">
                Personalized Trips
              </h3>
              <p className="font-sans text-xs text-[#7A7670] leading-relaxed max-w-[220px]">
                Tailor-made itineraries for every traveler, from solo to groups.
              </p>
            </div>

            {/* Feature 3: Safe & Reliable */}
            <div className="flex flex-col items-center text-center px-4 lg:px-6 xl:px-8 lg:border-r border-[#E9DFD1]">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-2xs border border-[#ECDDC7]">
                <ShieldCheck size={28} className="stroke-[1.8]" />
              </div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#142B36] mb-1.5 sm:mb-2">
                Safe &amp; Reliable
              </h3>
              <p className="font-sans text-xs text-[#7A7670] leading-relaxed max-w-[220px]">
                Your safety and comfort are always our top priority.
              </p>
            </div>

            {/* Feature 4: Sustainable Tourism */}
            <div className="flex flex-col items-center text-center px-4 lg:px-6 xl:px-8">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-2xs border border-[#ECDDC7]">
                <Leaf size={26} className="stroke-[1.8]" />
              </div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#142B36] mb-1.5 sm:mb-2">
                Sustainable Tourism
              </h3>
              <p className="font-sans text-xs text-[#7A7670] leading-relaxed max-w-[220px]">
                We support local communities and promote responsible travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: OUR MISSION (img.webp)                         */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-10 lg:py-5 bg-[#FAF6F0] relative overflow-hidden border-b border-[#EBDCC8]/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            
            {/* Left: Torn Watercolor Brush Stroke Artwork Image: img.webp */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center">
              <div className="relative w-full max-w-lg lg:max-w-none h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px]">
                <Image
                  src="/images/about/img.webp"
                  alt="Traditional traveler enjoying sunset over Thar desert sand dunes and Jaisalmer Fort"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right: Mission Editorial Content */}
            <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#B07129]">
                  OUR MISSION
                </span>
                <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
              </div>

              {/* Main Heading */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-[2.65rem] font-bold text-[#123038] tracking-tight leading-[1.15] mb-4 sm:mb-5">
                Creating Unforgettable<br />
                Rajasthan Experiences
              </h2>

              {/* Mission Statement */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-[#63615C] leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Our mission is to make your journey to Jaisalmer simple, meaningful and memorable. We aim to offer authentic desert experiences, comfortable stays, cultural encounters and personalized travel support.
              </p>

              {/* 3 Core Value Badges Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-6 pt-2 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
                {/* 1. Authentic Experiences */}
                <div className="flex items-center gap-3 text-left bg-[#F4E8D8]/50 sm:bg-transparent px-3.5 py-2.5 sm:p-0 rounded-lg sm:rounded-none border border-[#ECDDC7]/70 sm:border-0">
                  <div className="text-[#B07129] shrink-0">
                    <Gem size={20} className="stroke-[2.2]" />
                  </div>
                  <span className="font-sans text-xs sm:text-xs lg:text-sm font-bold text-[#142B36] leading-snug">
                    Authentic<br className="hidden sm:inline" /> Experiences
                  </span>
                </div>

                {/* 2. Memorable Journeys */}
                <div className="flex items-center gap-3 text-left bg-[#F4E8D8]/50 sm:bg-transparent px-3.5 py-2.5 sm:p-0 rounded-lg sm:rounded-none border border-[#ECDDC7]/70 sm:border-0">
                  <div className="text-[#B07129] shrink-0">
                    <Heart size={20} className="fill-[#B07129] stroke-none" />
                  </div>
                  <span className="font-sans text-xs sm:text-xs lg:text-sm font-bold text-[#142B36] leading-snug">
                    Memorable<br className="hidden sm:inline" /> Journeys
                  </span>
                </div>

                {/* 3. Support Local Communities */}
                <div className="flex items-center gap-3 text-left bg-[#F4E8D8]/50 sm:bg-transparent px-3.5 py-2.5 sm:p-0 rounded-lg sm:rounded-none border border-[#ECDDC7]/70 sm:border-0">
                  <div className="text-[#B07129] shrink-0">
                    <Users size={20} className="stroke-[2.2]" />
                  </div>
                  <span className="font-sans text-xs sm:text-xs lg:text-sm font-bold text-[#142B36] leading-snug">
                    Support<br className="hidden sm:inline" /> Local Communities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: OUR VISION - Camel Caravan Banner (bg3.webp)   */}
      {/* ========================================================= */}
      <section className="relative min-h-[260px] sm:min-h-[280px] md:min-h-[300px] lg:min-h-[320px] flex flex-col justify-start pt-6 sm:pt-8 md:pt-8 lg:pt-9 pb-12 sm:pb-14 md:pb-16 lg:pb-16 overflow-hidden">
        {/* Full-width Panoramic Background Image: bg3.webp */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/about/bg3.webp"
            alt="Camel caravan walking across Thar sand dunes in Jaisalmer at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />
          {/* Subtle soft gradient at top so text has pristine contrast while dunes & camels stay crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/85 via-[#FAF6F0]/40 to-transparent pointer-events-none h-40 sm:h-48" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="max-w-3xl flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#B07129]">
                OUR VISION
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Vision Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-[#123038] tracking-tight !leading-[1.16] mb-2.5">
              To Be the Most Trusted Travel Companion<br className="hidden sm:inline" />
              for Exploring Jaisalmer
            </h2>

            {/* Vision Description */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-white max-w-2xl font-normal leading-relaxed mx-auto md:mx-0">
              We envision a future where every traveler discovers the true spirit of Rajasthan through our curated stays, desert adventures and cultural experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Unified Site Footer */}
      <Footer />

      {/* Plan Trip Modal */}
      <PlanTripModal
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />

      {/* Search Modal */}
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchParams={{ destination: "all" }}
        onSelectItem={(item, type) => {
          setIsSearchModalOpen(false);
          setSelectedItem(item);
          setSelectedType(type);
          setIsBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      {selectedItem && (
        <BookingModal
          item={selectedItem}
          type={selectedType}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
