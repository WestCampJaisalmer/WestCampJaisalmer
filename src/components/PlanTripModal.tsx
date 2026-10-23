"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle, MessageCircle } from "lucide-react";
import { openWhatsApp, getWhatsAppUrl } from "@/utils/whatsapp";
import { recordEnquiry } from "@/utils/enquiry";

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanTripModal({ isOpen, onClose }: PlanTripModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "2026-11-23",
    days: "3 Days / 2 Nights",
    guests: "2 Guests",
    preferences: ["Desert Luxury Camp", "Sunset Camel Safari"],
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `🌟 *CUSTOM TOUR PLAN INQUIRY - WEST CAMP JAISALMER* 🌟

👤 *Traveler Name:* ${formData.name.trim() || "Traveler"}
📱 *Phone / WhatsApp:* ${formData.phone.trim()}
📧 *Email:* ${formData.email.trim() || "Not provided"}
📅 *Expected Arrival:* ${formData.date}
⏳ *Trip Duration:* ${formData.days}
👥 *Number of Guests:* ${formData.guests}
✨ *Experiences Requested:*
${formData.preferences.map((p) => `  • ${p}`).join("\n")}
${formData.notes.trim() ? `\n📝 *Special Notes:* ${formData.notes.trim()}` : ""}

_Please share custom tour plan options and pricing._`;

    const url = getWhatsAppUrl(message);
    setLastWhatsAppUrl(url);
    recordEnquiry({
      type: "plan_trip",
      name: formData.name.trim() || "Website visitor",
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      subject: "Custom trip plan",
      message: formData.notes.trim() || undefined,
      details: {
        expectedArrival: formData.date,
        tripDuration: formData.days,
        guests: formData.guests,
        experiences: formData.preferences,
      },
    });
    openWhatsApp(message);
    setSubmitted(true);
  };

  const togglePreference = (pref: string) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref],
      };
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-7 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 border border-border-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream border border-border-light flex items-center justify-center text-text-muted hover:text-text-main hover:bg-cream-alt transition-all duration-300 cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 px-2">
            <div className="w-16 h-16 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#25D366] mx-auto mb-3 sm:mb-4">
              <CheckCircle size={40} className="text-[#25D366]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123038] mb-2">
              {formData.name || "Traveler"}, Your Request Is Submitted!
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#5C5A55] max-w-md mx-auto leading-relaxed mb-5 sm:mb-6">
              Your custom tour plan request has been successfully submitted. Our
              local concierge will contact you shortly on WhatsApp with
              personalized tour options and direct quotes.
            </p>

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
            {/* Modal Header */}
            <div className="mb-4 sm:mb-6 pr-9 sm:pr-12">
              <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#AF6E26] block mb-1">
                CUSTOM RAJASTHAN EXPERIENCE
              </span>
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-[#123038] tracking-tight leading-tight">
                Plan Your Royal Jaisalmer Trip
              </h3>
              <p className="font-sans text-[11px] sm:text-xs md:text-sm text-[#6C675E] mt-1 leading-relaxed">
                Tell us your holiday preferences and get an instant custom quote
                directly on WhatsApp from our local team.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4"
            >
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 78772 21729"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 2: Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Expected Date of Arrival
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 3: Duration & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Duration
                  </label>
                  <select
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors cursor-pointer"
                    value={formData.days}
                    onChange={(e) =>
                      setFormData({ ...formData, days: e.target.value })
                    }
                  >
                    <option>2 Days / 1 Night (Weekend Special)</option>
                    <option>3 Days / 2 Nights (Most Popular)</option>
                    <option>4 Days / 3 Nights (Complete Desert & Fort)</option>
                    <option>5+ Days (Royal Grand Tour)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                    Travelers
                  </label>
                  <select
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors cursor-pointer"
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
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
                <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
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
                    "Stargazing Night",
                  ].map((p) => {
                    const isSelected = formData.preferences.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-sans text-[10px] sm:text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? "bg-[#C97F2C] text-white shadow-xs"
                            : "bg-[#FAF6F0] text-[#123038] hover:bg-[#F2ECE1] border border-border-light"
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
                <label className="font-sans text-[11px] sm:text-xs font-semibold text-[#123038]">
                  Special Requests / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about special occasions (anniversary, birthday, food choices)..."
                  className="w-full px-3 sm:px-3.5 py-2 rounded-lg border border-border-light bg-[#FAF6F0] font-sans text-xs sm:text-sm text-text-main focus:bg-white focus:border-[#C97F2C] focus:outline-none transition-colors resize-none"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="mt-1 sm:mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle size={17} />
                <span>Get Tour Plan on WhatsApp</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
