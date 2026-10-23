"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Compass, 
  MapPin, 
  Star, 
  Heart, 
  Clock, 
  Search, 
  Sparkles, 
  Camera, 
  Flame, 
  Luggage, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Phone, 
  MessageCircle, 
  Check, 
  X,
  Calendar,
  Eye,
  Info
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";

import { toursData, destinationsData, Tour, Destination } from "@/data/jaisalmerData";
import { useCurrency } from "@/context/CurrencyContext";

export interface ExperienceItem {
  id: string;
  name: string;
  type: "tour" | "place";
  category: string;
  image: string;
  rating?: number;
  reviews?: number;
  location: string;
  durationOrDistance: string;
  price?: number;
  description: string;
  highlights: string[];
  bestTime?: string;
}

function ToursPlacesContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get("type") || searchParams?.get("tab") || "all";

  const { formatPrice } = useCurrency();

  // Filters state
  const [activeTab, setActiveTab] = useState<"all" | "tour" | "place">(
    initialType === "tours" || initialType === "tour"
      ? "tour"
      : initialType === "places" || initialType === "place" || initialType === "destinations"
      ? "place"
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price-asc" | "price-desc">("recommended");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modals state
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"tour" | "destination" | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Combine Tours and Destinations data
  const allExperiences: ExperienceItem[] = useMemo(() => {
    const tours: ExperienceItem[] = toursData.map((t) => ({
      id: t.id,
      name: t.title,
      type: "tour",
      category: t.location.includes("Sam") ? "Desert Safari" : "Heritage Tour",
      image: t.image,
      rating: t.rating,
      reviews: t.reviews,
      location: t.location,
      durationOrDistance: t.duration,
      price: t.price,
      description: t.description,
      highlights: t.id === "camel-safari" 
        ? ["Sunset Dune Ride", "Local Thar Guide", "Tea & Snacks", "Dune Photography"]
        : t.id === "jeep-safari"
        ? ["4x4 Dune Bashing", "High Sand Ripples", "Expert Driver", "Thrill Experience"]
        : t.id === "cultural-evening"
        ? ["Kalbelia Folk Dance", "Manganiyar Music", "Fire Dance Show", "Royal Buffet Dinner"]
        : t.id === "jaisalmer-fort-tour"
        ? ["Sonar Qila Palace", "Jain Temples", "Merchant Havelis", "Historical Narrative"]
        : ["Professional Shoot", "Golden Hour Light", "High-Res Edits", "Fort & Dunes Vistas"],
      bestTime: t.location.includes("Sam") ? "4:30 PM - 7:30 PM (Sunset)" : "9:00 AM - 12:30 PM",
    }));

    const places: ExperienceItem[] = destinationsData.map((d) => ({
      id: d.id,
      name: d.name,
      type: "place",
      category: d.id.includes("dunes") ? "Desert Dunes" : "Historical Wonder",
      image: d.image,
      rating: 4.9,
      reviews: 320,
      location: d.distance,
      durationOrDistance: d.distance,
      description: d.description,
      highlights: d.id === "jaisalmer-fort"
        ? ["UNESCO World Heritage", "Living Fortress", "Golden Sandstone", "Rajput Royalty"]
        : d.id === "sam-sand-dunes"
        ? ["30-Meter Sand Ripples", "Desert Camps", "Camel Safaris", "Sunset Paradise"]
        : d.id === "kuldhara-village"
        ? ["13th Century Ruins", "Cursed Village Legend", "Paliwal Brahmin History", "Archaeological Site"]
        : d.id === "gadisar-lake"
        ? ["Scenic Ghats & Chhatris", "Boating Available", "Migratory Birds", "Peaceful Sunrise"]
        : ["Royal Maharajas Cenotaphs", "Carved Jali Work", "Windmill Hill Views", "Sunset Silhouette"],
      bestTime: d.id === "gadisar-lake" ? "Sunrise & Early Morning" : d.id.includes("dunes") ? "4:00 PM onwards" : "Morning & Late Afternoon",
    }));

    return [...tours, ...places];
  }, []);

  // Filter and sort items
  const filteredExperiences = useMemo(() => {
    return allExperiences
      .filter((item) => {
        // Tab filter
        if (activeTab === "tour" && item.type !== "tour") return false;
        if (activeTab === "place" && item.type !== "place") return false;

        // Search text filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchHighlight = item.highlights.some((h) => h.toLowerCase().includes(q));
          if (!matchName && !matchLoc && !matchDesc && !matchHighlight) return false;
        }

        // Duration / Distance filter
        if (durationFilter !== "all") {
          if (durationFilter === "short" && !item.durationOrDistance.includes("Hour") && !item.durationOrDistance.includes("2 km")) return false;
          if (durationFilter === "half-day" && !item.durationOrDistance.includes("Half") && !item.durationOrDistance.includes("3 Hours") && !item.durationOrDistance.includes("6 km")) return false;
          if (durationFilter === "desert" && !item.location.includes("Sam") && !item.location.includes("40 km")) return false;
          if (durationFilter === "city" && !item.location.includes("City") && !item.location.includes("Fort") && !item.location.includes("2 km")) return false;
        }

        // Tag filter
        if (selectedTag !== "all") {
          const tagLower = selectedTag.toLowerCase();
          const matchCat = item.category.toLowerCase().includes(tagLower);
          const matchHigh = item.highlights.some((h) => h.toLowerCase().includes(tagLower));
          const matchName = item.name.toLowerCase().includes(tagLower);
          if (!matchCat && !matchHigh && !matchName) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
        return 0; // recommended order
      });
  }, [allExperiences, activeTab, searchQuery, durationFilter, sortBy, selectedTag]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBookTour = (tourItem: ExperienceItem) => {
    setSelectedItem({
      ...tourItem,
      title: tourItem.name,
      price: tourItem.price || 1000,
    });
    setModalType("tour");
    setIsBookingOpen(true);
  };

  const handlePlanPlace = (placeItem: ExperienceItem) => {
    setSelectedItem({
      ...placeItem,
      title: placeItem.name,
    });
    setModalType("destination");
    setIsPlanTripOpen(true);
  };

  const faqs = [
    {
      q: "What is the best time of year to visit Jaisalmer and take desert safaris?",
      a: "The prime season is October to March when daytime weather is delightfully pleasant (20°C to 28°C) and evenings are cool and crisp under starry desert skies. Desert safaris are at their best during these months.",
    },
    {
      q: "Are the camel and jeep safaris safe for kids and elderly family members?",
      a: "Yes! Our camel handlers assist every rider closely with comfortable saddles, while our 4x4 jeep drivers adjust speed and dune gradient according to your family's comfort level. Customized relaxed tours are always available.",
    },
    {
      q: "How can I commute between Jaisalmer Fort city and Sam Sand Dunes?",
      a: "Sam Sand Dunes are about 40 km from the fort city (a 45-minute smooth scenic highway drive). We arrange private AC sedan or SUV transfers with pickup and drop from any hotel or railway station.",
    },
    {
      q: "Is an entry ticket or guide required for Jaisalmer Fort?",
      a: "Entry into the living fort streets and markets is completely free! Tickets are only required for the Palace Museum and Jain Temples. We highly recommend our licensed government guide walking tour to hear the 800-year royal history.",
    },
    {
      q: "Can I combine a sunset desert safari with an evening cultural folk dance & dinner?",
      a: "Yes! Our most popular signature experience combines the 4:30 PM sunset camel or jeep safari directly with the 7:00 PM royal campfire, Kalbelia folk performance, and Rajasthani buffet dinner.",
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
        {/* Background Image: dest-sam-dunes.jpg */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/others/tours-places.webp"
            alt="Tours & Places in Jaisalmer - Golden Fort at Sunset with royal terrace"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-top sm:object-right"
          />
          {/* Atmospheric Dark Gradient for Ultra-Crisp Typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 to-transparent sm:via-[#FAF6F0]/75 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#FAF6F0]/85 sm:hidden pointer-events-none" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 text-white">
          <div className="max-w-4xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-2 text-[#8C765E]">
              <Link href="/" className="hover:text-gold transition-colors">
                HOME
              </Link>
              <span className="text-gold-light font-bold">›</span>
              <span className="text-gold-light font-bold">TOURS &amp; PLACES</span>
            </div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
                CURATED EXPERIENCES &amp; DESTINATIONS
              </span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-3 sm:mb-3.5">
              Tours &amp; Iconic Places in Jaisalmer
            </h1>

            {/* Subtitle */}
            <p className="font-sans mb-2 text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-3xl leading-relaxed font-normal">
              From thrilling 4x4 dune bashing across golden Thar ripples to walking through the 800-year-old living fortress of Sonar Qila, explore the best adventures and sacred desert monuments.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-1 w-full max-w-md sm:max-w-none mt-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Compass size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Guided Safaris</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <MapPin size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">UNESCO Heritage</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <Sparkles size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Folk Cultural Nights</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-black px-2.5 sm:px-3 py-2 rounded-lg border border-white/15">
                <ShieldCheck size={15} className="text-gold-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">Verified Local Guides</span>
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
                All ({allExperiences.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tour")}
                className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer truncate ${
                  activeTab === "tour"
                    ? "bg-[#C97F2C] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <Compass size={12} className="shrink-0" />
                <span className="truncate">Tours ({toursData.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("place")}
                className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer truncate ${
                  activeTab === "place"
                    ? "bg-[#123038] text-white shadow-xs"
                    : "text-[#635F58] hover:text-[#123038]"
                }`}
              >
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">Places ({destinationsData.length})</span>
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
                  placeholder="Search safari, fort, lake..."
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

              {/* Type / Location Filter Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  aria-label="Filter experiences by type or location"
                  className="h-8 sm:h-9 pl-2 sm:pl-2.5 pr-5 sm:pr-6 bg-white border border-[#DECDB3] rounded-lg text-[11px] sm:text-xs font-semibold text-[#1F2022] appearance-none focus:outline-none focus:border-[#C97F2C] shadow-2xs cursor-pointer truncate"
                >
                  <option value="all">All Locations</option>
                  <option value="desert">Thar Dunes (40 km)</option>
                  <option value="city">Fort &amp; City Center</option>
                  <option value="short">Short (1-2 Hours)</option>
                  <option value="half-day">Half Day Tour</option>
                </select>
                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8F8A80] pointer-events-none" />
              </div>

              {/* Sort By Select */}
              <div className="relative shrink-0 sm:shrink">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort experiences by rating or price"
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
              {(searchQuery || durationFilter !== "all" || sortBy !== "recommended" || selectedTag !== "all" || activeTab !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
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

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pt-1.5 pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#8A8478] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles size={11} className="text-[#B07129]" />
              Highlights:
            </span>
            {[
              { label: "All Experiences", value: "all" },
              { label: "Desert Safari", value: "Safari" },
              { label: "UNESCO Fort", value: "Fort" },
              { label: "Folk Dance & Fire", value: "Folk" },
              { label: "Sunset Sand Dunes", value: "Dune" },
              { label: "Ancient Ruins", value: "Village" },
              { label: "Sacred Lake", value: "Lake" },
              { label: "Photography", value: "Photography" },
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

      {/* Main Experiences Listing Section */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1">
        
        {/* Results Counter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5 sm:mb-6">
          <div>
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#B07129] block mb-0.5">
              EXPLORE JAISALMER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#123038] tracking-tight">
              {activeTab === "all" ? "Tours & Sightseeing Places" : activeTab === "tour" ? "Adventures & Safaris" : "Iconic Places to Visit"} ({filteredExperiences.length})
            </h2>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#6E685E]">
            Handpicked adventures &amp; historical monuments verified by local guides
          </p>
        </div>

        {/* Empty State */}
        {filteredExperiences.length === 0 ? (
          <div className="bg-white border border-[#E9DFD1] rounded-2xl p-8 sm:p-12 text-center my-8 shadow-xs max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF4EB] text-[#B07129] flex items-center justify-center mx-auto mb-3">
              <Search size={26} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123038] mb-1.5">No matching experiences found</h3>
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#6C6962] mb-5 leading-relaxed">
              We couldn&apos;t find any tours or destinations matching your criteria. Try adjusting search keywords or clear your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
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
          /* Cards Grid: 1 col on mobile, 2 on tablet, 3 on lg */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredExperiences.map((item) => {
              const isFav = favorites[item.id];
              const isTour = item.type === "tour";

              return (
                <div
                  key={item.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8DEC9] shadow-xs hover:shadow-card hover:-translate-y-1 hover:border-[#C97F2C]/60 transition-all duration-300"
                >
                  {/* Photo Container with Top Badges */}
                  <div className="relative h-50 sm:h-56 w-full overflow-hidden bg-[#FAF6F0] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Left: Type Pill Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[12.5px] font-bold tracking-wide uppercase shadow-xs ${
                          isTour
                            ? "bg-[#C97F2C] text-white border border-[#DF9745]"
                            : "bg-[#123038] text-[#F3E7D3] border border-[#234F5C]"
                        }`}
                      >
                        {isTour ? <Compass size={13} /> : <MapPin size={13} />}
                        <span>{isTour ? "Guided Tour" : "Must-See Place"}</span>
                      </span>

                      <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/45 text-white/95 backdrop-blur-xs border border-white/20">
                        {item.category}
                      </span>
                    </div>

                    {/* Top Right: Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      aria-label="Save to wishlist"
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isFav
                          ? "bg-white text-rose-500 shadow-md scale-105"
                          : "bg-black/40 text-white backdrop-blur-xs hover:bg-black/60"
                      }`}
                    >
                      <Heart size={15} className={isFav ? "fill-rose-500" : ""} />
                    </button>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white drop-shadow-md text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold border border-white/20">
                          <Star size={13} className="fill-gold text-gold" />
                          <span>{item.rating || 4.8}</span>
                        </div>
                        <span className="text-xs sm:text-[13px] text-white/95 font-medium">({item.reviews || 240} reviews)</span>
                      </div>

                      {/* Duration / Distance tag */}
                      <div className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs sm:text-[12.5px] font-semibold text-white/95 border border-white/20">
                        {isTour ? <Clock size={12} /> : <MapPin size={12} />}
                        <span>{item.durationOrDistance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Location Row */}
                      <div className="flex items-center gap-1.5 text-[#7D776E] text-xs sm:text-sm font-medium mb-1.5">
                        <MapPin size={14} className="text-[#C97F2C] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#123038] group-hover:text-[#C97F2C] transition-colors leading-snug mb-2">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#5C5A55] leading-relaxed line-clamp-2 mb-3.5">
                        {item.description}
                      </p>

                      {/* Highlight Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.highlights.slice(0, 3).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs sm:text-[12.5px] px-2.5 py-1 rounded-[5px] bg-[#FAF4EB] text-[#604E38] font-medium border border-[#E9DFD1]"
                          >
                            <Check size={11} className="text-[#C97F2C]" />
                            <span>{highlight}</span>
                          </span>
                        ))}
                      </div>

                      {/* Best Timing Info */}
                      {item.bestTime && (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6C675E] mb-3 bg-[#FAF6F0] p-2.5 rounded-lg border border-[#EFE6D6]">
                          <Eye size={13} className="text-[#B07129] shrink-0" />
                          <span><strong>Best Time:</strong> {item.bestTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action & Price Row */}
                    <div className="pt-3 border-t border-[#EFE6D6] flex items-center justify-between gap-2 mt-auto">
                      <div>
                        {isTour && item.price ? (
                          <div>
                            <span className="text-xs text-[#7D776E] block font-semibold mb-0.5">Price per person</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-serif text-2xl sm:text-[1.65rem] font-bold text-[#123038]">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-xs sm:text-sm text-[#6C675E]">/ person</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-[#7D776E] block font-semibold mb-0.5">Visiting Sight</span>
                            <span className="font-serif text-base sm:text-lg font-bold text-[#B07129]">
                              Free Sightseeing
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {isTour ? (
                        <button
                          type="button"
                          onClick={() => handleBookTour(item)}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[5px] bg-[#AF6E26] hover:bg-[#975D1D] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Book Tour</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePlanPlace(item)}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#123038] hover:bg-[#1c4753] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Plan Visit</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* Comparison Guide: Tours vs. Self-Exploration              */}
        {/* ========================================================= */}
        <section className="mt-10 sm:mt-16 lg:mt-20 bg-white border border-[#E8DEC9] rounded-2xl p-4 sm:p-8 lg:p-10 shadow-xs overflow-hidden relative">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#B07129] uppercase block mb-1">
              LOCAL TRAVEL ADVICE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#123038] mb-2">
              Guided Safaris &amp; Tours vs. Self-Exploration
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6962] leading-relaxed">
              Wondering whether to book guided excursions or wander on your own? Here is how to plan the perfect balance in Jaisalmer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* Column 1: Guided Safaris & Tours */}
            <div className="bg-[#FAF6F0] border border-[#ECDDC7] rounded-xl p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C97F2C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#123038]">Guided Safaris &amp; Desert Tours</h3>
                    <span className="text-xs text-[#8A8478] font-medium">Sam Sand Dunes, Thar Desert &amp; Fort</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5A5853] mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Hassle-Free Logistics:</strong> Includes 4x4 vehicles, verified camel guides, and hotel pickup/drop.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Deep Dune Access:</strong> Reach pristine, untouched dunes far away from crowded tourist parking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Evening Camp Dinner:</strong> Live Kalbelia dancers, campfire musical shows, and royal buffet included.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C97F2C] shrink-0 mt-0.5" />
                    <span><strong>Best For:</strong> First-time visitors, families with kids, couples, and photography lovers.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("tour");
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-lg border border-[#C97F2C] text-[#C97F2C] hover:bg-[#C97F2C] hover:text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Browse All Guided Tours
              </button>
            </div>

            {/* Column 2: Self-Exploration of Places */}
            <div className="bg-[#FAF6F0] border border-[#ECDDC7] rounded-xl p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#123038] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#123038]">Self-Guided Sightseeing</h3>
                    <span className="text-xs text-[#8A8478] font-medium">Fort Alleys, Gadisar Lake &amp; Bada Bagh</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5A5853] mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Flexible Pace:</strong> Spend as much time as you like sipping chai on rooftop havelis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Walking Exploration:</strong> Fort alleys, Patwon ki Haveli, and Sadar Bazar are easily walkable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Sunrise Magic:</strong> Watch migrating catfish and morning birds at Gadisar Lake at 6:30 AM.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#123038] shrink-0 mt-0.5" />
                    <span><strong>Best For:</strong> Solo backpackers, history buffs, and street culture shoppers.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("place");
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-lg border border-[#123038] text-[#123038] hover:bg-[#123038] hover:text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Browse Iconic Places
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
                <h4 className="font-sans font-bold text-sm text-[#142B36]">Ideal 2-Day Sightseeing Blueprint</h4>
                <p className="text-xs text-[#6B655B] max-w-xl mt-0.5">
                  <strong>Day 1:</strong> Jaisalmer Fort walking tour, Patwon ki Haveli &amp; Gadisar Lake sunset. <strong>Day 2:</strong> Kuldhara Ghost Village, sunset camel &amp; jeep safari in Sam Dunes, followed by dinner &amp; folk night!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlanTripOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#AF6E26] hover:bg-[#975D1D] text-white font-bold text-xs transition-colors shadow-xs whitespace-nowrap cursor-pointer shrink-0 text-center justify-center"
            >
              Custom Tour Plan
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
              Frequently Asked Questions About Tours &amp; Places
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
              CUSTOM TOUR ASSISTANCE
            </span>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2.5 sm:mb-3 tracking-tight">
              Looking for a Private Cab or Custom Desert Safari?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed mb-5 sm:mb-6 max-w-2xl">
              Tell our local concierge your dates and group size. We will customize your vehicle, guide, sunrise/sunset safari slots, and private camp dinner seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210?text=Hello!%20I%20would%20like%20to%20plan%20tours%20and%20places%20to%20visit%20in%20Jaisalmer."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer text-center"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Tour Guide</span>
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

      {/* Booking Modal for Tours */}
      {selectedItem && (
        <BookingModal
          item={selectedItem}
          type={modalType}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Plan Trip Modal for Destinations / Custom Plans */}
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

export default function ToursPlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ToursPlacesContent />
    </Suspense>
  );
}
