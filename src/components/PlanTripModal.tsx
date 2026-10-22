"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle, Send } from "lucide-react";

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanTripModal({ isOpen, onClose }: PlanTripModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "2026-11-20",
    days: "3 Days / 2 Nights",
    guests: "2 Guests",
    preferences: ["Desert Luxury Camp", "Sunset Camel Safari"],
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const togglePreference = (pref: string) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists 
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref]
      };
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[5px] max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-7 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 border border-border-light" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-[5px] bg-cream border border-border-light flex items-center justify-center text-text-muted hover:text-text-main hover:bg-cream-alt hover:rotate-90 transition-all duration-300" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 px-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[5px] bg-cream flex items-center justify-center text-gold mx-auto mb-3 sm:mb-4">
              <CheckCircle size={38} className="text-gold" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-main mb-2">Khamma Ghani, {formData.name || "Traveler"}!</h3>
            <p className="font-sans text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed mb-5 sm:mb-6">
              Your custom Jaisalmer itinerary request has been received. Our local travel concierge will contact you on <strong className="text-text-main">{formData.phone || "WhatsApp"}</strong> within 30 minutes with personalized options.
            </p>
            <button 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold hover:from-gold hover:to-gold-dark transition-all active:scale-95" 
              onClick={onClose}
            >
              Explore More of Jaisalmer
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-4 sm:mb-6 pr-9 sm:pr-12">
              <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gold block mb-1">
                CUSTOM RAJASTHAN EXPERIENCE
              </span>
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-teal tracking-tight leading-tight">
                Plan Your Royal Jaisalmer Trip
              </h3>
              <p className="font-sans text-[11px] sm:text-xs md:text-sm text-text-muted mt-1 leading-relaxed">
                Tell us your dream holiday preferences and let our local experts design your personalized journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Expected Date of Arrival</label>
                  <input
                    type="date"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 3: Duration & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Duration</label>
                  <select 
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  >
                    <option>2 Days / 1 Night (Weekend Special)</option>
                    <option>3 Days / 2 Nights (Most Popular)</option>
                    <option>4 Days / 3 Nights (Complete Desert & Fort)</option>
                    <option>5+ Days (Royal Grand Tour)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">Travelers</label>
                  <select 
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    <option>Solo Traveler</option>
                    <option>Couple / 2 Guests</option>
                    <option>Family (3-5 Guests)</option>
                    <option>Group (6+ Guests)</option>
                  </select>
                </div>
              </div>

              {/* Preference Pills */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">
                  Experiences You Want Included
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    "Heritage Haveli Stay",
                    "Desert Luxury Camp",
                    "Sunset Camel Safari",
                    "4x4 Dune Bashing",
                    "Cultural Kalbelia Dance",
                    "Romantic Desert Dinner",
                    "Sonar Fort Guided Tour",
                    "Stargazing Night"
                  ].map((p) => {
                    const isSelected = formData.preferences.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[5px] font-sans text-[10px] sm:text-xs font-semibold transition-all active:scale-95 ${
                          isSelected 
                            ? "bg-gold text-white shadow-xs" 
                            : "bg-cream/60 text-text-main hover:bg-cream border border-border-light"
                        }`}
                        onClick={() => togglePreference(p)}
                      >
                        {isSelected && <Sparkles size={11} />}
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[11px] sm:text-xs font-semibold text-text-main">
                  Special Requests / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about special occasions (anniversary, birthday, food choices)..."
                  className="w-full px-3 sm:px-3.5 py-2 rounded-[5px] border border-border-light bg-cream/30 font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-gold focus:outline-none transition-colors resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                className="mt-1 sm:mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-[5px] bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold hover:from-gold hover:to-gold-dark hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <Send size={15} />
                <span>Get Free Itinerary & Custom Quote</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
