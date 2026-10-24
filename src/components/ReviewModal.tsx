"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Star, CheckCircle, Loader2, PenLine } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX = 1000;

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const reset = () => {
    setName(""); setCity(""); setEmail(""); setRating(0); setReview(""); setWebsite(""); setError(""); setDone(false);
  };
  const close = () => {
    onClose();
    if (done) setTimeout(reset, 200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, email, rating, review, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network problem. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const shown = hover || rating;

  // Portal to <body>: an ancestor with a transform would otherwise trap this "fixed" overlay inside its section.
  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1050] flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 md:p-8 relative shadow-2xl border border-border-light animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream flex items-center justify-center text-text-muted hover:bg-gold hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E8F8EE] flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle size={38} className="text-[#25A244]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal mb-2">Thank you for your review!</h3>
            <p className="font-sans text-xs sm:text-sm text-text-muted max-w-sm mx-auto leading-relaxed mb-5 sm:mb-6">
              We&apos;ve received your feedback. It will appear on our website once our team has approved it.
            </p>
            <button type="button" onClick={close} className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-white font-sans font-semibold text-xs sm:text-sm transition-colors cursor-pointer">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1 pr-9 sm:pr-10">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <PenLine size={18} />
              </span>
              <h3 id="review-title" className="font-serif text-lg sm:text-2xl font-bold text-teal leading-snug">Share your experience</h3>
            </div>
            <p className="font-sans text-[11px] sm:text-sm text-text-muted mb-3.5 sm:mb-5">
              Stayed or travelled with us? Tell other travellers what it was like.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-3 sm:gap-4" noValidate>
              {/* honeypot - hidden from people */}
              <div className="hidden" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>

              <div>
                <span className="block font-sans text-xs font-bold text-teal mb-1">Your rating *</span>
                <div className="flex items-center gap-0.5 sm:gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setRating(n)}
                      className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 sm:w-7 sm:h-7 ${n <= shown ? "fill-gold text-gold" : "text-[#D8CDB8]"}`} />
                    </button>
                  ))}
                  <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm font-semibold text-gold-dark min-w-[65px]">{LABELS[shown]}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <label className="flex flex-col gap-1">
                  <span className="font-sans text-xs font-bold text-teal">Your name *</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="Priya Sharma" className="w-full rounded-lg border border-[#DDD2BF] bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-sans text-xs font-bold text-teal">City / country</span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} placeholder="Delhi, India" className="w-full rounded-lg border border-[#DDD2BF] bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25" />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs font-bold text-teal">Email <span className="font-normal text-text-light">(optional, never shown publicly)</span></span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-[#DDD2BF] bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs font-bold text-teal">Your review *</span>
                <textarea value={review} onChange={(e) => setReview(e.target.value)} required rows={3} maxLength={MAX} placeholder="What did you enjoy most? The camp, the safari, the hospitality…" className="w-full rounded-lg border border-[#DDD2BF] bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 resize-y" />
                <span className="self-end font-sans text-[10px] sm:text-[11px] text-text-light">{review.length}/{MAX}</span>
              </label>

              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 sm:px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-sm font-medium text-red-700">{error}</p>
              )}

              <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold hover:bg-gold-dark text-white font-sans font-bold text-xs sm:text-sm py-2.5 sm:py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Star size={15} />}
                {sending ? "Submitting…" : "Submit review"}
              </button>
              <p className="text-center font-sans text-[10px] sm:text-[11px] text-text-light">Reviews are checked by our team before they are published.</p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
