"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Search, Star, MapPin, ArrowRight } from "lucide-react";
import { hotelsData, campsData, toursData } from "@/data/jaisalmerData";

interface SearchItem {
  id: string;
  name: string;
  type: "hotel" | "camp" | "tour";
  price: number;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  location?: string;
  unit?: string;
}

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchParams: {
    tab?: string;
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  } | null;
  onSelectItem: (item: any, type: any) => void;
}

export default function SearchResultsModal({
  isOpen,
  onClose,
  searchParams,
  onSelectItem,
}: SearchResultsModalProps) {
  const [filterType, setFilterType] = useState<string>(searchParams?.tab || "all");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.destination || "");

  if (!isOpen) return null;

  // Aggregate listings
  const allHotels: SearchItem[] = hotelsData.map((h) => ({
    id: h.id,
    name: h.name,
    type: "hotel",
    price: h.price,
    image: h.image,
    description: h.description,
    rating: h.rating,
    reviews: h.reviews,
    location: h.location,
    unit: "night",
  }));

  const allCamps: SearchItem[] = campsData.map((c) => ({
    id: c.id,
    name: c.name,
    type: "camp",
    price: c.price,
    image: c.image,
    description: c.description,
    rating: c.rating,
    reviews: c.reviews,
    location: c.location,
    unit: "night",
  }));

  const allTours: SearchItem[] = toursData.map((t) => ({
    id: t.id,
    name: t.title,
    type: "tour",
    price: t.price,
    image: t.image,
    description: t.description,
    location: "Thar Desert, Jaisalmer",
    unit: t.unit,
  }));

  const allItems: SearchItem[] = [...allHotels, ...allCamps, ...allTours];

  const filtered = allItems.filter((item) => {
    const matchesType = 
      filterType === "all" ||
      (filterType === "hotels" && item.type === "hotel") ||
      (filterType === "camps" && item.type === "camp") ||
      (filterType === "tours" && item.type === "tour");

    const matchesSearch = 
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content search-results-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="search-modal-header">
          <h3 className="search-modal-title">Explore Jaisalmer Stays & Adventures</h3>
          <p className="search-modal-sub">
            {searchParams?.checkIn ? `Showing available availability for ${searchParams.guests || 2} guests` : "Find handpicked royal havelis, luxury desert tents & camel safaris"}
          </p>

          {/* Search bar */}
          <div className="search-input-wrap">
            <Search size={18} className="search-bar-icon" />
            <input
              type="text"
              placeholder="Search by name, location (e.g. Sam Sand Dunes, Fort, Haveli)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
          </div>

          {/* Filter Pills */}
          <div className="filter-tabs">
            {["all", "hotels", "camps", "tours"].map((tab) => (
              <button
                key={tab}
                className={`filter-tab-btn ${filterType === tab ? "active" : ""}`}
                onClick={() => setFilterType(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="results-scroll-area">
          {filtered.length === 0 ? (
            <div className="empty-results">
              <p>No listings found matching your search. Try searching for &ldquo;Sam&rdquo;, &ldquo;Fort&rdquo;, or &ldquo;Camp&rdquo;.</p>
            </div>
          ) : (
            <div className="results-list">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="result-row"
                  onClick={() => {
                    onSelectItem(item, item.type);
                    onClose();
                  }}
                >
                  <div className="result-img-box">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="result-img"
                    />
                  </div>

                  <div className="result-info">
                    <div className="result-top">
                      <span className="type-badge">{item.type.toUpperCase()}</span>
                      {item.rating && (
                        <div className="rating-tag">
                          <Star size={12} fill="#df9745" color="#df9745" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="result-name">{item.name}</h4>
                    {item.location && (
                      <p className="result-loc">
                        <MapPin size={12} /> {item.location}
                      </p>
                    )}
                    <p className="result-desc-line">{item.description}</p>
                  </div>

                  <div className="result-price-col">
                    <span className="from-txt">From</span>
                    <span className="price-bold">₹{item.price.toLocaleString("en-IN")}</span>
                    <span className="unit-txt">{item.unit ? `/ ${item.unit}` : ""}</span>
                    <button className="btn-select-item">
                      <span>View</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-results-modal {
          max-width: 820px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          padding: 28px;
        }

        .search-modal-header {
          margin-bottom: 20px;
        }

        .search-modal-title {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .search-modal-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: #faf7f2;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          margin-bottom: 14px;
        }

        .search-bar-icon {
          color: var(--primary-gold);
        }

        .search-input-field {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.92rem;
          color: var(--text-main);
          width: 100%;
          font-family: var(--font-sans);
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
        }

        .filter-tab-btn {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-light);
          background: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: var(--transition);
        }

        .filter-tab-btn.active {
          background: var(--primary-gold);
          color: #ffffff;
          border-color: var(--primary-gold);
        }

        .results-scroll-area {
          overflow-y: auto;
          flex: 1;
          padding-right: 6px;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .result-row {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: #ffffff;
          cursor: pointer;
          transition: var(--transition);
        }

        .result-row:hover {
          border-color: var(--primary-gold);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .result-img-box {
          position: relative;
          width: 120px;
          height: 90px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
        }

        .result-img {
          object-fit: cover;
        }

        .result-info {
          flex: 1;
        }

        .result-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .type-badge {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--primary-gold-dark);
          background: var(--desert-sand);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .rating-tag {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .result-name {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 3px;
        }

        .result-loc {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .result-desc-line {
          font-size: 0.78rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-price-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          min-width: 110px;
        }

        .from-txt {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .price-bold {
          font-size: 1.25rem;
          font-weight: 700;
          color: #c57d29;
          line-height: 1.1;
        }

        .unit-txt {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .btn-select-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          background: #c57d29;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }

        .result-row:hover .btn-select-item {
          background: #b16c1f;
        }

        .empty-results {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .result-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .result-img-box {
            width: 100%;
            height: 140px;
          }
          .result-price-col {
            align-items: flex-start;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}
