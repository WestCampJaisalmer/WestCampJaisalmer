"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { destinationsData, Destination } from "@/data/jaisalmerData";

interface DestinationsSectionProps {
  onSelectDestination: (dest: Destination) => void;
  onViewAll: () => void;
}

export default function DestinationsSection({ onSelectDestination, onViewAll }: DestinationsSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 260;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="destinations-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-header-title">Top Destinations in Jaisalmer</h2>
            <p className="section-header-subtitle">
              Explore the most beautiful places and hidden gems
            </p>
          </div>

          <div className="section-header-actions">
            <button className="view-all-link" onClick={onViewAll}>
              <span>View All Places</span>
              <ArrowRight size={14} />
            </button>
            <div className="carousel-nav-btns">
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("left")}
                aria-label="Previous destinations"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("right")}
                aria-label="Next destinations"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Destination Cards */}
        <div className="destinations-carousel" ref={carouselRef}>
          {destinationsData.map((dest) => (
            <div 
              key={dest.id} 
              className="dest-card"
              onClick={() => onSelectDestination(dest)}
            >
              <div className="dest-img-wrap">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="dest-img"
                  sizes="(max-width: 768px) 100vw, 240px"
                />
                <div className="dest-overlay" />
              </div>

              <div className="dest-info">
                <h3 className="dest-name">{dest.name}</h3>
                <span className="dest-subtitle">{dest.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .destinations-section {
          background: #ffffff;
        }

        .destinations-carousel {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 12px;
        }

        .dest-card {
          position: relative;
          height: 190px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
          scroll-snap-align: start;
        }

        .dest-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
        }

        .dest-img-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .dest-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .dest-card:hover .dest-img {
          transform: scale(1.08);
        }

        .dest-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(18, 48, 56, 0.35) 45%,
            rgba(11, 25, 30, 0.9) 100%
          );
        }

        .dest-info {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .dest-name {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .dest-subtitle {
          font-size: 0.76rem;
          color: #f7d299;
          font-weight: 500;
          margin-top: 3px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 1100px) {
          .destinations-carousel {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .destinations-carousel {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .destinations-carousel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
