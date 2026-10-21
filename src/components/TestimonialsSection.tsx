"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonialsData } from "@/data/jaisalmerData";

export default function TestimonialsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-header-title">What Our Travelers Say</h2>
            <p className="section-header-subtitle">Real experiences from our happy guests</p>
          </div>

          <div className="section-header-actions">
            <div className="carousel-nav-btns">
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("left")}
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("right")}
                aria-label="Next testimonials"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials 3 Columns */}
        <div className="testimonials-grid" ref={carouselRef}>
          {testimonialsData.map((item) => (
            <div key={item.id} className="testimonial-card">
              {/* Top Header: Avatar & Info */}
              <div className="author-row">
                <div className="avatar-wrap">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={46}
                    height={46}
                    unoptimized
                    priority
                    className="avatar-img"
                  />
                </div>
                <div className="author-info">
                  <h4 className="author-name">{item.name}</h4>
                  <p className="author-city">{item.city}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="stars-row">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#df9745" color="#df9745" />
                ))}
              </div>

              {/* Quote text */}
              <div className="quote-block">
                <Quote size={20} className="quote-icon" />
                <p className="quote-text">{item.review}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          background: #ffffff;
          border-top: 1px solid var(--border-light);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 8px;
        }

        .testimonial-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid #f0eae1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          scroll-snap-align: start;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
          border-color: rgba(201, 127, 44, 0.3);
        }

        .author-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .avatar-wrap {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          overflow: hidden;
          background: #f0ebe2;
          flex-shrink: 0;
          border: 2px solid var(--primary-gold-light);
        }

        .avatar-img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 700;
          color: #1a1918;
        }

        .author-city {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 14px;
        }

        .quote-block {
          position: relative;
        }

        .quote-icon {
          color: #e5dac9;
          position: absolute;
          top: -6px;
          left: -4px;
          opacity: 0.5;
        }

        .quote-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #4a4744;
          font-style: italic;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 900px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
