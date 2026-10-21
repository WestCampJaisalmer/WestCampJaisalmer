"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Star, Heart, ChevronLeft, ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { hotelsData, Hotel } from "@/data/jaisalmerData";

interface HotelsSectionProps {
  onSelectHotel: (hotel: Hotel) => void;
  onViewAll: () => void;
}

export default function HotelsSection({ onSelectHotel, onViewAll }: HotelsSectionProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="hotels" className="hotels-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-header-title">Featured Hotels in Jaisalmer</h2>
            <p className="section-header-subtitle">Stay in royal heritage properties with modern amenities</p>
          </div>

          <div className="section-header-actions">
            <button className="view-all-link" onClick={onViewAll}>
              <span>View All Hotels</span>
              <ArrowRight size={14} />
            </button>
            <div className="carousel-nav-btns">
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("left")}
                aria-label="Previous hotels"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="carousel-nav-btn" 
                onClick={() => handleScroll("right")}
                aria-label="Next hotels"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Hotels Grid / Carousel */}
        <div className="hotels-carousel" ref={carouselRef}>
          {hotelsData.map((hotel) => {
            const isFav = favorites[hotel.id];
            return (
              <div 
                key={hotel.id} 
                className="hotel-card"
                onClick={() => onSelectHotel(hotel)}
              >
                {/* Card Image */}
                <div className="hotel-img-wrap">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="hotel-img"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  {/* Heart Wishlist Button */}
                  <button
                    className={`wishlist-btn ${isFav ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(hotel.id, e)}
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      size={16} 
                      fill={isFav ? "#e11d48" : "none"} 
                      color={isFav ? "#e11d48" : "#ffffff"} 
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="hotel-card-body">
                  <h3 className="hotel-name">{hotel.name}</h3>

                  {/* Rating & Reviews */}
                  <div className="hotel-meta-row">
                    <div className="rating-box">
                      <Star size={13} fill="#df9745" color="#df9745" />
                      <span className="rating-score">{hotel.rating}</span>
                      <span className="rating-count">({hotel.reviews})</span>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="hotel-location">{hotel.location}</p>

                  {/* Price Row */}
                  <div className="hotel-price-row">
                    <span className="price-label">From </span>
                    <span className="price-val">₹{hotel.price.toLocaleString("en-IN")}</span>
                    <span className="price-unit"> / night</span>
                  </div>

                  {/* View Details Link */}
                  <div className="details-link-wrap">
                    <span className="details-link">
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .hotels-section {
          background: #ffffff;
        }

        .hotels-carousel {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 12px;
        }

        .hotel-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          scroll-snap-align: start;
        }

        .hotel-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
          border-color: rgba(201, 127, 44, 0.4);
        }

        .hotel-img-wrap {
          position: relative;
          height: 195px;
          width: 100%;
          overflow: hidden;
          background: #f0ebe2;
        }

        .hotel-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hotel-card:hover .hotel-img {
          transform: scale(1.06);
        }

        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          z-index: 5;
        }

        .wishlist-btn:hover {
          background: rgba(0, 0, 0, 0.6);
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          background: #ffffff;
        }

        .hotel-card-body {
          padding: 16px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .hotel-name {
          font-family: var(--font-serif);
          font-size: 1.12rem;
          font-weight: 700;
          color: #1a1918;
          margin-bottom: 6px;
        }

        .hotel-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .rating-box {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-score {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1918;
        }

        .rating-count {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .hotel-location {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        .hotel-price-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .price-label {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .price-val {
          font-size: 1.15rem;
          font-weight: 700;
          color: #c57d29;
          margin: 0 3px;
        }

        .price-unit {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .details-link-wrap {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed #f0eae1;
        }

        .details-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #c57d29;
          transition: var(--transition);
        }

        .hotel-card:hover .details-link {
          color: #ad671d;
          transform: translateX(4px);
        }

        @media (max-width: 1080px) {
          .hotels-carousel {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .hotels-carousel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
