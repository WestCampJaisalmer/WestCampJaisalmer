"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, MapPin, Check, ShieldCheck, MessageCircle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { openWhatsApp, getWhatsAppUrl } from "@/utils/whatsapp";

interface BookingModalProps {
  item: any;
  type: "hotel" | "camp" | "tour" | "destination" | "package" | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ item, type, isOpen, onClose }: BookingModalProps) {
  const { formatPrice } = useCurrency();
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [selectedTourTime, setSelectedTourTime] = useState("Golden Sunset Safari (04:30 PM)");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState("");

  if (!isOpen || !item) return null;

  const basePrice = item.price || 2500;
  const totalPrice = type === "tour" || type === "package" ? basePrice * guests : basePrice * nights;

  const buildWhatsAppMessage = () => {
    const propertyName = item.name || item.title || "Jaisalmer Experience";
    const propertyLocation = item.location || item.distance || "Jaisalmer, Rajasthan";
    const category =
      type === "hotel"
        ? "Heritage Stay / Haveli"
        : type === "camp"
        ? "Desert Camp & Swiss Tent"
        : type === "tour"
        ? "Tour & Desert Safari"
        : type === "package"
        ? "Holiday Package"
        : "Sightseeing Attraction";

    const durationOrTime =
      type === "tour"
        ? selectedTourTime
        : type === "package"
        ? item.duration || "Multi-Day Tour Plan"
        : `${nights} Night${nights > 1 ? "s" : ""}`;

    return `🏰 *BOOKING RESERVATION - WEST CAMP JAISALMER* 🏰

🏷️ *Property / Tour:* ${propertyName}
📍 *Location:* ${propertyLocation}
✨ *Category:* ${category}
📅 *Duration / Slot:* ${durationOrTime}
👥 *Guests:* ${guests} ${guests === 1 ? "Person" : "Persons"}
💰 *Total Payable:* ${formatPrice(totalPrice)}
👤 *Guest Name:* ${guestName.trim() || "Traveler"}
📱 *Phone / WhatsApp:* ${guestPhone.trim() || "Connected on Chat"}

_Please confirm availability and share payment/check-in instructions._`;
  };

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = buildWhatsAppMessage();
    const url = getWhatsAppUrl(msg);
    setLastWhatsAppUrl(url);
    openWhatsApp(msg);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-border-light overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {confirmed ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#25D366] mx-auto mb-4">
              <ShieldCheck size={44} className="text-[#25D366]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#123038] mb-1.5">Reservation Sent on WhatsApp!</h3>
            <p className="font-sans text-xs sm:text-sm text-[#5C5A55] max-w-md mx-auto leading-relaxed mb-5">
              Your booking request for <strong className="text-[#123038]">{item.name || item.title}</strong> has been created. Our reservation desk has received the details on WhatsApp and will reply promptly.
            </p>

            <div className="p-4 rounded-xl bg-cream/70 border border-border-light mb-6 flex flex-col gap-2.5 text-xs font-sans text-left">
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-[#7D776E]">Property / Tour</span>
                <strong className="text-[#123038]">{item.name || item.title}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-[#7D776E]">Location</span>
                <span className="text-[#123038]">{item.location || item.distance || "Jaisalmer, Rajasthan"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-[#7D776E]">{type === "tour" ? "Travelers" : "Duration & Guests"}</span>
                <span className="text-[#123038]">{type === "tour" ? `${guests} Persons` : `${nights} Nights, ${guests} Guests`}</span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-[#123038]">Total Amount</span>
                <span className="text-[#AF6E26] text-base">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              {lastWhatsAppUrl && (
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
              <button 
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-lg bg-[#123038] hover:bg-[#1a434e] text-white font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer" 
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Media Banner */}
            <div className="relative h-52 sm:h-60 w-full bg-black overflow-hidden">
              <Image
                src={item.image}
                alt={item.name || item.title}
                fill
                sizes="(max-width: 768px) 100vw, 660px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123038] via-[#123038]/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col">
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#DF9745] mb-1">
                  {type === "hotel" ? "Heritage Stay" : type === "camp" ? "Desert Camp" : type === "tour" ? "Tour & Activity" : "Attraction"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow">
                  {item.name || item.title}
                </h3>
                {item.location && (
                  <p className="flex items-center gap-1.5 font-sans text-xs text-white/90 mt-1">
                    <MapPin size={13} className="text-[#DF9745]" />
                    <span>{item.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex flex-col">
              {item.rating && (
                <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border-light text-xs font-sans">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="fill-[#C97F2C] text-[#C97F2C]" />
                    <strong className="text-text-main">{item.rating}</strong>
                    <span className="text-[#7D776E]">({item.reviews || 150} reviews)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                    <ShieldCheck size={14} /> Direct WhatsApp Confirmation
                  </span>
                </div>
              )}

              <p className="font-sans text-xs sm:text-sm text-[#5C5A55] leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Amenities / Highlights */}
              {item.amenities && (
                <div className="mb-4">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#123038] mb-2">Featured Inclusions</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.amenities.map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-md bg-[#FAF6F0] border border-[#EFE6D6] font-sans text-xs text-[#403E3A] font-medium">
                        <Check size={13} className="text-[#C97F2C] shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Selection Form */}
              {type !== "destination" && (
                <form onSubmit={handleConfirm} className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DEC9] flex flex-col gap-3.5 mt-1">
                  {/* Row 1: Duration / Time & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {type !== "tour" ? (
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[11px] font-bold text-[#7D776E] uppercase">Stay Duration</label>
                        <select 
                          value={nights} 
                          onChange={(e) => setNights(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-[#DECDB3] bg-white font-sans text-xs font-semibold text-[#123038] focus:border-[#C97F2C] outline-none cursor-pointer"
                        >
                          <option value={1}>1 Night</option>
                          <option value={2}>2 Nights (Recommended)</option>
                          <option value={3}>3 Nights</option>
                          <option value={5}>5 Nights</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[11px] font-bold text-[#7D776E] uppercase">Preferred Time</label>
                        <select 
                          value={selectedTourTime}
                          onChange={(e) => setSelectedTourTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#DECDB3] bg-white font-sans text-xs font-semibold text-[#123038] focus:border-[#C97F2C] outline-none cursor-pointer"
                        >
                          <option value="Sunrise Safari (05:30 AM)">Sunrise Safari (05:30 AM)</option>
                          <option value="Golden Sunset Safari (04:30 PM)">Golden Sunset Safari (04:30 PM)</option>
                          <option value="Night Stargazing (08:00 PM)">Night Stargazing (08:00 PM)</option>
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[11px] font-bold text-[#7D776E] uppercase">Guests</label>
                      <select 
                        value={guests} 
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-[#DECDB3] bg-white font-sans text-xs font-semibold text-[#123038] focus:border-[#C97F2C] outline-none cursor-pointer"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={6}>6+ Guests</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Guest Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[11px] font-bold text-[#7D776E] uppercase">Your Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#DECDB3] bg-white font-sans text-xs text-[#123038] focus:border-[#C97F2C] outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[11px] font-bold text-[#7D776E] uppercase">WhatsApp Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 78772 21729"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#DECDB3] bg-white font-sans text-xs text-[#123038] focus:border-[#C97F2C] outline-none"
                      />
                    </div>
                  </div>

                  {/* Price & Submit Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E8DEC9]">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10.5px] text-[#7D776E] font-medium">Estimated Payable:</span>
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#123038]">{formatPrice(totalPrice)}</span>
                      <span className="font-sans text-[10px] text-[#7D776E]">Direct WhatsApp confirmation</span>
                    </div>

                    <button 
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer" 
                    >
                      <MessageCircle size={17} />
                      <span>Book on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
