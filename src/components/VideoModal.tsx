"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Play, Pause, Volume2, VolumeX, Sparkles, Calendar, Clock } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDining: () => void;
}

export default function VideoModal({ isOpen, onClose, onBookDining }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content video-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Video Canvas Simulation */}
        <div className="video-viewport">
          <Image
            src="/images/desert-dining.jpg"
            alt="Desert Dining Experience"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className={`video-media ${isPlaying ? "video-active" : ""}`}
          />
          <div className="video-vignette" />

          {/* Ambient Animation Sparks */}
          <div className="floating-ember-1" />
          <div className="floating-ember-2" />
          <div className="floating-ember-3" />

          {/* Video Control Bar */}
          <div className="video-controls">
            <button 
              className="ctrl-btn" 
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="progress-bar-wrap">
              <div className="progress-fill" />
            </div>
            <button 
              className="ctrl-btn" 
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Video Details */}
        <div className="video-info-box">
          <div className="info-top">
            <div>
              <span className="dining-tag">SIGNATURE CULINARY EXPERIENCE</span>
              <h3 className="dining-title">Desert Dining Under the Stars</h3>
            </div>
            <div className="dining-price">
              <span className="from-text">From</span>
              <span className="amt">₹4,500</span>
              <span className="unit">/ couple</span>
            </div>
          </div>

          <p className="dining-desc">
            An intimate royal culinary feast in the midst of golden dunes. Bask under glowing glass lanterns, sip fine beverages, savor authentic Marwari delicacies prepared on-site by royal chefs, and listen to acoustic desert sarangi melodies.
          </p>

          <div className="dining-meta-grid">
            <div className="dining-meta-item">
              <Clock size={16} color="#c57d29" />
              <span>7:00 PM - 10:30 PM Daily</span>
            </div>
            <div className="dining-meta-item">
              <Sparkles size={16} color="#c57d29" />
              <span>Private Candlelit Dune Canopy</span>
            </div>
          </div>

          <div className="dining-action-row">
            <button className="btn-primary" onClick={onBookDining}>
              Reserve Desert Dining Table
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-modal {
          max-width: 720px;
          padding: 0;
          overflow: hidden;
          background: #ffffff;
        }

        .video-viewport {
          position: relative;
          height: 380px;
          width: 100%;
          background: #000000;
          overflow: hidden;
        }

        .video-media {
          object-fit: cover;
          transition: transform 10s ease-in-out;
        }

        .video-active {
          transform: scale(1.08);
        }

        .video-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.65) 100%);
        }

        .floating-ember-1,
        .floating-ember-2,
        .floating-ember-3 {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fef08a;
          box-shadow: 0 0 10px #f59e0b;
          animation: floatUp 3s infinite ease-in-out;
        }

        .floating-ember-1 {
          bottom: 20%;
          left: 30%;
          animation-delay: 0.2s;
        }

        .floating-ember-2 {
          bottom: 15%;
          left: 55%;
          animation-delay: 1.1s;
        }

        .floating-ember-3 {
          bottom: 25%;
          left: 70%;
          animation-delay: 1.8s;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-90px) scale(1.3); opacity: 0; }
        }

        .video-controls {
          position: absolute;
          bottom: 16px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          color: #ffffff;
        }

        .ctrl-btn {
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-bar-wrap {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          width: 45%;
          height: 100%;
          background: var(--primary-gold);
          border-radius: 2px;
          animation: progressAnim 8s infinite linear;
        }

        @keyframes progressAnim {
          0% { width: 10%; }
          100% { width: 100%; }
        }

        .video-info-box {
          padding: 24px 28px 30px;
        }

        .info-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .dining-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--primary-gold);
          text-transform: uppercase;
        }

        .dining-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-main);
          margin-top: 3px;
        }

        .dining-price {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .from-text {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .amt {
          font-size: 1.4rem;
          font-weight: 700;
          color: #c57d29;
          line-height: 1.1;
        }

        .unit {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .dining-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #55524e;
          margin-bottom: 18px;
        }

        .dining-meta-grid {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          padding: 12px 16px;
          background: var(--desert-sand);
          border-radius: var(--radius-sm);
        }

        .dining-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #383531;
        }

        .dining-action-row {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
