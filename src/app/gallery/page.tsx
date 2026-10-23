"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  Calendar,
  Compass,
  Tent
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";

import type { GalleryImage } from "@/data/galleryData";
import { useContent } from "@/context/ContentContext";
import { getWhatsAppUrl, openWhatsApp } from "@/utils/whatsapp";
import { recordEnquiry } from "@/utils/enquiry";

function GalleryContent() {
  const { galleryImages, galleryCategories } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Modals state
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Filter images based on selected category
  const filteredImages = galleryImages.filter((img) => {
    if (activeCategory === "all") return true;
    return img.category === activeCategory;
  });

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev === 0 ? filteredImages.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev === filteredImages.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  const activePhoto: GalleryImage | null = 
    lightboxIndex !== null && filteredImages[lightboxIndex] 
      ? filteredImages[lightboxIndex] 
      : null;

  const handleWhatsAppPhotoInquiry = (photo: GalleryImage) => {
    const message = `📸 *GALLERY PHOTO INQUIRY - WEST CAMP JAISALMER* 📸
    
✨ *Photo:* ${photo.title}
📍 *Location:* ${photo.location}
🏷️ *Category:* ${photo.categoryLabel}

_Hello! I saw this photo in your website gallery and would love to experience this during my Jaisalmer trip. Please share package details and pricing._`;

    recordEnquiry({
      type: "gallery",
      name: "Gallery visitor",
      subject: "Photo enquiry",
      itemType: "gallery",
      itemId: photo.id,
      itemName: photo.title,
      details: { location: photo.location, category: photo.categoryLabel },
    });
    openWhatsApp(message);
  };

  const handleBookFromGallery = (photo: GalleryImage) => {
    setLightboxIndex(null);
    setSelectedBookingItem({
      id: photo.id,
      name: photo.title,
      location: photo.location,
      price: photo.category === "camps" ? 4499 : photo.category === "safari" ? 1800 : 3500,
      image: photo.src,
      description: `Experience ${photo.title} with private transfers, experienced desert guide, and all-inclusive hospitality.`,
      amenities: ["Desert Guide Included", "AC Vehicle Transfers", "Photography Support", "Instant WhatsApp Confirmation"],
    });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#1F2022] antialiased">
      {/* Top Navigation */}
      <Navbar
        onPlanTripClick={() => setIsPlanTripOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-30 md:pt-32 pb-8 sm:pb-12 lg:pb-16 overflow-hidden border-b border-[#EBDCC8]/80 bg-[#123038]">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/banners/Dreamy_Desert_Fort_at_Sunrise.png"
            alt="Moments in the Golden Desert - West Camp Jaisalmer Photo Gallery"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-top sm:object-right"
          />
          {/* Balanced atmospheric gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 to-transparent sm:via-[#FAF6F0]/75 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#FAF6F0]/85 sm:hidden pointer-events-none" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-2 text-[#8C765E]">
              <Link href="/" className="hover:text-gold transition-colors">
                HOME
              </Link>
              <span className="text-gold-light font-bold">›</span>
              <span className="text-gold font-bold">PHOTO GALLERY</span>
            </div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#AF6E26]">
                THE GOLDEN CITY VISUAL ARCHIVE
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-3 sm:mb-3.5">
              Moments in the Golden Desert
            </h1>

            {/* Subtitle */}
            <p className="font-sans mb-2 text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-3xl leading-relaxed font-normal">
              Immerse yourself in 40+ authentic snapshots of luxury Swiss desert camps, sun-drenched Thar sand dunes, thrilling 4x4 safaris, and centuries of royal Rajasthani heritage.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-1 w-full max-w-md sm:max-w-none mt-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Camera size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">40+ Curated Photos</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Tent size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Luxury Swiss Camps</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Compass size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Thar Dune Safaris</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <ShieldCheck size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Living Royal Fort</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Interactive Category Filter Bar */}
      <section className="sticky top-[90px] sm:top-[65px] z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DEC9] py-2 sm:py-2.5 shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {/* Category Segmented Switcher */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 bg-[#EBE2D0] rounded-lg border border-[#DECDB3] shadow-2xs shrink-0">
              {galleryCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = 
                  cat.id === "all" 
                    ? galleryImages.length 
                    : galleryImages.filter((img) => img.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-md font-sans text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#C97F2C] text-white shadow-xs"
                        : "text-[#123038] hover:text-[#C97F2C] hover:bg-[#FAF6F0]/80"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span 
                      className={`text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive 
                          ? "bg-white/25 text-white" 
                          : "bg-[#DECDB3] text-[#123038]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Total count badge on desktop */}
            <span className="hidden md:block font-sans text-xs text-[#7D776E] shrink-0 font-medium">
              Showing <strong className="text-[#123038]">{filteredImages.length}</strong> photos
            </span>
          </div>
        </div>
      </section>

      {/* Main Responsive Gallery Grid */}
      <main className="max-w-[1360px] mx-auto px-3 sm:px-6 py-6 sm:py-10 flex-1 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredImages.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#EAE3D4] border border-[#E8DEC9] shadow-xs hover:shadow-card hover:-translate-y-1 hover:border-[#C97F2C]/70 transition-all duration-300 cursor-pointer flex flex-col justify-end"
            >
              {/* Photo Image */}
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                priority={index < 8}
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

              {/* Top Badge: Category */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold uppercase tracking-wider bg-black/55 backdrop-blur-md text-[#F4E9D8] border border-white/20 shadow-xs">
                  {photo.categoryLabel}
                </span>
              </div>

              {/* Top Right: Fullscreen Hover Icon */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-105 transition-transform">
                  <Maximize2 size={14} />
                </div>
              </div>

              {/* Bottom Info: Location & View Action */}
              <div className="relative z-10 p-3 sm:p-3.5 text-white flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-[#E8DCC9]">
                  <p className="flex items-center gap-1.5 font-sans text-xs text-white/90 drop-shadow-sm truncate">
                    <MapPin size={12} className="text-[#DF9745] shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </p>
                  <span className="text-[#DF9745] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0 ml-2">
                    <span>View</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <section className="mt-12 sm:mt-16 bg-[#123038] text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-[#234F5C] shadow-lg">
          <div className="relative z-10 max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#DF9745] mb-2">
              EXPERIENCE JAISALMER LIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Love What You See? Let Us Host Your Desert Journey.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed max-w-2xl mb-6">
              From luxury Swiss tents with folk dance evenings to private fort haveli stays and custom sunrise camel rides, our local team crafts unforgettable Rajasthan holidays.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPlanTripOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C97F2C] hover:bg-[#AF6E26] text-white font-sans text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Plan Custom Tour</span>
              </button>

              <a
                href="https://wa.me/917877221729?text=Hello!%20I%20am%20exploring%20your%20photo%20gallery%20and%20want%20to%20plan%20a%20trip%20to%20Jaisalmer."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp (+91 78772 21729)</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Full-screen Lightbox Modal */}
      {activePhoto && lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar: Counter & Close Button */}
          <div 
            className="flex items-center justify-between w-full max-w-6xl mx-auto text-white z-20 shrink-0 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs sm:text-sm font-bold tracking-wider text-[#DF9745]">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
              <span className="text-white/40">•</span>
              <span className="font-sans text-xs sm:text-sm text-white/80 hidden sm:inline">
                {activePhoto.categoryLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Stage: Image and Left/Right Nav */}
          <div 
            className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-auto overflow-hidden py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => 
                prev !== null ? (prev === 0 ? filteredImages.length - 1 : prev - 1) : null
              )}
              aria-label="Previous Photo"
              className="absolute left-1 sm:left-3 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Lightbox Image (Visibly Rounded Corners) */}
            <div className="relative flex items-center justify-center max-w-full my-auto z-20">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="max-h-[58vh] sm:max-h-[66vh] md:max-h-[70vh] w-auto max-w-[90vw] sm:max-w-4xl object-contain rounded-[10px] shadow-2xl border border-white/15"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => 
                prev !== null ? (prev === filteredImages.length - 1 ? 0 : prev + 1) : null
              )}
              aria-label="Next Photo"
              className="absolute right-1 sm:right-3 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Caption Bar with Quick Actions */}
          <div 
            className="w-full max-w-6xl mx-auto bg-black/60 border border-white/15 rounded-xl p-3.5 sm:p-4 text-white flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col text-center md:text-left">
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                {activePhoto.title}
              </h4>
              <p className="flex items-center justify-center md:justify-start gap-1.5 font-sans text-xs text-[#DF9745] mt-0.5">
                <MapPin size={13} className="shrink-0" />
                <span>{activePhoto.location}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">{activePhoto.categoryLabel}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
              <button
                type="button"
                onClick={() => handleWhatsAppPhotoInquiry(activePhoto)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => handleBookFromGallery(activePhoto)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-lg bg-[#C97F2C] hover:bg-[#AF6E26] text-white font-sans text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Book This</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Site Footer */}
      <Footer />

      {/* Plan Trip Modal for Custom Inquiry */}
      <PlanTripModal
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />

      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchParams={{ destination: "all" }}
        onSelectItem={(item, type) => {
          setIsSearchModalOpen(false);
          setSelectedBookingItem(item);
          setIsBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      {selectedBookingItem && (
        <BookingModal
          item={selectedBookingItem}
          type="camp"
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedBookingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
