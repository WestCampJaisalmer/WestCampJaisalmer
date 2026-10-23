"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Building2, 
  Tent, 
  Star, 
  Heart, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Coffee, 
  Wifi, 
  Flame, 
  Compass, 
  Phone, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  X
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";

import { hotelsData, campsData, Hotel, Camp } from "@/data/jaisalmerData";
import { useCurrency } from "@/context/CurrencyContext";

export interface StayItem {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  type: "hotel" | "camp";
  tag?: string;
}

function CampsHotelsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get("type") || searchParams?.get("tab") || "all";

  const { formatPrice } = useCurrency();

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<"all" | "hotel" | "camp">(
    initialType === "hotels" || initialType === "hotel"
      ? "hotel"
      : initialType === "camps" || initialType === "camp"
      ? "camp"
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price-asc" | "price-desc">("recommended");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modals state
  const [selectedItem, setSelectedItem] = useState<StayItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Combine data with category tag
  const allStays: StayItem[] = useMemo(() => {
    const hotels: StayItem[] = hotelsData.map((h) => ({
      ...h,
      type: "hotel",
      tag: h.tag || "Heritage Stay",
    }));
    const camps: StayItem[] = campsData.map((c) => ({
      ...c,
      type: "camp",
      tag: c.tag || "Desert Glamping",
    }));
    return [...hotels, ...camps];
  }, []);

  // Filter and sort items
  const filteredStays = useMemo(() => {
    return allStays
      .filter((stay) => {
        // Tab filter
        if (activeTab === "hotel" && stay.type !== "hotel") return false;
        if (activeTab === "camp" && stay.type !== "camp") return false;

        // Search text filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = stay.name.toLowerCase().includes(q);
          const matchLocation = stay.location.toLowerCase().includes(q);
          const matchDesc = stay.description.toLowerCase().includes(q);
          const matchAmenity = stay.amenities.some((a) => a.toLowerCase().includes(q));
          if (!matchName && !matchLocation && !matchDesc && !matchAmenity) return false;
        }

        // Price range filter
        if (priceFilter === "budget" && stay.price > 2999) return false;
        if (priceFilter === "mid" && (stay.price < 3000 || stay.price > 3500)) return false;
        if (priceFilter === "luxury" && stay.price < 3501) return false;

        // Amenity filter
        if (selectedAmenity !== "all") {
          const matchAmenity = stay.amenities.some((a) =>
            a.toLowerCase().includes(selectedAmenity.toLowerCase())
          );
          if (!matchAmenity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // recommended order
      });
  }, [allStays, activeTab, searchQuery, priceFilter, sortBy, selectedAmenity]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenBooking = (stay: StayItem) => {
    setSelectedItem(stay);
    setIsBookingOpen(true);
  };

  const faqs = [
    {
      q: "How far are the desert camps located from Jaisalmer Fort / City?",
      a: "Most of our luxury desert camps are located in the Sam Sand Dunes and Khuri Dunes, which are approximately 38 to 42 km (about a 45-minute scenic drive) from Jaisalmer City Center. Free or arranged transfers can be coordinated upon request.",
    },
    {
      q: "Do the desert camps have attached bathrooms and electricity?",
      a: "Yes! All Swiss cottage tents and luxury desert camps in our collection feature modern attached western bathrooms, running hot water, fresh linens, air conditioning/heating units, and 24/7 generator power backup.",
    },
    {
      q: "Can I do a combo booking: 1 Night Heritage Haveli + 1 Night Desert Camp?",
      a: "Yes! In fact, more than 80% of our travelers choose the classic '1 Night Haveli + 1 Night Camp' combination. Our local concierge will handle luggage transfer, private car pickup, and unified billing seamlessly.",
    },
    {
      q: "What activities are included in a Desert Camp stay?",
      a: "A typical desert camp package includes a sunset camel safari into the dunes, a traditional Rajasthani welcome with dhol and tikka, evening bonfire with live Kalbelia folk dance and Manganiyar songs, and a lavish royal buffet dinner.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#1F2022] antialiased">
      {/* Top Navigation */}
      <Navbar
        onPlanTripClick={() => setIsPlanTripOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-30 md:pt-32 pb-8 sm:pb-12 lg:pb-16 overflow-hidden border-b border-[#EBDCC8]/80 bg-[#123038]">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/banners/hero-fort.jpg"
            alt="Jaisalmer Heritage Fort and Desert Camps at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          {/* Atmospheric Dark Gradient for Maximum Typography Readability */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 to-transparent sm:via-[#FAF6F0]/75 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#FAF6F0]/85 sm:hidden pointer-events-none" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 text-white">
          <div className="max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-2 text-[#8C765E]">
              <Link href="/" className="hover:text-gold transition-colors">
                HOME
              </Link>
              <span className="text-gold-light font-bold">›</span>
              <span className="text-gold-light font-bold">CAMPS &amp; HOTELS</span>
            </div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
                CURATED JAISALMER STAYS
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-3 sm:mb-3.5">
              Camps &amp; Hotels in Jaisalmer
            </h1>

            {/* Subtitle */}
            <p className="font-sans mb-2 text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-3xl leading-relaxed font-normal">
              Experience the royal legacy of Rajasthan in authentic 18th-century yellow sandstone palaces, or immerse under starlit Thar desert skies in private Swiss glamping cottages.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-1 w-full max-w-md sm:max-w-none">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Building2 size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Heritage Havelis</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Tent size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Swiss Glamping</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <ShieldCheck size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Best Price</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Sparkles size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">24/7 Concierge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Filter Bar */}
      <section className="sticky top-[90px] sm:top-[60px] z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DEC9] py-2 sm:py-2.5 shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-8 py-2">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-1.5 sm:gap-3">
            
            {/* Left: Category Segmented Switcher (Equal 3 columns on mobile) */}
            <div className="grid grid-cols-3 w-full lg:w-auto p-0.5 sm:p-1 bg-[#EBE2D0] rounded-lg border border-[#DECDB3] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex items-center justify-center text-center px-2 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer truncate ${
                  activeTab === "all"
                    ? "bg-white text-[#123038] shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                All ({allStays.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hotel")}
                className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer truncate ${
                  activeTab === "hotel"
                    ? "bg-[#C97F2C] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Building2 size={12} className="shrink-0" />
                <span className="truncate">Hotels ({hotelsData.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("camp")}
                className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer truncate ${
                  activeTab === "camp"
                    ? "bg-[#123038] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Tent size={12} className="shrink-0" />
                <span className="truncate">Camps ({campsData.length})</span>
              </button>
            </div>

            {/* Right: Quick Search Input & Filters in ONE compact row */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 lg:justify-end w-full lg:w-auto">
              {/* Search input */}
              <div className="relative flex-1 min-w-[120px] sm:max-w-xs">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8F8A80]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, location..."
                  className="w-full h-8 sm:h-9 pl-7 pr-6 bg-white border border-[#DECDB3] rounded-lg text-[11px] sm:text-xs text-[#1F2022] placeholder:text-[#A19C91] focus:outline-none focus:border-[#C97F2C] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8F8A80] hover:text-[#1F2022]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Price Filter Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  aria-label="Filter stays by price range"
                  className="h-8 sm:h-9 pl-2 sm:pl-2.5 pr-5 sm:pr-6 bg-white border border-[#DECDB3] rounded-lg text-[11px] sm:text-xs font-semibold text-[#1F2022] appearance-none focus:outline-none focus:border-[#C97F2C] shadow-2xs cursor-pointer truncate"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">&lt; ₹3,000</option>
                  <option value="mid">₹3k - 3.5k</option>
                  <option value="luxury">₹3.5k+ Luxury</option>
                </select>
                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8F8A80] pointer-events-none" />
              </div>

              {/* Sort By Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort stays by rating or price"
                  className="h-8 sm:h-9 pl-2 sm:pl-2.5 pr-5 sm:pr-6 bg-white border border-[#DECDB3] rounded-lg text-[11px] sm:text-xs font-semibold text-[#1F2022] appearance-none focus:outline-none focus:border-[#C97F2C] shadow-2xs cursor-pointer truncate"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low-High</option>
                  <option value="price-desc">Price: High-Low</option>
                </select>
                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8F8A80] pointer-events-none" />
              </div>

              {/* Reset filter button if active */}
              {(searchQuery || priceFilter !== "all" || sortBy !== "recommended" || selectedAmenity !== "all" || activeTab !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                    setPriceFilter("all");
                    setSortBy("recommended");
                    setSelectedAmenity("all");
                  }}
                  className="text-[10.5px] sm:text-xs font-bold text-[#B07129] hover:underline px-1 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Amenity Chips */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pt-[15px] pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#8A8478] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles size={11} className="text-[#B07129]" />
              Popular:
            </span>
            {[
              { label: "All Amenities", value: "all" },
              { label: "Swimming Pool", value: "Pool" },
              { label: "Free Breakfast", value: "Breakfast" },
              { label: "AC / Heating", value: "AC" },
              { label: "Camel Ride", value: "Camel" },
              { label: "Folk Dance & Music", value: "Folk" },
              { label: "Dune View", value: "Dune" },
              { label: "Wi-Fi", value: "Wi-Fi" },
            ].map((chip) => {
              const isSelected = selectedAmenity === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setSelectedAmenity(chip.value)}
                  className={`text-[10.5px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full font-medium shrink-0 transition-colors border cursor-pointer ${
                    isSelected
                      ? "bg-[#123038] text-white border-[#123038] shadow-2xs font-semibold"
                      : "bg-white text-[#57534D] border-[#DECDB3] hover:border-[#B07129] hover:text-[#123038]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
        
        {/* Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
          <div>
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#B07129] block mb-1">
              AVAILABLE PROPERTIES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#123038] tracking-tight">
              {activeTab === "all" ? "All Accommodations" : activeTab === "hotel" ? "Heritage Hotels" : "Desert Camps"} ({filteredStays.length})
            </h2>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#6E685E]">
            Showing verified authentic stays in Jaisalmer
          </p>
        </div>

        {/* Empty State */}
        {filteredStays.length === 0 ? (
          <div className="bg-white border border-[#E9DFD1] rounded-2xl p-10 sm:p-14 text-center my-8 shadow-xs max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF4EB] text-[#B07129] flex items-center justify-center mx-auto mb-3">
              <Search size={28} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123038] mb-1.5">No matching stays found</h3>
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#6C6962] mb-5 leading-relaxed">
              We couldn&apos;t find any properties matching your current filters. Try resetting your search or choosing a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setPriceFilter("all");
                setSortBy("recommended");
                setSelectedAmenity("all");
              }}
              className="px-5 py-2.5 rounded-lg bg-[#AF6E26] text-white text-xs sm:text-sm font-bold hover:bg-[#975D1D] transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Cards Grid: 1 col on mobile, 2 on tablet, 3 on lg, 4 on xl */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredStays.map((stay) => {
              const isFav = favorites[stay.id];
              const isCamp = stay.type === "camp";

              return (
                <div
                  key={stay.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8DEC9] shadow-xs hover:shadow-card hover:-translate-y-1 hover:border-[#C97F2C]/60 transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenBooking(stay)}
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FAF6F0] shrink-0">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Left: Type Pill Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[12.5px] font-bold tracking-wide uppercase shadow-xs ${
                          isCamp
                            ? "bg-[#123038] text-[#F3E7D3] border border-[#234F5C]"
                            : "bg-[#C97F2C] text-white border border-[#DF9745]"
                        }`}
                      >
                        {isCamp ? <Tent size={13} /> : <Building2 size={13} />}
                        <span>{isCamp ? "Desert Camp" : "Heritage Hotel"}</span>
                      </span>
                    </div>

                    {/* Top Right: Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(stay.id, e)}
                      aria-label="Save to wishlist"
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isFav
                          ? "bg-white text-rose-500 shadow-md scale-105"
                          : "bg-black/40 text-white backdrop-blur-xs hover:bg-black/60"
                      }`}
                    >
                      <Heart size={15} className={isFav ? "fill-rose-500" : ""} />
                    </button>

                    {/* Bottom Left on Image: Rating */}
                    <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 text-white drop-shadow-md">
                      <div className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold border border-white/20">
                        <Star size={13} className="fill-gold text-gold" />
                        <span>{stay.rating}</span>
                      </div>
                      <span className="text-xs sm:text-[13px] text-white/95 font-medium">({stay.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-[#7D776E] text-xs sm:text-sm font-medium mb-1.5">
                        <MapPin size={14} className="text-[#C97F2C] shrink-0" />
                        <span className="truncate">{stay.location}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#123038] group-hover:text-[#C97F2C] transition-colors leading-snug mb-2">
                        {stay.name}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#5C5A55] leading-relaxed line-clamp-2 mb-3.5">
                        {stay.description}
                      </p>

                      {/* Amenity Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {stay.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs sm:text-[12.5px] px-2.5 py-1 rounded-[5px] bg-[#FAF4EB] text-[#604E38] font-medium border border-[#E9DFD1]"
                          >
                            <Check size={11} className="text-[#C97F2C]" />
                            <span>{amenity}</span>
                          </span>
                        ))}
                        {stay.amenities.length > 3 && (
                          <span className="text-xs text-[#7A7367] font-medium self-center">
                            +{stay.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Price & Action Row */}
                    <div className="pt-3.5 border-t border-[#EFE6D6] flex items-end justify-between gap-2 mt-auto">
                      <div>
                        <span className="text-xs text-[#7D776E] block font-semibold mb-0.5">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-2xl sm:text-[1.65rem] font-bold text-[#123038]">
                            {formatPrice(stay.price)}
                          </span>
                          <span className="text-xs sm:text-sm text-[#6C675E]">/ night</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(stay);
                        }}
                        className="px-4 py-2 sm:py-2.5 rounded-lg bg-[#AF6E26] hover:bg-[#975D1D] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* Comparison Guide: Heritage Hotel vs. Desert Camp          */}
        {/* ========================================================= */}
        <section className="mt-14 sm:mt-20 bg-white border border-[#E8DEC9] rounded-2xl p-6 sm:p-10 shadow-xs overflow-hidden relative">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold tracking-[0.22em] text-[#B07129] uppercase block mb-1">
              HELPING YOU DECIDE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#123038] mb-2">
              Heritage Hotel vs. Desert Camp
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6962] leading-relaxed">
              Not sure which accommodation suits your vacation? Compare the unique advantages of both authentic Jaisalmer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Column 1: Heritage Hotels */}
            <div className="bg-[#FAF6F0] border border-[#ECDDC7] rounded-xl p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C97F2C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#123038]">Heritage Havelis &amp; Hotels</h3>
                    <span className="text-xs text-[#8A8478] font-medium">Inside or near Jaisalmer Fort city</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5A5853] mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Historical Architecture:</strong> 18th-century yellow sandstone carvings, jharokhas &amp; royal courtyards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Prime Location:</strong> Walking distance to Sonar Qila, Sadar Bazar, Patwon Ki Haveli, and Gadisar Lake.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Rooftop Dining:</strong> Scenic sunset vistas of illuminated fort bastions with gourmet dining.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Best for:</strong> Architecture lovers, short stays, business trips, and evening city walks.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("hotel");
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-lg border border-[#C97F2C] text-[#C97F2C] hover:bg-[#C97F2C] hover:text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Browse Heritage Hotels
              </button>
            </div>

            {/* Column 2: Desert Camps */}
            <div className="bg-[#FAF6F0] border border-[#ECDDC7] rounded-xl p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#123038] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Tent size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#123038]">Desert Camps &amp; Glamping</h3>
                    <span className="text-xs text-[#8A8478] font-medium">Sam Sand Dunes &amp; Thar Desert (40 km)</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5A5853] mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Thar Glamping:</strong> Luxury Swiss cottage tents with AC/heating and modern attached bathrooms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Dune Adventures:</strong> Sunset camel safaris, 4x4 quad biking and exhilarating dune bashing right outside.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Cultural Nights:</strong> Bonfire gatherings with Kalbelia folk dancers, fire shows &amp; buffet feasts under stars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Best for:</strong> Couples, families, adventure seekers, and unforgettable stargazing nights.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("camp");
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-lg border border-[#123038] text-[#123038] hover:bg-[#123038] hover:text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Browse Desert Camps
              </button>
            </div>
          </div>

          {/* Pro Tip Recommendation Callout */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-[#FAF0E2] via-[#FDF7EE] to-[#FAF0E2] border border-[#E9DAC6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start md:items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C97F2C] text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-[#142B36]">Pro Traveler Combo Recommendation</h4>
                <p className="text-xs text-[#6B655B] max-w-xl mt-0.5">
                  Can&apos;t pick between the fort and dunes? <strong>85% of our guests book 1 Night in a Heritage Haveli + 1 Night in a Desert Camp</strong> for the quintessential complete Jaisalmer experience!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlanTripOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#AF6E26] hover:bg-[#975D1D] text-white font-bold text-xs transition-colors shadow-xs whitespace-nowrap cursor-pointer shrink-0 text-center justify-center"
            >
              Plan A Combo Trip
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FAQs Section                                              */}
        {/* ========================================================= */}
        <section className="mt-10 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#B07129] uppercase block mb-1">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#123038]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#E8DEC9] rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-sans font-bold text-xs sm:text-sm text-[#123038] hover:text-[#C97F2C] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-[#FAF4EB] text-[#C97F2C] flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-[#66635C] leading-relaxed border-t border-[#F0E6D8] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Bottom Concierge Support Card                             */}
        {/* ========================================================= */}
        <section className="mt-10 sm:mt-16 lg:mt-20 bg-[#123038] text-white rounded-2xl p-5 sm:p-8 lg:p-10 relative overflow-hidden shadow-lg">
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C97F2C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-gold-light uppercase block mb-1.5">
              LOCAL DESERT CONCIERGE
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2.5 sm:mb-3 tracking-tight">
              Need Personal Assistance Choosing Your Stay?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed mb-5 sm:mb-6 max-w-2xl">
              Our team lives in Jaisalmer and has personally vetted every property. Reach out for instant dates availability, private group discounts, or custom honeymoon decor setups.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210?text=Hello!%20I%20need%20help%20choosing%20between%20Jaisalmer%20hotels%20and%20desert%20camps."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer text-center"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Concierge</span>
              </a>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold border border-white/25 transition-all cursor-pointer text-center"
              >
                <Phone size={15} />
                <span>Call +91 98765 43210</span>
              </a>

              <button
                type="button"
                onClick={() => setIsPlanTripOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer text-center"
              >
                <span>Request Custom Quote</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Site Footer */}
      <Footer />

      {/* Booking Modal */}
      {selectedItem && (
        <BookingModal
          item={selectedItem}
          type={selectedItem.type}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Plan Trip Modal */}
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
          setSelectedItem(item);
          setIsBookingOpen(true);
        }}
      />
    </div>
  );
}

export default function CampsHotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CampsHotelsContent />
    </Suspense>
  );
}
