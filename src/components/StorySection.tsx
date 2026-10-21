"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Play, Star } from "lucide-react";

interface StorySectionProps {
  onVideoClick: () => void;
  onExploreClick: () => void;
}

export default function StorySection({ onVideoClick, onExploreClick }: StorySectionProps) {
  return (
    <section id="experiences" className="story-section">
      <div className="container">
        <div className="story-grid">
          {/* Left Column: Text & Stats */}
          <div className="story-text-col">
            <span className="story-tag">EXPERIENCE JAISALMER</span>
            
            <h2 className="story-title">
              Royal Heritage<br />
              Desert Adventures<br />
              Timeless Memories
            </h2>

            <p className="story-desc">
              From majestic forts to golden dunes, Jaisalmer offers a perfect blend of history, culture and adventure.
            </p>

            <button className="btn-explore" onClick={onExploreClick}>
              <span>Explore Jaisalmer</span>
              <ArrowRight size={18} />
            </button>

            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-card">
                <span className="stat-value">800+</span>
                <span className="stat-label">Happy Travelers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">50+</span>
                <span className="stat-label">Curated Experiences</span>
              </div>
              <div className="stat-card">
                <div className="stat-rating-val">
                  <span className="stat-value">4.8</span>
                  <Star size={16} className="star-icon" fill="#df9745" color="#df9745" />
                </div>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interlocking Image Collage */}
          <div className="story-collage-col">
            {/* Main Center Video Card */}
            <div className="main-video-card" onClick={onVideoClick}>
              <div className="video-img-wrapper">
                <Image
                  src="/images/desert-dining.jpg"
                  alt="Desert Dining Under the Stars"
                  fill
                  className="collage-img"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="img-overlay" />
              </div>

              {/* Central Play Button with Animated Radar Pulse Ring */}
              <div className="play-btn-circle" title="Play Video Preview">
                <div className="radar-pulse-ring" />
                <Play size={20} fill="#123038" color="#123038" className="play-icon" />
              </div>

              <div className="card-badge-bottom">
                <span>Desert Dining Under the Stars</span>
              </div>
            </div>

            {/* Top Overlapping Card: Luxury Camps */}
            <div className="sub-card top-sub-card">
              <div className="sub-img-wrapper">
                <Image
                  src="/images/luxury-tent.jpg"
                  alt="Luxury Camps in Jaisalmer"
                  fill
                  className="collage-img"
                  sizes="220px"
                />
                <div className="img-overlay-sub" />
              </div>
              <div className="card-badge-sub">
                <span>Luxury Camps</span>
              </div>
            </div>

            {/* Bottom Overlapping Card: Camel Safari */}
            <div className="sub-card bottom-sub-card">
              <div className="sub-img-wrapper">
                <Image
                  src="/images/camel-safari.jpg"
                  alt="Camel Safari in Thar Desert"
                  fill
                  className="collage-img"
                  sizes="240px"
                />
                <div className="img-overlay-sub" />
              </div>
              <div className="card-badge-sub">
                <span>Camel Safari</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .story-section {
          padding: 90px 0 100px;
          background: var(--desert-sand);
          position: relative;
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .story-text-col {
          display: flex;
          flex-direction: column;
        }

        .story-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--primary-gold);
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .story-title {
          font-family: var(--font-serif);
          font-size: 3.1rem;
          font-weight: 700;
          line-height: 1.15;
          color: #1a1918;
          margin-bottom: 20px;
          letter-spacing: -0.015em;
        }

        .story-desc {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--text-muted);
          max-width: 480px;
          margin-bottom: 32px;
        }

        .btn-explore {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 28px;
          background: #c57d29;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          box-shadow: 0 6px 20px rgba(197, 125, 41, 0.35);
          width: fit-content;
          transition: var(--transition);
        }

        .btn-explore:hover {
          background: #b16c1f;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(197, 125, 41, 0.45);
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 36px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(226, 216, 203, 0.6);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: #1a1918;
          line-height: 1.1;
        }

        .stat-rating-val {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Image Collage */
        .story-collage-col {
          position: relative;
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-video-card {
          position: relative;
          width: 380px;
          height: 270px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.16);
          cursor: pointer;
          transition: transform 0.4s ease;
          border: 4px solid #ffffff;
          z-index: 2;
        }

        .main-video-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
        }

        .main-video-card:hover .collage-img {
          transform: scale(1.06);
        }

        .video-img-wrapper {
          position: absolute;
          inset: 0;
        }

        .collage-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
        }

        .play-btn-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28);
          transition: var(--transition);
          z-index: 5;
        }

        .radar-pulse-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.85);
          animation: pulseRadar 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          pointer-events: none;
        }

        .play-btn-circle .play-icon {
          margin-left: 3px;
          transition: var(--transition);
        }

        .main-video-card:hover .play-btn-circle {
          background: var(--primary-gold);
          transform: translate(-50%, -50%) scale(1.12);
          box-shadow: 0 8px 25px rgba(201, 127, 44, 0.5);
        }

        .main-video-card:hover .play-btn-circle :global(.play-icon) {
          fill: #ffffff !important;
          color: #ffffff !important;
        }

        .card-badge-bottom {
          position: absolute;
          bottom: 14px;
          left: 16px;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
          z-index: 4;
        }

        .sub-card {
          position: absolute;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.14);
          border: 3px solid #ffffff;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .sub-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
        }

        .sub-card:hover .collage-img {
          transform: scale(1.08);
        }

        .top-sub-card {
          top: 0;
          right: 10px;
          width: 200px;
          height: 140px;
          z-index: 3;
        }

        .bottom-sub-card {
          bottom: 0;
          right: 20px;
          width: 220px;
          height: 150px;
          z-index: 3;
        }

        .sub-img-wrapper {
          position: absolute;
          inset: 0;
        }

        .img-overlay-sub {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
        }

        .card-badge-sub {
          position: absolute;
          bottom: 10px;
          left: 12px;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        }

        .collage-img {
          object-fit: cover;
        }

        @media (max-width: 960px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }
          .story-title {
            font-size: 2.4rem;
          }
          .story-collage-col {
            min-height: 380px;
          }
          .main-video-card {
            width: 320px;
            height: 220px;
          }
          .top-sub-card {
            width: 170px;
            height: 120px;
            right: 0;
          }
          .bottom-sub-card {
            width: 180px;
            height: 130px;
            right: 10px;
          }
        }

        @media (max-width: 500px) {
          .top-sub-card, .bottom-sub-card {
            display: none;
          }
          .main-video-card {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
