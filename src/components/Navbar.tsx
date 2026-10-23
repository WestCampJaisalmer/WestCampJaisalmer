"use client";

import { useContent } from "@/context/ContentContext";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  Building2, 
  Tent, 
  Compass, 
  Package, 
  MapPin, 
  Info, 
  Phone,
  MessageCircle,
  Camera
} from "lucide-react";

import { useCurrency, CURRENCY_LIST, CurrencyCode } from "@/context/CurrencyContext";

export const CURRENCIES = CURRENCY_LIST;

interface NavbarProps {
  onPlanTripClick: () => void;
  onSearchClick: () => void;
}

export default function Navbar({ onPlanTripClick, onSearchClick }: NavbarProps) {
  const { home } = useContent();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSubpage = !isHome;
  const isAboutPage = pathname === "/about" || pathname.startsWith("/about");
  const isContactPage = pathname === "/contact" || pathname.startsWith("/contact");
  const isCampsHotelsPage = 
    pathname === "/camps-hotels" || 
    pathname.startsWith("/camps-hotels");
  const isToursPlacesPage =
    pathname === "/tours-places" ||
    pathname.startsWith("/tours-places");
  const isPackagesPage =
    pathname === "/packages" ||
    pathname.startsWith("/packages");
  const isGalleryPage =
    pathname === "/gallery" ||
    pathname.startsWith("/gallery");

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(
    isGalleryPage
      ? "gallery"
      : isAboutPage
      ? "about"
      : isContactPage
      ? "contact"
      : isCampsHotelsPage
      ? "camps-hotels"
      : isToursPlacesPage
      ? "tours-places"
      : isPackagesPage
      ? "packages"
      : "home"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Determine active navigation item based on current page / section
  const isLinkActive = (linkId: string) => {
    if (isGalleryPage) return linkId === "gallery";
    if (isAboutPage) return linkId === "about";
    if (isContactPage) return linkId === "contact";
    if (isCampsHotelsPage) return linkId === "camps-hotels";
    if (isToursPlacesPage) return linkId === "tours-places";
    if (isPackagesPage) return linkId === "packages";
    if (isHome) return activeSection === linkId;
    return false;
  };

  useEffect(() => {
    if (isGalleryPage) {
      setActiveSection("gallery");
    } else if (isAboutPage) {
      setActiveSection("about");
    } else if (isContactPage) {
      setActiveSection("contact");
    } else if (isCampsHotelsPage) {
      setActiveSection("camps-hotels");
    } else if (isToursPlacesPage) {
      setActiveSection("tours-places");
    } else if (isPackagesPage) {
      setActiveSection("packages");
    } else if (isHome) {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["tours", "experiences", "packages", "destinations"].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("home");
      }
    }
  }, [pathname, isGalleryPage, isAboutPage, isContactPage, isCampsHotelsPage, isToursPlacesPage, isPackagesPage, isHome]);

  const navLinks = [
    { id: "home", href: isSubpage ? "/" : "#home", label: "Home", icon: Home },
    { id: "camps-hotels", href: "/camps-hotels", label: "Camps & Hotels", icon: Building2 },
    { id: "tours-places", href: "/tours-places", label: "Tours & Places", icon: Compass },
    { id: "packages", href: "/packages", label: "Packages", icon: Package, badge: "Popular" },
    { id: "gallery", href: "/gallery", label: "Gallery", icon: Camera },
    { id: "about", href: "/about", label: "About Us", icon: Info },
    { id: "contact", href: "/contact", label: "Contact", icon: Phone },
  ];

  const handleCurrencySelect = (code: string) => {
    setCurrency(code as CurrencyCode);
    setCurrencyDropdownOpen(false);
  };

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setCurrencyDropdownOpen(false);
      }
    };
    if (currencyDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currencyDropdownOpen]);

  // Scroll spy & navbar background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // On subpages (/about, /contact, /camps-hotels), the page itself must strictly remain active
      if (!isHome) {
        return;
      }

      // If at top of homepage, activate first item (home)
      if (window.scrollY < 120) {
        setActiveSection("home");
        return;
      }

      const sectionIds = ["home", "tours", "experiences", "packages", "destinations"];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 170 && rect.bottom >= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close dropdown or mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrencyDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/917877221729?text=Hello!%20I%20would%20like%20to%20plan%20a%20trip%20to%20Jaisalmer.", "_blank");
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-border-light" 
            : "bg-white/90 backdrop-blur-md py-2.5 sm:py-3.5 border-b border-border-light/60"
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 group shrink-0">
            <div className="relative w-14 h-9 sm:w-16 sm:h-10 md:w-20 md:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={home.logo}
                alt="West Camp Jaisalmer Sam"
                fill
                sizes="(max-width: 640px) 60px, (max-width: 1024px) 80px, 90px"
                className="object-contain object-left drop-shadow-xs"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-serif text-[15px] sm:text-lg md:text-xl font-bold text-[#123038] tracking-tight group-hover:text-[#C97F2C] transition-colors whitespace-nowrap">
                  West Camp
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 w-full">
                <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
                <span className="font-sans text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-bold tracking-[0.2em] sm:tracking-[0.24em] text-[#C97F2C] uppercase whitespace-nowrap">
                  Jaisalmer
                </span>
                <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.id);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    if (isHome) {
                      setActiveSection(link.id);
                    }
                  }}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-gold font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-gold"
                      : "text-[#4B4945] hover:text-gold hover:bg-[#FAF6F0]/60 rounded-[5px]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`px-[3px] py-[1.5px] text-[8px] font-[500] uppercase tracking-wider rounded-full border ${
                      isActive 
                        ? "bg-gold text-white border-gold" 
                        : "bg-gold/15 text-gold-dark border-gold/30"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools & CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button 
              type="button"
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 text-text-muted hover:text-text-main text-xs font-medium rounded-full sm:rounded-[5px] hover:bg-cream/70 transition-all group" 
              onClick={onSearchClick}
              aria-label="Search stays and tours"
              title="Search stays and tours"
            >
              <Search size={18} className="text-gold group-hover:scale-110 transition-transform" />
            </button>

            {/* Currency Selector */}
            <div className="relative" ref={currencyDropdownRef}>
              <button 
                type="button"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-[5px] border border-border-light font-sans text-xs font-semibold text-text-main hover:border-gold hover:text-gold transition-colors bg-white shadow-xs"
                onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                aria-label="Change currency"
                aria-expanded={currencyDropdownOpen}
              >
                <span>{currency}</span>
                <ChevronDown size={12} className={`text-text-muted transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {currencyDropdownOpen && (
                <div className="absolute top-[calc(100%+6px)] right-0 bg-white shadow-card border border-border-light rounded-[6px] py-1 z-50 w-28 sm:w-32 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      className={`px-3 py-1.5 text-left font-sans text-xs flex items-center justify-between transition-colors ${
                        cur.code === currency ? "bg-cream text-gold-dark font-bold" : "text-text-main hover:bg-cream/60"
                      }`}
                      onClick={() => handleCurrencySelect(cur.code)}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gold-dark font-mono font-bold w-3.5">{cur.symbol}</span>
                        <span>{cur.code}</span>
                      </span>
                      {cur.code === currency && (
                        <span className="text-gold font-bold text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Plan My Trip Button (Desktop / Tablet) */}
            <button 
              type="button"
              className="hidden md:inline-flex ml-2 xl:ml-4 items-center gap-2 px-4 sm:px-5 py-2 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-[14px] shadow-gold transition-all duration-300 hover:from-gold hover:to-gold-dark hover:-translate-y-0.5 hover:shadow-lg" 
              onClick={onPlanTripClick}
            >
              <Sparkles size={14} />
              <span>Plan My Trip</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              type="button"
              className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-full border transition-colors shadow-xs ${
                mobileMenuOpen 
                  ? "bg-gold text-white border-gold" 
                  : "bg-cream text-text-main border-border-light hover:bg-[#F2ECE1]"
              }`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Navigation Bar - Visible directly on mobile devices */}
        <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar border-t border-border-light/60 bg-white/95 mt-1">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.id);
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => {
                  if (isHome) {
                    setActiveSection(link.id);
                  }
                }}
                className={`shrink-0 px-2.5 py-1 rounded-[5px] text-[11px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#FAF4E8] text-gold font-bold border border-[#E4D1B8] shadow-xs"
                    : "text-text-main hover:text-gold bg-cream/60 border border-border-light/50"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Slide-over Mobile Navigation Drawer (Rendered outside <header> so fixed inset-0 covers 100% viewport) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-[#0B191E]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-border-light z-10">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-border-light flex items-center justify-between bg-cream/40">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-14 shrink-0">
                  <Image
                    src={home.logo}
                    alt="West Camp Jaisalmer Sam"
                    fill
                    sizes="60px"
                    className="object-contain object-left"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1 leading-none">
                    <span className="font-serif text-base font-bold text-[#123038]">
                      West Camp
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
                    <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
                    <span className="font-sans text-[7.5px] font-bold tracking-[0.2em] text-[#C97F2C] uppercase whitespace-nowrap">
                      Jaisalmer
                    </span>
                    <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="w-8 h-8 rounded-full bg-cream border border-border-light flex items-center justify-center text-text-muted hover:text-text-main hover:bg-[#F2ECE1] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
            </div>

            {/* Quick Search Action in Drawer */}
            <div className="px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSearchClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] bg-cream/70 border border-border-light text-text-muted text-xs hover:border-gold hover:text-text-main transition-all text-left"
              >
                <Search size={15} className="text-gold" />
                <span>Search hotels, camps, packages...</span>
              </button>
            </div>

            {/* Navigation Links with Icons */}
            <nav className="p-4 flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted/80 px-2 py-0.5">
                Explore Jaisalmer
              </span>

              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = isLinkActive(link.id);

                return (
                  <Link 
                    key={link.id}
                    href={link.href} 
                    onClick={() => {
                      if (isHome) {
                        setActiveSection(link.id);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-[#FAF4E8] text-gold font-bold border border-gold/40 shadow-xs" 
                        : "text-text-main hover:bg-[#FAF6F0]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[5px] flex items-center justify-center transition-colors ${
                        isActive ? "bg-gold text-white" : "bg-[#FAF4E8] text-gold"
                      }`}>
                        <IconComponent size={15} />
                      </div>
                      <span>{link.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {link.badge && (
                        <span className={`px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider rounded-[3px] border ${
                          isActive 
                            ? "bg-gold text-white border-gold" 
                            : "bg-gold/15 text-gold-dark border-gold/30"
                        }`}>
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className={isActive ? "text-gold" : "text-text-muted/60"} />
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions & Support in Drawer */}
            <div className="p-4 sm:p-5 border-t border-border-light bg-cream/30 space-y-3">
              {/* Primary Plan Trip CTA */}
              <button 
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-[6px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold hover:from-gold hover:to-gold-dark transition-all"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanTripClick();
                }}
              >
                <Sparkles size={15} /> 
                <span>Plan My Trip</span>
              </button>

              {/* Direct WhatsApp Callout */}
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[6px] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-sans font-semibold text-xs transition-colors"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp (+91 78772 21729)</span>
              </button>

              {/* Currency Picker in Mobile */}
              <div className="pt-2 text-xs border-t border-border-light/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-text-muted text-[11px] font-medium">Select Currency:</span>
                  <span className="text-gold font-bold text-[11px]">{CURRENCIES.find((c) => c.code === currency)?.label || currency}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      className={`py-1 px-1 rounded text-center text-[11px] font-semibold transition-all ${
                        currency === cur.code 
                          ? "bg-gold text-white shadow-xs font-bold" 
                          : "bg-white text-text-main border border-border-light hover:border-gold/50"
                      }`}
                      onClick={() => handleCurrencySelect(cur.code)}
                    >
                      {cur.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
