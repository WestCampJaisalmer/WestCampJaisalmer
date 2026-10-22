"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, MapPin, Check, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

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
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !item) return null;

  const basePrice = item.price || 2500;
  const totalPrice = type === "tour" || type === "package" ? basePrice * guests : basePrice * nights;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-[5px] max-w-xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-border-light overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {confirmed ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-gold mx-auto mb-4">
              <ShieldCheck size={44} className="text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-text-main mb-2">Reservation Confirmed!</h3>
            <p className="font-sans text-sm text-text-muted max-w-md mx-auto leading-relaxed mb-6">
              Your booking for <strong className="text-text-main">{item.name || item.title}</strong> has been secured. A voucher with check-in instructions and booking ID <strong className="text-gold">#JSMR-{Math.floor(100000 + Math.random() * 900000)}</strong> has been prepared.
            </p>

            <div className="p-4 rounded-xl bg-cream/70 border border-border-light mb-6 flex flex-col gap-2.5 text-xs font-sans text-left">
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-text-muted">Property / Tour</span>
                <strong className="text-text-main">{item.name || item.title}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-text-muted">Location</span>
                <span className="text-text-main">{item.location || item.distance || "Jaisalmer, Rajasthan"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-light">
                <span className="text-text-muted">{type === "tour" ? "Travelers" : "Duration & Guests"}</span>
                <span className="text-text-main">{type === "tour" ? `${guests} Persons` : `${nights} Nights, ${guests} Guests`}</span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-text-main">Total Amount</span>
                <span className="text-gold text-base">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button 
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-sm shadow-gold hover:from-gold hover:to-gold-dark transition-all" 
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Top Media Banner */}
            <div className="relative h-56 sm:h-64 w-full bg-black overflow-hidden">
              <Image
                src={item.image}
                alt={item.name || item.title}
                fill
                sizes="(max-width: 768px) 100vw, 660px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal/95 via-teal/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col">
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light mb-1">
                  {type === "hotel" ? "Heritage Stay" : type === "camp" ? "Desert Camp" : type === "tour" ? "Tour & Activity" : "Attraction"}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white drop-shadow">
                  {item.name || item.title}
                </h3>
                {item.location && (
                  <p className="flex items-center gap-1.5 font-sans text-xs text-white/80 mt-1">
                    <MapPin size={13} className="text-gold-light" />
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
                    <Star size={14} className="fill-gold text-gold" />
                    <strong className="text-text-main">{item.rating}</strong>
                    <span className="text-text-muted">({item.reviews || 150} reviews)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck size={14} /> Verified Experience
                  </span>
                </div>
              )}

              <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
                {item.description}
              </p>

              {/* Amenities / Highlights */}
              {item.amenities && (
                <div className="mb-5">
                  <h4 className="font-serif font-bold text-sm text-text-main mb-2.5">Featured Inclusions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {item.amenities.map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-[5px] bg-cream/70 border border-border-light font-sans text-xs text-text-main font-medium">
                        <Check size={13} className="text-gold shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Selection Box */}
              {type !== "destination" && (
                <div className="p-4 rounded-xl bg-cream border border-border-light flex flex-col gap-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    {type !== "tour" ? (
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[11px] font-bold text-text-muted uppercase">Stay Duration</label>
                        <select 
                          value={nights} 
                          onChange={(e) => setNights(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-[5px] border border-border-light bg-white font-sans text-xs font-semibold text-text-main focus:border-gold outline-none"
                        >
                          <option value={1}>1 Night</option>
                          <option value={2}>2 Nights (Recommended)</option>
                          <option value={3}>3 Nights</option>
                          <option value={5}>5 Nights</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[11px] font-bold text-text-muted uppercase">Preferred Time</label>
                        <select className="w-full px-3 py-2 rounded-[5px] border border-border-light bg-white font-sans text-xs font-semibold text-text-main focus:border-gold outline-none">
                          <option>Sunrise Safari (05:30 AM)</option>
                          <option>Golden Sunset Safari (04:30 PM)</option>
                          <option>Night Stargazing (08:00 PM)</option>
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[11px] font-bold text-text-muted uppercase">Guests</label>
                      <select 
                        value={guests} 
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-[5px] border border-border-light bg-white font-sans text-xs font-semibold text-text-main focus:border-gold outline-none"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={6}>6+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-light/80">
                    <div className="flex flex-col">
                      <span className="font-sans text-[11px] text-text-muted">Total Payable:</span>
                      <span className="font-sans font-bold text-xl text-gold">{formatPrice(totalPrice)}</span>
                      <span className="font-sans text-[10px] text-text-muted">Inclusive of taxes & fees</span>
                    </div>

                    <button 
                      className="inline-flex items-center justify-center px-7 py-3 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-sm shadow-gold hover:from-gold hover:to-gold-dark hover:shadow-lg transition-all" 
                      onClick={handleConfirm}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
