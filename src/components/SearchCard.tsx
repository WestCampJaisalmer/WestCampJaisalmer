"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Building2, 
  Tent, 
  Compass, 
  Package, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Plus, 
  Minus,
  Clock
} from "lucide-react";

interface SearchCardProps {
  onSearch: (searchParams: {
    tab: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export default function SearchCard({ onSearch }: SearchCardProps) {
  const [activeTab, setActiveTab] = useState<"hotels" | "camps" | "tours" | "packages">("hotels");
  
  // Tab-specific destination / experience state
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [tourSlot, setTourSlot] = useState("Sunset Safari (4:00 PM)");
  const [packageDuration, setPackageDuration] = useState("3 Days / 2 Nights");
  
  // Guest counts
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tents, setTents] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const guestPickerRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children;

  // Close guest picker on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(e.target as Node)) {
        setShowGuestPicker(false);
      }
    };
    if (showGuestPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestPicker]);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();

    let effectiveDestination = destination.trim();
    if (!effectiveDestination) {
      if (activeTab === "hotels") effectiveDestination = "Jaisalmer";
      else if (activeTab === "camps") effectiveDestination = "Sam Sand Dunes";
      else if (activeTab === "tours") effectiveDestination = "Desert Safari";
      else if (activeTab === "packages") effectiveDestination = "Royal Package";
    }

    const effectiveCheckOut = 
      activeTab === "tours" 
        ? tourSlot 
        : activeTab === "packages" 
          ? packageDuration 
          : checkOut;

    onSearch({
      tab: activeTab,
      destination: effectiveDestination,
      checkIn,
      checkOut: effectiveCheckOut,
      guests: totalGuests,
    });
  };

  const tabs = [
    { id: "hotels", label: "Hotels", icon: <Building2 size={15} /> },
    { id: "camps", label: "Camps", icon: <Tent size={15} /> },
    { id: "tours", label: "Tours", icon: <Compass size={15} /> },
    { id: "packages", label: "Packages", icon: <Package size={15} /> },
  ] as const;

  // Placeholder & labels based on active tab
  const getDestinationLabel = () => {
    switch (activeTab) {
      case "hotels": return "Destination / Stay";
      case "camps": return "Dunes / Camp Location";
      case "tours": return "Tour / Safari Activity";
      case "packages": return "Holiday Package";
    }
  };

  const getDestinationPlaceholder = () => {
    switch (activeTab) {
      case "hotels": return "Fort, Havelis, City...";
      case "camps": return "Sam Sand Dunes, Khuri...";
      case "tours": return "Camel Safari, Dune Bashing...";
      case "packages": return "Royal Desert 3D/2N, Honeymoon...";
    }
  };

  const getGuestSummary = () => {
    if (activeTab === "camps") {
      return `${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"} (${tents} ${tents === 1 ? "Tent" : "Tents"})`;
    }
    if (activeTab === "tours" || activeTab === "packages") {
      return `${totalGuests} ${totalGuests === 1 ? "Traveler" : "Travelers"}`;
    }
    return `${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`;
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto relative z-30">
      <div className="bg-white rounded-[6px] sm:rounded-[8px] p-3 sm:p-5 md:p-6 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.15)] border border-black/5">
        {/* Search Tabs */}
        <div className="flex items-center gap-3.5 sm:gap-6 border-b border-border-light pb-2.5 sm:pb-3 mb-3 sm:mb-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-sans font-medium py-1 sm:py-1.5 px-1 relative transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "text-gold-dark font-semibold after:absolute after:bottom-[-11px] sm:after:bottom-[-13px] after:left-0 after:right-0 after:h-[2.5px] after:bg-gold after:rounded-full"
                    : "text-text-muted hover:text-gold-dark"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setDestination("");
                }}
              >
                <span className={isActive ? "text-gold" : "text-text-muted"}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Form Fields */}
        <form onSubmit={handleSearchClick} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3.5 lg:gap-3">
          {/* Field 1: Destination / Stay / Tour */}
          <div className="flex-1 flex flex-col relative min-w-0 bg-[#fbf9f5] sm:bg-transparent p-2.5 sm:p-0 rounded-[5px] sm:rounded-none border border-border-light/70 sm:border-none">
            <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-0.5 sm:mb-1">
              {getDestinationLabel()}
            </span>
            <div className="flex items-center gap-2 py-0.5 sm:py-1">
              <MapPin size={15} className="text-gold shrink-0" />
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getDestinationPlaceholder()} 
                className="w-full border-none outline-none font-sans font-semibold text-xs sm:text-base text-text-main bg-transparent placeholder:text-text-muted/50 truncate"
              />
            </div>
          </div>

          <div className="hidden lg:block w-[1px] h-10 bg-border-light shrink-0 mx-1" />

          {/* Date & Slot Container for Mobile */}
          <div className="flex flex-col sm:flex-row lg:flex-1 gap-2.5 sm:gap-3">
            {/* Field 2: Date 1 (Check In / Tour Date / Start Date) */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-[#fbf9f5] sm:bg-transparent p-2.5 sm:p-0 rounded-[5px] sm:rounded-none border border-border-light/70 sm:border-none">
              <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-0.5 sm:mb-1">
                {activeTab === "tours" ? "Tour Date" : activeTab === "packages" ? "Start Date" : "Check In"}
              </span>
              <div className="flex items-center gap-2 py-0.5 sm:py-1">
                <Calendar size={15} className="text-gold shrink-0" />
                <input 
                  type={checkIn ? "date" : "text"} 
                  placeholder="Select date"
                  value={checkIn}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border-none outline-none font-sans font-semibold text-xs sm:text-base text-text-main bg-transparent placeholder:text-text-muted/50"
                />
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-10 bg-border-light shrink-0 mx-1" />

            {/* Field 3: Check Out OR Tour Slot OR Package Duration */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-[#fbf9f5] sm:bg-transparent p-2.5 sm:p-0 rounded-[5px] sm:rounded-none border border-border-light/70 sm:border-none">
              <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-0.5 sm:mb-1">
                {activeTab === "tours" 
                  ? "Safari Slot / Time" 
                  : activeTab === "packages" 
                    ? "Duration" 
                    : "Check Out"}
              </span>
              <div className="flex items-center gap-2 py-0.5 sm:py-1">
                {activeTab === "tours" ? (
                  <>
                    <Clock size={15} className="text-gold shrink-0" />
                    <select
                      value={tourSlot}
                      onChange={(e) => setTourSlot(e.target.value)}
                      className="w-full border-none outline-none font-sans font-semibold text-xs sm:text-base text-text-main bg-transparent cursor-pointer truncate"
                    >
                      <option value="Sunset Safari (4:00 PM)">Sunset Safari (4:00 PM)</option>
                      <option value="Sunrise Safari (5:30 AM)">Sunrise Safari (5:30 AM)</option>
                      <option value="Full Night Stargazing Safari">Full Night Safari</option>
                      <option value="Morning Fort & Havelis Tour">Morning Fort Tour</option>
                    </select>
                  </>
                ) : activeTab === "packages" ? (
                  <>
                    <Clock size={15} className="text-gold shrink-0" />
                    <select
                      value={packageDuration}
                      onChange={(e) => setPackageDuration(e.target.value)}
                      className="w-full border-none outline-none font-sans font-semibold text-xs sm:text-base text-text-main bg-transparent cursor-pointer truncate"
                    >
                      <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
                      <option value="2 Days / 1 Night">2 Days / 1 Night</option>
                      <option value="4 Days / 3 Nights">4 Days / 3 Nights</option>
                      <option value="Custom Tour Plan">Custom Tour Plan</option>
                    </select>
                  </>
                ) : (
                  <>
                    <Calendar size={15} className="text-gold shrink-0" />
                    <input 
                      type={checkOut ? "date" : "text"} 
                      placeholder="Select date"
                      value={checkOut}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border-none outline-none font-sans font-semibold text-xs sm:text-base text-text-main bg-transparent placeholder:text-text-muted/50"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-[1px] h-10 bg-border-light shrink-0 mx-1" />

          {/* Field 4: Guests / Travelers (Non-clipping Popover) */}
          <div className="flex-1 flex flex-col relative min-w-0 bg-[#fbf9f5] sm:bg-transparent p-2.5 sm:p-0 rounded-[5px] sm:rounded-none border border-border-light/70 sm:border-none" ref={guestPickerRef}>
            <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-0.5 sm:mb-1">
              {activeTab === "tours" || activeTab === "packages" ? "Travelers" : "Guests"}
            </span>
            <div 
              className="flex items-center gap-2 py-0.5 sm:py-1 cursor-pointer select-none"
              onClick={() => setShowGuestPicker(!showGuestPicker)}
            >
              <Users size={15} className="text-gold shrink-0" />
              <span className="font-sans font-semibold text-xs sm:text-base text-text-main truncate">
                {getGuestSummary()}
              </span>
            </div>

            {/* Non-clipping Guest Popover */}
            {showGuestPicker && (
              <div 
                className="absolute top-[calc(100%+8px)] left-0 right-0 sm:left-auto sm:right-0 bg-white shadow-2xl border border-border-light rounded-xl py-4 sm:py-5 px-4 z-[100] w-full sm:w-72 max-w-[calc(100vw-32px)] animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Adults */}
                <div className="flex items-center justify-between pb-2.5 border-b border-border-light/70 mb-2.5">
                  <div>
                    <div className="font-sans text-xs font-bold text-text-main">Adults</div>
                    <div className="font-sans text-[10px] text-text-muted">Ages 12+</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => { if (adults > 1) setAdults(adults - 1); }}
                      className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                      aria-label="Decrease adults"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-sans font-bold text-sm min-w-[18px] text-center text-text-main">{adults}</span>
                    <button 
                      type="button" 
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                      aria-label="Increase adults"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between pb-2.5 border-b border-border-light/70 mb-2.5">
                  <div>
                    <div className="font-sans text-xs font-bold text-text-main">Children</div>
                    <div className="font-sans text-[10px] text-text-muted">Ages 2–11</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => { if (children > 0) setChildren(children - 1); }}
                      className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                      aria-label="Decrease children"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-sans font-bold text-sm min-w-[18px] text-center text-text-main">{children}</span>
                    <button 
                      type="button" 
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                      aria-label="Increase children"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Tents (for Camps tab) */}
                {activeTab === "camps" && (
                  <div className="flex items-center justify-between pb-2.5 border-b border-border-light/70 mb-2.5">
                    <div>
                      <div className="font-sans text-xs font-bold text-text-main">Swiss Tents</div>
                      <div className="font-sans text-[10px] text-text-muted">Private luxury tents</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button 
                        type="button" 
                        onClick={() => { if (tents > 1) setTents(tents - 1); }}
                        className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                        aria-label="Decrease tents"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="font-sans font-bold text-sm min-w-[18px] text-center text-text-main">{tents}</span>
                      <button 
                        type="button" 
                        onClick={() => setTents(tents + 1)}
                        className="w-7 h-7 rounded-full border border-border-light bg-cream flex items-center justify-center text-text-main hover:border-gold hover:text-gold transition-colors"
                        aria-label="Increase tents"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="button"
                  className="w-full py-2 bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs rounded-full shadow-sm hover:from-gold hover:to-gold-dark transition-all mt-1"
                  onClick={() => setShowGuestPicker(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="pt-1 lg:pt-0 shrink-0">
            <button 
              type="submit" 
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-sm sm:text-base shadow-gold transition-all duration-300 hover:from-gold hover:to-gold-dark hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
