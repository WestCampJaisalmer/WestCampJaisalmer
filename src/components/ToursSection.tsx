"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { toursData, Tour } from "@/data/jaisalmerData";

interface ToursSectionProps {
  onSelectTour: (tour: Tour) => void;
  onViewAll: () => void;
}

export default function ToursSection({ onSelectTour, onViewAll }: ToursSectionProps) {
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
    <section id="tours" className="tours-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-header-title">Popular Tours & Activities</h2>
            <p className="section-header-subtitle">
              Explore the best experiences Jaisalmer has to offer
            </p>
          </div>

          <div className="section-header-actions">
            <button className="view-all-link" onClick={onViewAll}>
              <span>View All Tours</span>
              <ArrowRight size={14} />
            </button>
            <div className="carousel-nav-btns">
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("left")}
                aria-label="Previous tours"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("right")}
                aria-label="Next tours"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Tours Carousel */}
        <div className="tours-carousel" ref={carouselRef}>
          {toursData.map((tour) => (
            <div 
              key={tour.id} 
              className="tour-card"
              onClick={() => onSelectTour(tour)}
            >
              <div className="tour-img-wrap">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="tour-img"
                  sizes="(max-width: 768px) 100vw, 220px"
                />
              </div>

              <div className="tour-card-body">
                <h3 className="tour-title">{tour.title}</h3>
                <div className="tour-price-row">
                  <span className="price-label">From </span>
                  <span className="price-val">₹{tour.price.toLocaleString("en-IN")}</span>
                  <span className="price-unit"> / {tour.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .tours-section {
          background: #ffffff;
        }

        .tours-carousel {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 12px;
        }

        .tour-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          scroll-snap-align: start;
        }

        .tour-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.09);
          border-color: rgba(201, 127, 44, 0.4);
        }

        .tour-img-wrap {
          position: relative;
          height: 160px;
          width: 100%;
          overflow: hidden;
          background: #f0ebe2;
        }

        .tour-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .tour-card:hover .tour-img {
          transform: scale(1.08);
        }

        .tour-card-body {
          padding: 14px 16px 18px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .tour-title {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1918;
          margin-bottom: 6px;
        }

        .tour-price-row {
          display: flex;
          align-items: baseline;
        }

        .price-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .price-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #c57d29;
          margin: 0 3px;
        }

        .price-unit {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 1100px) {
          .tours-carousel {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tours-carousel {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .tours-carousel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
