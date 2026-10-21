"use client";

import React from "react";
import Image from "next/image";
import { 
  ArrowRight, 
  Package, 
  Compass, 
  Users, 
  Heart, 
  Smile, 
  Briefcase 
} from "lucide-react";

interface TharMagicSectionProps {
  onPlanTripClick: () => void;
}

export default function TharMagicSection({ onPlanTripClick }: TharMagicSectionProps) {
  const highlights = [
    { label: "Custom Packages", icon: <Package size={16} /> },
    { label: "Private Tours", icon: <Compass size={16} /> },
    { label: "Group Bookings", icon: <Users size={16} /> },
    { label: "Honeymoon Special", icon: <Heart size={16} /> },
    { label: "Family Friendly", icon: <Smile size={16} /> },
    { label: "Corporate Trips", icon: <Briefcase size={16} /> },
  ];

  return (
    <section className="thar-magic-section">
      <div className="container">
        <div className="magic-grid">
          {/* Left: Atmospheric Photo of Woman on Sand Dune */}
          <div className="magic-photo-wrap">
            <div className="photo-card">
              <Image
                src="/images/thar-magic.jpg"
                alt="Woman traveler enjoying sunset over Thar desert sand dunes in Jaisalmer"
                fill
                className="magic-img"
                sizes="(max-width: 768px) 100vw, 550px"
              />
              <div className="photo-glow" />
            </div>
          </div>

          {/* Right: Content Block */}
          <div className="magic-content">
            <span className="magic-tag">A JOURNEY LIKE NO OTHER</span>
            
            <h2 className="magic-title">
              Feel the Magic<br />
              of the Thar Desert
            </h2>

            <p className="magic-desc">
              Golden sands, starry skies and unforgettable moments await you in Jaisalmer. Let us create a personalized itinerary for your perfect desert getaway.
            </p>

            <button className="btn-plan-trip" onClick={onPlanTripClick}>
              <span>Plan Your Trip</span>
              <ArrowRight size={16} />
            </button>

            {/* 2-Column Features */}
            <div className="features-grid">
              {highlights.map((feat, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">{feat.icon}</span>
                  <span className="feature-label">{feat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .thar-magic-section {
          padding: 85px 0 95px;
          background: #fbf8f2;
          position: relative;
          overflow: hidden;
        }

        .magic-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 65px;
          align-items: center;
        }

        .magic-photo-wrap {
          position: relative;
        }

        .photo-card {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
        }

        .magic-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .photo-card:hover .magic-img {
          transform: scale(1.04);
        }

        .photo-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(18, 48, 56, 0.3) 100%);
        }

        .magic-content {
          display: flex;
          flex-direction: column;
        }

        .magic-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--primary-gold);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .magic-title {
          font-family: var(--font-serif);
          font-size: 3.1rem;
          font-weight: 700;
          line-height: 1.15;
          color: #1a1918;
          margin-bottom: 18px;
          letter-spacing: -0.015em;
        }

        .magic-desc {
          font-size: 0.98rem;
          line-height: 1.65;
          color: var(--text-muted);
          margin-bottom: 28px;
          max-width: 500px;
        }

        .btn-plan-trip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          background: linear-gradient(135deg, var(--primary-gold-light) 0%, var(--primary-gold) 100%);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          width: fit-content;
          box-shadow: 0 6px 20px rgba(197, 125, 41, 0.35);
          transition: var(--transition);
          margin-bottom: 36px;
          position: relative;
          overflow: hidden;
        }

        .btn-plan-trip::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: skewX(-20deg);
          transition: none;
        }

        .btn-plan-trip:hover::after {
          left: 150%;
          transition: all 0.75s ease-in-out;
        }

        .btn-plan-trip:hover {
          background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(197, 125, 41, 0.45);
        }

        .btn-plan-trip:hover :global(svg) {
          transform: translateX(4px);
        }

        .btn-plan-trip :global(svg) {
          transition: transform 0.25s ease;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 216, 203, 0.7);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.25s ease;
        }

        .feature-item:hover {
          transform: translateX(4px);
        }

        .feature-item:hover .feature-icon {
          color: var(--primary-gold);
          transform: scale(1.18);
        }

        .feature-icon {
          color: #7b756b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        .feature-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: #383531;
        }

        @media (max-width: 960px) {
          .magic-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .photo-card {
            height: 380px;
          }
          .magic-title {
            font-size: 2.3rem;
          }
        }
      `}</style>
    </section>
  );
}
