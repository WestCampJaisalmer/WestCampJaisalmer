"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search, Star, MapPin, ArrowRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { useCurrency } from "@/context/CurrencyContext";

interface SearchItem {
  id: string;
  name: string;
  type: "hotel" | "camp" | "tour" | "package";
  price: number;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  location?: string;
  unit?: string;
}

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchParams: {
    tab?: string;
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  } | null;
  onSelectItem: (item: any, type: any) => void;
}

export default function SearchResultsModal({
  isOpen,
  onClose,
  searchParams,
  onSelectItem,
}: SearchResultsModalProps) {
  const { formatPrice } = useCurrency();
  const { hotels: hotelsData, camps: campsData, tours: toursData, packages: packagesData } = useContent();
  const [filterType, setFilterType] = useState<string>(searchParams?.tab || "all");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.destination || "");

  // Sync state whenever modal opens or searchParams change
  useEffect(() => {
    if (isOpen) {
      setFilterType(searchParams?.tab || "all");
      setSearchTerm(searchParams?.destination || "");
    }
  }, [isOpen, searchParams]);

  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aggregate listings
  const allHotels: SearchItem[] = hotelsData.map((h) => ({
    id: h.id,
    name: h.name,
    type: "hotel",
    price: h.price,
    image: h.image,
    description: h.description,
    rating: h.rating,
    reviews: h.reviews,
    location: h.location,
    unit: "night",
  }));

  const allCamps: SearchItem[] = campsData.map((c) => ({
    id: c.id,
    name: c.name,
    type: "camp",
    price: c.price,
    image: c.image,
    description: c.description,
    rating: c.rating,
    reviews: c.reviews,
    location: c.location,
    unit: "night",
  }));

  const allTours: SearchItem[] = toursData.map((t) => ({
    id: t.id,
    name: t.title,
    type: "tour",
    price: t.price,
    image: t.image,
    description: t.description,
    rating: t.rating,
    reviews: t.reviews,
    location: t.location || "Thar Desert, Jaisalmer",
    unit: t.unit,
  }));

  const allPackages: SearchItem[] = packagesData.map((p) => ({
    id: p.id,
    name: p.name,
    type: "package",
    price: p.price,
    image: p.image,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    location: p.location,
    unit: p.duration,
  }));

  const allItems: SearchItem[] = [...allHotels, ...allCamps, ...allTours, ...allPackages];

  const filtered = allItems.filter((item) => {
    const matchesType = 
      filterType === "all" ||
      (filterType === "hotels" && item.type === "hotel") ||
      (filterType === "camps" && item.type === "camp") ||
      (filterType === "tours" && item.type === "tour") ||
      (filterType === "packages" && item.type === "package");

    const matchesSearch = 
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-[1050] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-[#0b191e]/80 backdrop-blur-md animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col p-3 sm:p-6 md:p-8 overflow-hidden border border-border-light animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream border border-border-light flex items-center justify-center text-text-muted hover:text-text-main hover:bg-cream-alt hover:rotate-90 transition duration-300" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={17} />
        </button>

        {/* Modal Header */}
        <div className="mb-2.5 sm:mb-4 shrink-0">
          <h3 className="pr-9 sm:pr-12 font-serif text-base sm:text-2xl md:text-3xl font-bold text-teal tracking-tight leading-snug">
            Explore Jaisalmer Stays & Adventures
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-text-muted mt-0.5 sm:mt-1 mb-2 sm:mb-3.5 font-sans">
            {searchParams?.checkIn 
              ? `Showing availability for ${searchParams.guests || 2} guests` 
              : "Find handpicked royal havelis, luxury desert tents, safaris & tour packages"}
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-cream/40 border border-border-light rounded-full focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 transition mb-2 sm:mb-3">
            <Search size={15} className="text-gold shrink-0 sm:w-[18px] sm:h-[18px]" />
            <input
              type="text"
              placeholder="Search by name, dunes, fort, haveli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-xs sm:text-sm text-text-main placeholder:text-text-muted/70 font-sans"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="p-1 text-text-muted hover:text-text-main shrink-0"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All" },
              { id: "hotels", label: "Hotels & Havelis" },
              { id: "camps", label: "Desert Camps" },
              { id: "tours", label: "Safaris & Tours" },
              { id: "packages", label: "Tour Packages" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition border whitespace-nowrap shrink-0 ${
                  filterType === tab.id
                    ? "bg-gold text-white border-gold shadow-xs"
                    : "bg-white text-text-muted border-border-light hover:border-gold hover:text-text-main"
                }`}
                onClick={() => setFilterType(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 pr-0.5 sm:pr-1 space-y-2.5 sm:space-y-3">
          {filtered.length === 0 ? (
            <div className="py-10 sm:py-12 text-center text-text-muted font-sans text-xs sm:text-sm">
              <p>No listings found matching your search. Try searching for &ldquo;Sam&rdquo;, &ldquo;Fort&rdquo;, &ldquo;Camp&rdquo; or &ldquo;Package&rdquo;.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex flex-row items-center gap-3 sm:gap-4 p-2.5 sm:p-4 rounded-xl border border-border-light bg-white hover:border-gold hover:shadow-card active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    onSelectItem(item, item.type);
                    onClose();
                  }}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-24 rounded-[5px] overflow-hidden shrink-0 bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, 120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="sm:hidden absolute top-1 left-1 text-[8px] font-bold tracking-wider text-white bg-teal/90 px-1 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-widest text-[#ad671d] bg-[#f4ece0] px-2 py-0.5 rounded uppercase">
                        {item.type}
                      </span>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-xs font-bold text-text-main">
                          <Star size={12} fill="#df9745" color="#df9745" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:hidden mb-0.5">
                      {item.rating && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-text-main">
                          <Star size={11} fill="#df9745" color="#df9745" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                      {item.reviews && (
                        <span className="text-[10px] text-text-muted">({item.reviews})</span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-text-main group-hover:text-gold transition-colors truncate leading-tight">
                      {item.name}
                    </h4>

                    {item.location && (
                      <p className="flex items-center gap-1 text-[11px] sm:text-xs text-text-muted mt-0.5 truncate font-sans">
                        <MapPin size={11} className="text-gold shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    )}

                    <p className="hidden sm:block text-xs text-text-muted line-clamp-1 mt-1 font-sans">
                      {item.description}
                    </p>

                    {/* Mobile Price & View link row */}
                    <div className="flex sm:hidden items-center justify-between mt-1.5 pt-1.5 border-t border-border-light/60">
                      <div className="flex items-baseline">
                        <span className="text-xs font-bold text-gold">{formatPrice(item.price)}</span>
                        <span className="text-[10px] text-text-muted ml-0.5">{item.unit ? `/${item.unit}` : ""}</span>
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gold group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Desktop Price & Action column */}
                  <div className="hidden sm:flex flex-col items-end justify-center shrink-0 min-w-[110px] border-l border-border-light/60 pl-3">
                    <span className="block text-[11px] text-text-muted">From</span>
                    <span className="text-lg sm:text-xl font-bold text-gold leading-tight">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {item.unit ? `/ ${item.unit}` : ""}
                    </span>
                    <button className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gold group-hover:bg-gold-dark text-white text-xs font-semibold shadow-xs transition">
                      <span>View</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
