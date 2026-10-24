"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Play, Pause, Volume2, VolumeX, Sparkles, Clock } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useContent } from "@/context/ContentContext";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDining: () => void;
}

export default function VideoModal({ isOpen, onClose, onBookDining }: VideoModalProps) {
  const { formatPrice } = useCurrency();
  const { home } = useContent();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Lock body scroll when modal is open and handle Escape key
  React.useEffect(() => {
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1050] flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-border-light overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={17} />
        </button>

        {/* Video Canvas Simulation */}
        <div className="relative h-48 sm:h-72 md:h-80 w-full bg-black overflow-hidden">
          <Image
            src={home.videoImage}
            alt="Desert Dining Experience"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className={`object-cover transition-transform duration-[8000ms] ease-out ${isPlaying ? "scale-110" : "scale-100"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

          {/* Video Control Bar */}
          <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 flex items-center gap-2.5 sm:gap-3 z-10 text-white">
            <button 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors shrink-0" 
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5 fill-current" />}
            </button>
            <div className="flex-1 h-1 sm:h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full w-2/3 transition-all duration-300" />
            </div>
            <button 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors shrink-0" 
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 sm:p-7 md:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <div>
              <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gold block mb-0.5 sm:mb-1">
                SIGNATURE CULINARY EXPERIENCE
              </span>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-text-main leading-snug">
                Desert Dining Under the Stars
              </h3>
            </div>
            <div className="flex items-baseline gap-1 self-start sm:self-auto">
              <span className="font-sans text-xs text-text-muted">From</span>
              <span className="font-sans font-bold text-lg sm:text-xl text-gold">{formatPrice(4500)}</span>
              <span className="font-sans text-xs text-text-muted">/ couple</span>
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed mb-3.5 sm:mb-5">
            An intimate royal culinary feast in the midst of golden dunes. Bask under glowing glass lanterns, sip fine beverages, savor authentic Marwari delicacies prepared on-site by royal chefs, and listen to acoustic desert sarangi melodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2.5 sm:py-3.5 border-y border-border-light mb-4 sm:mb-6 text-xs font-sans text-text-main font-semibold">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gold shrink-0" />
              <span>7:00 PM - 10:30 PM Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-gold shrink-0" />
              <span>Private Candlelit Dune Canopy</span>
            </div>
          </div>

          <div>
            <button 
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-xs sm:text-sm shadow-gold hover:from-gold hover:to-gold-dark hover:shadow-lg transition-all cursor-pointer" 
              onClick={onBookDining}
            >
              Reserve Desert Dining Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
