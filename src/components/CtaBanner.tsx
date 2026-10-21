"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CtaBannerProps {
  onQuoteClick: () => void;
}

export default function CtaBanner({ onQuoteClick }: CtaBannerProps) {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919876543210?text=Hello!%20I%20would%20like%20to%20plan%20a%20trip%20to%20Jaisalmer.", "_blank");
  };

  return (
    <section className="cta-banner-section">
      {/* Background Image */}
      <div className="cta-bg-wrap">
        <Image
          src="/images/royal-camp.jpg"
          alt="Jaisalmer Thar desert at night with lanterns"
          fill
          className="cta-bg-img"
          sizes="100vw"
        />
        <div className="cta-overlay" />
      </div>

      <div className="container cta-content-container">
        <div className="cta-box">
          <h2 className="cta-title">Plan Your Jaisalmer Getaway Today</h2>
          <p className="cta-subtitle">
            Hotels, Camps, Tours and Unique Experiences — All in One Place.
          </p>

          <div className="cta-btn-group">
            <button className="btn-quote" onClick={onQuoteClick}>
              <span>Get a Free Quote</span>
              <ArrowRight size={16} />
            </button>

            <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
              <div className="whatsapp-icon-wrap">
                {/* Official WhatsApp SVG Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cta-banner-section {
          position: relative;
          padding: 85px 0;
          overflow: hidden;
        }

        .cta-bg-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .cta-bg-img {
          object-fit: cover;
          object-position: center 70%;
          animation: kenBurnsSlow 24s ease-in-out infinite alternate;
        }

        .cta-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(18, 48, 56, 0.75) 0%,
            rgba(11, 26, 31, 0.85) 100%
          );
        }

        .cta-content-container {
          position: relative;
          z-index: 5;
        }

        .cta-box {
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: var(--font-serif);
          font-size: 2.6rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: -0.015em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        .cta-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 32px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .cta-btn-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-quote {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 30px;
          background: linear-gradient(135deg, var(--primary-gold-light) 0%, var(--primary-gold) 100%);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          box-shadow: 0 6px 20px rgba(197, 125, 41, 0.4);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .btn-quote::after {
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

        .btn-quote:hover::after {
          left: 150%;
          transition: all 0.75s ease-in-out;
        }

        .btn-quote:hover {
          background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(197, 125, 41, 0.5);
        }

        .btn-quote:hover :global(svg) {
          transform: translateX(4px);
        }

        .btn-quote :global(svg) {
          transition: transform 0.25s ease;
        }

        .btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 26px;
          background: rgba(18, 48, 56, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }

        .btn-whatsapp:hover {
          background: #25d366;
          border-color: #25d366;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        .whatsapp-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #25d366;
        }

        .btn-whatsapp:hover .whatsapp-icon-wrap {
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 2rem;
          }
          .cta-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
