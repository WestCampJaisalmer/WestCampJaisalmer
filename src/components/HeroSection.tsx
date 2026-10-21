"use client";

import React from "react";
import Image from "next/image";
import { Building2, Tent, Compass, Sparkles } from "lucide-react";
import SearchCard from "./SearchCard";

interface HeroSectionProps {
  onSearch: (params: any) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section id="home" className="hero-section">
      {/* Hero Background Image with Subtle Parallax Feel */}
      <div className="hero-bg-wrapper">
        <Image
          src="/images/hero-fort.jpg"
          alt="Jaisalmer Golden Fort at sunset with traditional rooftop terrace"
          fill
          priority
          className="hero-bg-img"
          sizes="100vw"
        />
        {/* Cinematic Golden Amber Vignette Overlay */}
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content-container">
        <div className="hero-text-block">
          {/* Eyebrow Tag */}
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">DISCOVER • EXPLORE • EXPERIENCE</span>
            <span className="eyebrow-line" />
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            <span className="hero-title-main">Jaisalmer</span>
            <span className="hero-title-sub">A Land of Golden Stories</span>
          </h1>

          {/* Description */}
          <p className="hero-desc">
            Heritage stays, luxury desert camps, thrilling tours and unforgettable experiences in the heart of Rajasthan.
          </p>

          {/* Category Feature Pills */}
          <div className="hero-pills">
            <a href="#hotels" className="hero-pill">
              <Building2 size={15} />
              <span>Heritage Hotels</span>
            </a>
            <a href="#camps" className="hero-pill">
              <Tent size={15} />
              <span>Desert Camps</span>
            </a>
            <a href="#tours" className="hero-pill">
              <Compass size={15} />
              <span>Guided Tours</span>
            </a>
            <a href="#experiences" className="hero-pill">
              <Sparkles size={15} />
              <span>Local Experiences</span>
            </a>
          </div>
        </div>

        {/* Script Badge Overlay on Right */}
        <div className="hero-script-tag">
          <span className="script-text">More than a<br />Destination</span>
        </div>
      </div>

      {/* Embedded Search Card Overlapping Hero Bottom */}
      <div className="hero-search-container">
        <SearchCard onSearch={onSearch} />
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 88vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 130px;
          padding-bottom: 50px;
        }

        .hero-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }

        .hero-bg-img {
          object-fit: cover;
          object-position: center 38%;
          transform: scale(1.02);
          animation: kenBurnsSlow 24s ease-in-out infinite alternate;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(18, 48, 56, 0.45) 0%,
            rgba(20, 24, 28, 0.2) 40%,
            rgba(18, 20, 24, 0.55) 85%,
            rgba(251, 248, 242, 1) 100%
          );
        }

        .hero-content-container {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 50px;
        }

        .hero-text-block {
          max-width: 680px;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .eyebrow-line {
          width: 24px;
          height: 1.5px;
          background: #df9745;
        }

        .eyebrow-text {
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #f7e0bb;
          text-transform: uppercase;
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .hero-title-main {
          font-family: var(--font-serif);
          font-size: 4.6rem;
          font-weight: 800;
          line-height: 1.05;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
        }

        .hero-title-sub {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 600;
          color: #fcf4e8;
          margin-top: 6px;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
        }

        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.92);
          margin-bottom: 24px;
          max-width: 540px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(18, 48, 56, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(223, 151, 69, 0.4);
          color: #fcf8f2;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          transition: var(--transition);
        }

        .hero-pill:hover {
          background: rgba(201, 127, 44, 0.85);
          border-color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        }

        .hero-script-tag {
          align-self: center;
          margin-right: 50px;
          margin-top: 20px;
          transform: rotate(-9deg);
          pointer-events: none;
          animation: floatBadge 4.5s ease-in-out infinite;
        }

        .script-text {
          font-family: var(--font-script), 'Caveat', cursive;
          font-size: 3.8rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          display: block;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(223, 151, 69, 0.5);
          letter-spacing: 0.02em;
        }

        .hero-search-container {
          position: relative;
          z-index: 20;
          padding: 0 24px;
          margin-top: 20px;
          animation: fadeInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }

        @media (max-width: 960px) {
          .hero-content-container {
            flex-direction: column;
            gap: 24px;
          }
          .hero-script-tag {
            display: none;
          }
          .hero-title-main {
            font-size: 3.2rem;
          }
          .hero-title-sub {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
}
