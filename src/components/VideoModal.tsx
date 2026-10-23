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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl border border-border-light overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Video Canvas Simulation */}
        <div className="relative h-72 sm:h-88 w-full bg-black overflow-hidden">
          <Image
            src={home.videoImage}
            alt="Desert Dining Experience"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className={`object-cover transition-transform duration-[8000ms] ease-out ${isPlaying ? "scale-110" : "scale-100"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

          {/* Video Control Bar */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 z-10 text-white">
            <button 
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors shrink-0" 
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5 fill-current" />}
            </button>
            <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full w-2/3 transition-all duration-300" />
            </div>
            <button 
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors shrink-0" 
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold block mb-1">
                SIGNATURE CULINARY EXPERIENCE
              </span>
              <h3 className="font-serif text-2xl font-bold text-text-main">
                Desert Dining Under the Stars
              </h3>
            </div>
            <div className="flex items-baseline gap-1 self-start sm:self-auto">
              <span className="font-sans text-xs text-text-muted">From</span>
              <span className="font-sans font-bold text-xl text-gold">{formatPrice(4500)}</span>
              <span className="font-sans text-xs text-text-muted">/ couple</span>
            </div>
          </div>

          <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
            An intimate royal culinary feast in the midst of golden dunes. Bask under glowing glass lanterns, sip fine beverages, savor authentic Marwari delicacies prepared on-site by royal chefs, and listen to acoustic desert sarangi melodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3.5 border-y border-border-light mb-6 text-xs font-sans text-text-main font-semibold">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gold shrink-0" />
              <span>7:00 PM - 10:30 PM Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold shrink-0" />
              <span>Private Candlelit Dune Canopy</span>
            </div>
          </div>

          <div>
            <button 
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-light to-gold text-white font-sans font-semibold text-sm shadow-gold hover:from-gold hover:to-gold-dark hover:shadow-lg transition-all" 
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
