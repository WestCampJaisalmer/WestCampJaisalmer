"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe, MessageCircle } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function Footer() {
  const { settings, home } = useContent();
  const phoneDigits = settings.phone.replace(/[^0-9]/g, "");
  return (
    <footer id="contact" className="relative bg-[#FAF6F0] border-t border-border-light pt-10 sm:pt-16 pb-8 overflow-hidden">
      {/* Background Image: footers.png with Heritage Fort Silhouette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/banners/footers.png"
          alt="Jaisalmer Heritage Fort Silhouette"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom opacity-85"
        />
        {/* Subtle gradient overlay to keep text ultra-crisp while fort skyline shines at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/85 via-[#FAF6F0]/55 to-[#FAF6F0]/30 pointer-events-none" />
      </div>

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-[#000000]">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-20 h-12 sm:w-24 sm:h-14 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={home.logo}
                  alt="West Camp Jaisalmer Sam"
                  fill
                  sizes="100px"
                  className="object-contain object-left drop-shadow-xs"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#123038] group-hover:text-[#C97F2C] transition-colors whitespace-nowrap">
                    West Camp
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1 w-full">
                  <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
                  <span className="font-sans text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.24em] text-[#C97F2C] uppercase whitespace-nowrap">
                    Jaisalmer
                  </span>
                  <span className="h-[1px] flex-1 bg-[#C97F2C]/70" />
                </div>
              </div>
            </Link>

            <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed mb-5 sm:mb-6 max-w-sm">
              Explore the Golden City with handpicked heritage havelis, luxury desert camps, thrilling desert safaris and authentic folk cultural experiences.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white/60 flex items-center justify-center text-text-muted hover:text-white hover:bg-gold hover:border-gold transition-all duration-300" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white/60 flex items-center justify-center text-text-muted hover:text-white hover:bg-gold hover:border-gold transition-all duration-300" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>}
              {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white/60 flex items-center justify-center text-text-muted hover:text-white hover:bg-gold hover:border-gold transition-all duration-300" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border-light bg-white/60 flex items-center justify-center text-text-muted hover:text-white hover:bg-gold hover:border-gold transition-all duration-300" aria-label="X (Twitter)">
                <Globe size={15} />
              </a>}
            </div>
          </div>

          {/* Quick Links & Explore: Side by side on mobile (grid-cols-2), 5 columns on desktop */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Column 2: Quick Links */}
            <div className="flex flex-col">
              <h4 className="font-serif font-bold text-sm sm:text-base text-text-main mb-3 sm:mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5 font-sans text-xs sm:text-sm text-text-muted">
                <li><Link href="/" className="hover:text-gold-dark transition-colors">Home</Link></li>
                <li><Link href="/camps-hotels" className="hover:text-gold-dark transition-colors font-medium text-gold-dark">Camps &amp; Hotels</Link></li>
                <li><Link href="/tours-places" className="hover:text-gold-dark transition-colors font-medium text-gold-dark">Tours &amp; Places</Link></li>
                <li><Link href="/packages" className="hover:text-gold-dark transition-colors font-medium text-gold-dark">Holiday Packages</Link></li>
                <li><Link href="/gallery" className="hover:text-gold-dark transition-colors font-medium text-gold-dark">Photo Gallery</Link></li>
                <li><Link href="/about" className="hover:text-gold-dark transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-gold-dark transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Explore */}
            <div className="flex flex-col">
              <h4 className="font-serif font-bold text-sm sm:text-base text-text-main mb-3 sm:mb-4">Explore</h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5 font-sans text-xs sm:text-sm text-text-muted">
                <li><Link href="/tours-places?type=places" className="hover:text-gold-dark transition-colors">Jaisalmer Fort</Link></li>
                <li><Link href="/tours-places?type=places" className="hover:text-gold-dark transition-colors">Sam Sand Dunes</Link></li>
                <li><Link href="/tours-places?type=places" className="hover:text-gold-dark transition-colors">Kuldhara Village</Link></li>
                <li><Link href="/tours-places?type=places" className="hover:text-gold-dark transition-colors">Gadisar Lake</Link></li>
                <li><Link href="/tours-places?type=tours" className="hover:text-gold-dark transition-colors">Desert Safari Tours</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="font-serif font-bold text-sm sm:text-base text-text-main mb-3 sm:mb-4">Contact Concierge</h4>
            <div className="flex flex-col gap-2.5 sm:gap-3 font-sans text-xs sm:text-sm text-text-muted">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <MessageCircle size={14} className="text-[#25D366] shrink-0 sm:w-[15px] sm:h-[15px]" />
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello!%20I%20would%20like%20to%20inquire%20about%20West%20Camp%20Jaisalmer.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-medium text-[#123038] transition-colors"
                >
                 {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Phone size={14} className="text-gold shrink-0 sm:w-[15px] sm:h-[15px]" />
                <a href={`tel:+${phoneDigits}`} className="hover:text-gold transition-colors">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Mail size={14} className="text-gold shrink-0 sm:w-[15px] sm:h-[15px]" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors truncate">{settings.email}</a>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <MapPin size={14} className="text-gold shrink-0 mt-0.5 sm:w-[15px] sm:h-[15px]" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 text-xs sm:text-[13px] font-sans text-text-muted text-center sm:text-left">
          <p>© {new Date().getFullYear()} Jaisalmer Travel & Experiences. All rights reserved.</p>
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px]">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
