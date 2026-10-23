"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProps from "@/components/ValueProps";
import StorySection from "@/components/StorySection";
import ExperienceBanner from "@/components/ExperienceBanner";
import HotelsSection from "@/components/HotelsSection";
import CampsSection from "@/components/CampsSection";
import ToursSection from "@/components/ToursSection";
import TharMagicSection from "@/components/TharMagicSection";
import DestinationsSection from "@/components/DestinationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

// Modals
import PlanTripModal from "@/components/PlanTripModal";
import BookingModal from "@/components/BookingModal";
import VideoModal from "@/components/VideoModal";
import SearchResultsModal from "@/components/SearchResultsModal";

import { Hotel, Camp, Tour, Destination } from "@/data/jaisalmerData";

export default function Home() {
  const router = useRouter();
  // Modal states
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);

  // Selected item for booking/detail modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"hotel" | "camp" | "tour" | "destination" | "package" | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handlers
  const handleOpenSearchWithParams = (params: any) => {
    setSearchParams(params);
    setIsSearchModalOpen(true);
  };

  const handleOpenBooking = (item: any, type: "hotel" | "camp" | "tour" | "destination" | "package") => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsBookingModalOpen(true);
  };

  const handleBookDiningFromVideo = () => {
    setIsVideoModalOpen(false);
    setIsPlanTripOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#fbf8f2] font-sans text-[#1f2022]">
      {/* Top Navigation */}
      <Navbar
        onPlanTripClick={() => setIsPlanTripOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Hero Section with Search Card */}
      <HeroSection onSearch={handleOpenSearchWithParams} />

      {/* Value Propositions */}
      <div className="reveal-on-scroll">
        <ValueProps />
      </div>

      {/* Experience Jaisalmer / Story Section */}
      <div className="reveal-on-scroll">
        <StorySection
          onVideoClick={() => setIsVideoModalOpen(true)}
          onExploreClick={() => handleScrollToSection("destinations")}
        />
      </div>

      {/* Choose Your Perfect Experience Banner */}
      <div className="reveal-on-scroll">
        <ExperienceBanner
          onSelectCategory={(category) => handleScrollToSection(category)}
        />
      </div>

      {/* Featured Hotels */}
      <div className="reveal-on-scroll">
        <HotelsSection
          onSelectHotel={(hotel: Hotel) => handleOpenBooking(hotel, "hotel")}
          onViewAll={() => router.push("/camps-hotels?type=hotels")}
        />
      </div>

      {/* Desert Camps */}
      <div className="reveal-on-scroll">
        <CampsSection
          onSelectCamp={(camp: Camp) => handleOpenBooking(camp, "camp")}
          onViewAll={() => router.push("/camps-hotels?type=camps")}
        />
      </div>

      {/* Popular Tours & Activities */}
      <div className="reveal-on-scroll">
        <ToursSection
          onSelectTour={(tour: Tour) => handleOpenBooking(tour, "tour")}
          onViewAll={() => router.push("/tours-places?type=tours")}
        />
      </div>

      {/* Feel the Magic of Thar Desert Section */}
      <div className="reveal-on-scroll">
        <TharMagicSection onPlanTripClick={() => setIsPlanTripOpen(true)} />
      </div>

      {/* Top Destinations */}
      <div id="destinations" className="reveal-on-scroll">
        <DestinationsSection
          onSelectDestination={(dest: Destination) => handleOpenBooking(dest, "destination")}
          onViewAll={() => router.push("/tours-places?type=places")}
        />
      </div>

      {/* Testimonials */}
      <div className="reveal-on-scroll">
        <TestimonialsSection />
      </div>

      {/* Call to Action Banner */}
      <div className="reveal-on-scroll">
        <CtaBanner 
          onQuoteClick={() => setIsPlanTripOpen(true)} 
          onVideoClick={() => setIsVideoModalOpen(true)}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <PlanTripModal
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />

      <BookingModal
        item={selectedItem}
        type={selectedType}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onBookDining={handleBookDiningFromVideo}
      />

      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchParams={searchParams}
        onSelectItem={(item, type) => handleOpenBooking(item, type)}
      />

    </main>
  );
}
