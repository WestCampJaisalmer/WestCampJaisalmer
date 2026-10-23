"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Search,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  Phone,
  MessageCircle,
  Eye,
  Gift,
  Car,
  Utensils,
  Moon,
  Camera,
  Info
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";

import { packagesData, TravelPackage } from "@/data/jaisalmerData";
import { useCurrency } from "@/context/CurrencyContext";

function PackagesPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || searchParams?.get("type") || "all";

  const { formatPrice } = useCurrency();

  // Filters state
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory === "desert" || initialCategory === "camps"
      ? "desert"
      : initialCategory === "honeymoon" || initialCategory === "luxury"
      ? "honeymoon"
      : initialCategory === "family"
      ? "family"
      : initialCategory === "heritage"
      ? "heritage"
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price-asc" | "price-desc">("recommended");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modals state
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [detailModalPackage, setDetailModalPackage] = useState<TravelPackage | null>(null);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter & sort packages
  const filteredPackages = useMemo(() => {
    return packagesData
      .filter((pkg) => {
        // Category filter
        if (activeCategory !== "all" && pkg.category !== activeCategory) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = pkg.name.toLowerCase().includes(q);
          const matchLoc = pkg.location.toLowerCase().includes(q);
          const matchDesc = pkg.description.toLowerCase().includes(q);
          const matchInc = pkg.inclusions.some((inc) => inc.toLowerCase().includes(q));
          if (!matchName && !matchLoc && !matchDesc && !matchInc) return false;
        }

        // Duration filter
        if (durationFilter !== "all") {
          if (durationFilter === "2d1n" && !pkg.duration.includes("2 Days")) return false;
          if (durationFilter === "3d2n" && !pkg.duration.includes("3 Days")) return false;
          if (durationFilter === "4d3n" && !pkg.duration.includes("4 Days")) return false;
          if (durationFilter === "5d4n" && !pkg.duration.includes("5 Days")) return false;
        }

        // Highlight tag filter
        if (selectedTag !== "all") {
          const tagLower = selectedTag.toLowerCase();
          const matchInc = pkg.inclusions.some((inc) => inc.toLowerCase().includes(tagLower));
          const matchTag = pkg.tag?.toLowerCase().includes(tagLower);
          const matchDesc = pkg.description.toLowerCase().includes(tagLower);
          if (!matchInc && !matchTag && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // recommended order
      });
  }, [activeCategory, searchQuery, durationFilter, sortBy, selectedTag]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBookPackage = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const faqs = [
    {
      q: "Can we customize the number of days or upgrade our camps/hotel rooms?",
      a: "Yes, absolutely! Every package is 100% customizable. You can add extra nights in the city or desert, upgrade to royal AC Swiss tents or palace suites, and add private activities like paramotoring, quad biking, or candlelit dinners."
    },
    {
      q: "Are railway station or airport pickup and drop included in the package?",
      a: "Yes! All our multi-day packages include private, chauffeur-driven AC vehicles with station/airport pickup and drop in Jaisalmer. Intercity transfers from Jodhpur or Jaipur can also be arranged upon request."
    },
    {
      q: "What meals are included during our desert camp and hotel stay?",
      a: "Desert camp packages include welcome drinks, evening tea & snacks at sunset, traditional Rajasthani buffet dinners during the cultural folk dance, and morning breakfast. Hotel stays include daily breakfast."
    },
    {
      q: "Are the camel and 4x4 jeep safaris safe for kids and elderly parents?",
      a: "Yes! Our camel handlers walk beside every camel with double-saddle support, and our 4x4 dune drivers customize their dune-climbing speed based on your family's preferences."
    },
    {
      q: "What is the booking and payment procedure?",
      a: "You can reserve your package with a nominal 20% advance token. The remaining balance can be settled smoothly upon arrival in Jaisalmer via UPI, card, or cash."
    }
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
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/banners/Dreamy_Desert_Fort_at_Sunrise.png"
            alt="All-Inclusive Jaisalmer Holiday Packages with Desert Camps and Heritage Havelis"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-top sm:object-right"
          />
          {/* Atmospheric Gradient */}
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
              <span className="text-gold font-bold">ALL PACKAGES</span>
            </div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#AF6E26]">
                ALL-INCLUSIVE CURATED TOUR PLANS
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-3 sm:mb-3.5">
              Jaisalmer Holiday Packages
            </h1>

            {/* Subtitle */}
            <p className="font-sans mb-2 text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-3xl leading-relaxed font-normal">
              Handcrafted all-inclusive tour plans combining royal fort haveli stays, luxury Swiss desert camps, thrilling 4x4 dune bashing, authentic Kalbelia folk performances &amp; private AC sightseeing.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-1 w-full max-w-md sm:max-w-none mt-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Utensils size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Meals &amp; Camp Dinners</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Car size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Private AC Transfers</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Sparkles size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Dune Safari &amp; Folk Show</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <ShieldCheck size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">100% Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Filter Bar (Ultra-Compact on Mobile) */}
      <section className="sticky top-[90px] sm:top-[65px] z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DEC9] py-2 sm:py-2.5 shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-1.5 sm:gap-3">
            
            {/* Left: Category Segmented Switcher */}
            <div className="flex items-center overflow-x-auto no-scrollbar w-full lg:w-auto p-0.5 sm:p-1 bg-[#EBE2D0] rounded-lg border border-[#DECDB3] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`flex items-center justify-center text-center px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 truncate ${
                  activeCategory === "all"
                    ? "bg-white text-[#123038] shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                All ({packagesData.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("desert")}
                className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 truncate ${
                  activeCategory === "desert"
                    ? "bg-[#C97F2C] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Compass size={12} className="shrink-0" />
                <span>Desert &amp; Dunes (3)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("honeymoon")}
                className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 truncate ${
                  activeCategory === "honeymoon"
                    ? "bg-[#123038] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Heart size={12} className="shrink-0" />
                <span>Honeymoon &amp; Royal (2)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("family")}
                className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 truncate ${
                  activeCategory === "family"
                    ? "bg-[#AF6E26] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Users size={12} className="shrink-0" />
                <span>Family Special (1)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("heritage")}
                className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 truncate ${
                  activeCategory === "heritage"
                    ? "bg-[#25464F] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <MapPin size={12} className="shrink-0" />
                <span>Heritage &amp; Border (2)</span>
              </button>
            </div>

            {/* Right: Search Input & Dropdowns in ONE compact row */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 lg:justify-end w-full lg:w-auto">
              {/* Search input */}
              <div className="relative flex-1 min-w-[120px] sm:max-w-xs">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8F8A80]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search package, safari, hotel..."
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

              {/* Duration Filter Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  aria-label="Filter packages by duration"
                  className="h-8 sm:h-9 pl-2 sm:pl-2.5 pr-5 sm:pr-6 bg-white border border-[#DECDB3] rounded-lg text-[11px] sm:text-xs font-semibold text-[#1F2022] appearance-none focus:outline-none focus:border-[#C97F2C] shadow-2xs cursor-pointer truncate"
                >
                  <option value="all">All Durations</option>
                  <option value="2d1n">2 Days / 1 Night</option>
                  <option value="3d2n">3 Days / 2 Nights</option>
                  <option value="4d3n">4 Days / 3 Nights</option>
                  <option value="5d4n">5 Days / 4 Nights</option>
                </select>
                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8F8A80] pointer-events-none" />
              </div>

              {/* Sort By Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort packages by rating or price"
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
              {(searchQuery || durationFilter !== "all" || sortBy !== "recommended" || selectedTag !== "all" || activeCategory !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    setDurationFilter("all");
                    setSortBy("recommended");
                    setSelectedTag("all");
                  }}
                  className="text-[10.5px] sm:text-xs font-bold text-[#B07129] hover:underline px-1 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Highlight Chips */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pt-1.5 pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#8A8478] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles size={11} className="text-[#B07129]" />
              Popular:
            </span>
            {[
              { label: "All Packages", value: "all" },
              { label: "Swiss Desert Camp", value: "Swiss" },
              { label: "Camel & 4x4 Safari", value: "Safari" },
              { label: "Candlelight Dinner", value: "Candlelight" },
              { label: "Heritage Fort Haveli", value: "Haveli" },
              { label: "Private AC Cab", value: "Sedan" },
              { label: "Folk Dance & DJ Night", value: "Dance" },
              { label: "Kuldhara Ghost Village", value: "Kuldhara" },
              { label: "Longewala Border", value: "Longewala" },
            ].map((chip) => {
              const isSelected = selectedTag === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setSelectedTag(chip.value)}
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

      {/* Main Packages Listing Section */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1">
        
        {/* Results Counter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5 sm:mb-6">
          <div>
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#B07129] block mb-0.5">
              CURATED TOUR PLANS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#123038] tracking-tight">
              {activeCategory === "all"
                ? "All Jaisalmer Holiday Packages"
                : activeCategory === "desert"
                ? "Desert Safari & Camping Packages"
                : activeCategory === "honeymoon"
                ? "Romantic Honeymoon & Luxury Packages"
                : activeCategory === "family"
                ? "Family & Group Tour Packages"
                : "Heritage Havelis & Historical Packages"}{" "}
              ({filteredPackages.length})
            </h2>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#6E685E]">
            All packages include hotel/camp accommodation, meals, activities &amp; private transfers
          </p>
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white border border-[#E9DFD1] rounded-2xl p-8 sm:p-12 text-center my-8 shadow-xs max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF4EB] text-[#B07129] flex items-center justify-center mx-auto mb-3">
              <Package size={26} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123038] mb-1.5">No matching packages found</h3>
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#6C6962] mb-5 leading-relaxed">
              We couldn&apos;t find any tour packages matching your search filters. Try adjusting keywords or reset all filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setDurationFilter("all");
                setSortBy("recommended");
                setSelectedTag("all");
              }}
              className="px-5 py-2.5 rounded-lg bg-[#AF6E26] text-white text-xs sm:text-sm font-bold hover:bg-[#975D1D] transition-colors shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Packages Grid: 1 col on mobile, 2 on tablet, 3 on desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPackages.map((pkg) => {
              const isFav = favorites[pkg.id];
              const discountPercent = pkg.originalPrice
                ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={pkg.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8DEC9] shadow-xs hover:shadow-card hover:-translate-y-1 hover:border-[#C97F2C]/60 transition-all duration-300"
                >
                  {/* Photo Container with Top Badges */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FAF6F0] shrink-0">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Left: Duration Badge & Ribbon Tag */}
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[12.5px] font-bold tracking-wide uppercase bg-[#123038] text-[#F3E7D3] border border-[#234F5C] shadow-xs">
                        <Clock size={12} />
                        <span>{pkg.duration}</span>
                      </span>

                      {pkg.tag && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C97F2C] text-white shadow-xs">
                          {pkg.tag}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Wishlist Button & Discount Badge */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {discountPercent > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#25D366] text-white shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(pkg.id, e)}
                        aria-label="Save package to wishlist"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isFav
                            ? "bg-white text-rose-500 shadow-md scale-105"
                            : "bg-black/40 text-white backdrop-blur-xs hover:bg-black/60"
                        }`}
                      >
                        <Heart size={15} className={isFav ? "fill-rose-500" : ""} />
                      </button>
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white drop-shadow-md text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold border border-white/20">
                          <Star size={13} className="fill-gold text-gold" />
                          <span>{pkg.rating}</span>
                        </div>
                        <span className="text-xs sm:text-[13px] text-white/95 font-medium">({pkg.reviews} verified reviews)</span>
                      </div>

                      <div className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs sm:text-[12.5px] font-semibold text-white/95 border border-white/20">
                        <MapPin size={12} className="text-gold-light" />
                        <span className="truncate max-w-[120px]">{pkg.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#123038] group-hover:text-[#C97F2C] transition-colors leading-snug mb-2">
                        {pkg.name}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#5C5A55] leading-relaxed line-clamp-2 mb-3.5">
                        {pkg.description}
                      </p>

                      {/* Inclusions Checklist (Top 4 items) */}
                      <div className="space-y-1.5 mb-4">
                        {pkg.inclusions.slice(0, 4).map((inc, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs sm:text-sm text-[#3E3C38] font-medium">
                            <CheckCircle2 size={14} className="text-[#AF6E26] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{inc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Day-by-day Tour Plan Roadmap pills */}
                      <div className="pt-2 pb-1 border-t border-[#F0E6D8] mb-3">
                        <span className="text-[11px] sm:text-xs font-bold text-[#7A756C] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <Calendar size={12} className="text-[#C97F2C]" />
                          Tour Plan Preview:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                          {pkg.itinerary.map((step, idx) => (
                            <span
                              key={idx}
                              title={step.title}
                              className="text-[11px] sm:text-xs font-medium bg-[#FAF4EB] text-[#604E38] border border-[#E9DFD1] px-2.5 py-0.5 rounded-[5px] whitespace-nowrap shrink-0"
                            >
                              <strong>{step.day}:</strong> {step.title.split("&")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action & Price Row */}
                    <div className="pt-3 border-t border-[#EFE6D6] flex items-center justify-between gap-2 mt-auto">
                      <div>
                        <span className="text-xs text-[#7D776E] block font-semibold mb-0.5">All-Inclusive Price</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-2xl sm:text-[1.65rem] font-bold text-[#123038]">
                            {formatPrice(pkg.price)}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-xs sm:text-sm text-[#9E978C] line-through">
                              {formatPrice(pkg.originalPrice)}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm text-[#6C675E]">/ person</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailModalPackage(pkg)}
                          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-[#DECDB3] bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#123038] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                        >
                          <Calendar size={14} className="text-[#AF6E26] shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBookPackage(pkg)}
                          className="px-4 sm:px-5 p-2 rounded-[5px] bg-[#AF6E26] hover:bg-[#975D1D] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Book</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* Why Choose Our Packages (Value Grid)                      */}
        {/* ========================================================= */}
        <section className="mt-10 sm:mt-16 lg:mt-20 bg-white border border-[#E8DEC9] rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#B07129] uppercase block mb-1">
              THE JAISALMER EXPERIENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#123038] mb-2">
              Why Book Our All-Inclusive Holiday Packages?
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6962] leading-relaxed">
              We handle every detail from arrival pickup to royal desert glamping so you can simply relax and immerse in Rajasthan&apos;s golden glory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-5 rounded-xl flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-11 h-11 rounded-lg bg-[#AF6E26] text-white flex items-center justify-center mb-3 shadow-xs">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-[#123038] mb-1">Zero Hidden Costs</h3>
              <p className="text-xs text-[#63615C] leading-relaxed">
                All accommodation, monument entry tickets, camp meals, and safaris are upfront and transparent.
              </p>
            </div>

            <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-5 rounded-xl flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-11 h-11 rounded-lg bg-[#123038] text-white flex items-center justify-center mb-3 shadow-xs">
                <Car size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-[#123038] mb-1">Private AC Vehicle</h3>
              <p className="text-xs text-[#63615C] leading-relaxed">
                Dedicated chauffeur-driven sedan or Innova SUV for all city sightseeing and Sam desert dune drives.
              </p>
            </div>

            <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-5 rounded-xl flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-11 h-11 rounded-lg bg-[#C97F2C] text-white flex items-center justify-center mb-3 shadow-xs">
                <Users size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-[#123038] mb-1">Local Desert Guides</h3>
              <p className="text-xs text-[#63615C] leading-relaxed">
                Certified historians for the living fort and native camel handlers with deep knowledge of Thar dunes.
              </p>
            </div>

            <div className="bg-[#FAF6F0] border border-[#ECDDC7] p-5 rounded-xl flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-11 h-11 rounded-lg bg-[#25D366] text-white flex items-center justify-center mb-3 shadow-xs">
                <MessageCircle size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-[#123038] mb-1">24/7 Trip Concierge</h3>
              <p className="text-xs text-[#63615C] leading-relaxed">
                Real-time WhatsApp &amp; phone coordinator from booking until your return train or flight departure.
              </p>
            </div>
          </div>

          {/* Custom Package Callout */}
          <div className="mt-8 bg-gradient-to-r from-[#FAF0E2] via-[#FDF7EE] to-[#FAF0E2] border border-[#E9DAC6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#AF6E26] text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-[#142B36]">Need a Custom Route or Group Package?</h4>
                <p className="text-xs text-[#6B655B] max-w-xl mt-0.5">
                  Planning a college trip, corporate retreat, or extended Rajasthan tour (Jodhpur + Jaisalmer + Bikaner)? We customize vehicle size, tent blocks &amp; meal plans.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlanTripOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#AF6E26] hover:bg-[#975D1D] text-white font-bold text-xs transition-colors shadow-xs whitespace-nowrap cursor-pointer shrink-0 text-center"
            >
              Build Custom Package
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Packages FAQs Section                                     */}
        {/* ========================================================= */}
        <section className="mt-10 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#B07129] uppercase block mb-1">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#123038]">
              Frequently Asked Questions About Packages
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
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C97F2C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-gold-light uppercase block mb-1.5">
              INSTANT PACKAGE BOOKING &amp; ENQUIRY
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2.5 sm:mb-3 tracking-tight">
              Ready to Book Your Jaisalmer Holiday Package?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed mb-5 sm:mb-6 max-w-2xl">
              Talk directly with our local tour planner. We will check live tent and haveli availability for your dates, suggest the best tour plan, and send a quotation within 10 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210?text=Hello!%20I%20would%20like%20to%20enquire%20about%20Jaisalmer%20Holiday%20Packages."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer text-center"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Package Expert</span>
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

      {/* ========================================================= */}
      {/* Detailed Itinerary Modal                                  */}
      {/* ========================================================= */}
      {detailModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#DECDB3]">
            {/* Modal Header */}
            <div className="relative h-44 sm:h-52 w-full shrink-0">
              <Image
                src={detailModalPackage.image}
                alt={detailModalPackage.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                type="button"
                onClick={() => setDetailModalPackage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
              >
                <X size={17} />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-gold-light bg-black/40 px-2 py-0.5 rounded">
                  {detailModalPackage.duration} • {detailModalPackage.location}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 leading-snug">
                  {detailModalPackage.name}
                </h3>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#AF6E26] mb-1">
                  Package Overview
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                  {detailModalPackage.description}
                </p>
              </div>

              {/* Day-by-day Timeline */}
              <div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#123038] mb-3">
                  Day-by-Day Detailed Tour Plan
                </h4>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#EBDCC8]">
                  {detailModalPackage.itinerary.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-[#AF6E26] text-white flex items-center justify-center text-[10px] font-bold shrink-0 z-10 shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#ECDDC7] flex-1">
                        <span className="text-[11px] font-bold text-[#AF6E26] block">
                          {step.day}: {step.title}
                        </span>
                        <p className="text-xs text-[#63615C] mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions Box */}
              <div className="bg-[#FAF4EB] p-4 rounded-xl border border-[#E9DFD1]">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#705F4B] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#AF6E26]" />
                  What&apos;s Included In This Package:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#524B42]">
                  {detailModalPackage.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check size={12} className="text-[#AF6E26] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DEC9] bg-[#FAF6F0] flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-[10px] text-[#8C867B] block font-medium">Price per person</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#123038]">
                    {formatPrice(detailModalPackage.price)}
                  </span>
                  <span className="text-xs text-[#7D776E]">/ person</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailModalPackage(null)}
                  className="px-4 py-2 rounded-lg border border-[#DECDB3] text-xs font-semibold hover:bg-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pkg = detailModalPackage;
                    setDetailModalPackage(null);
                    handleBookPackage(pkg);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#AF6E26] hover:bg-[#975D1D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Now</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedPackage && (
        <BookingModal
          item={{
            ...selectedPackage,
            title: selectedPackage.name,
            price: selectedPackage.price,
          }}
          type="package"
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedPackage(null);
          }}
        />
      )}

      {/* Plan Trip Modal for Custom Requests */}
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
          setSelectedPackage(item);
          setIsBookingOpen(true);
        }}
      />
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PackagesPageContent />
    </Suspense>
  );
}
