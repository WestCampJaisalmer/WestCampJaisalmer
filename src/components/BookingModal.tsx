"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, MapPin, Check, Calendar, Users, ShieldCheck, Heart } from "lucide-react";

interface BookingModalProps {
  item: any;
  type: "hotel" | "camp" | "tour" | "destination" | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ item, type, isOpen, onClose }: BookingModalProps) {
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !item) return null;

  const basePrice = item.price || 2500;
  const totalPrice = type === "tour" ? basePrice * guests : basePrice * nights;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {confirmed ? (
          <div className="confirm-view">
            <div className="confirm-badge">
              <ShieldCheck size={54} color="#c57d29" />
            </div>
            <h3 className="confirm-title">Reservation Confirmed!</h3>
            <p className="confirm-sub">
              Your booking for <strong>{item.name || item.title}</strong> has been secured. A voucher with check-in instructions and booking ID <strong>#JSMR-{Math.floor(100000 + Math.random() * 900000)}</strong> has been prepared.
            </p>
            <div className="booking-summary-box">
              <div className="sum-row">
                <span>Property / Tour</span>
                <strong>{item.name || item.title}</strong>
              </div>
              <div className="sum-row">
                <span>Location</span>
                <span>{item.location || item.distance || "Jaisalmer, Rajasthan"}</span>
              </div>
              <div className="sum-row">
                <span>{type === "tour" ? "Travelers" : "Duration & Guests"}</span>
                <span>{type === "tour" ? `${guests} Persons` : `${nights} Nights, ${guests} Guests`}</span>
              </div>
              <div className="sum-row total">
                <span>Total Amount</span>
                <span className="total-gold">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <div className="booking-view">
            {/* Top Media Banner */}
            <div className="booking-banner">
              <Image
                src={item.image}
                alt={item.name || item.title}
                fill
                sizes="(max-width: 768px) 100vw, 660px"
                className="banner-img"
              />
              <div className="banner-overlay" />
              <div className="banner-info">
                <span className="banner-type-tag">
                  {type === "hotel" ? "Heritage Stay" : type === "camp" ? "Desert Camp" : type === "tour" ? "Tour & Activity" : "Attraction"}
                </span>
                <h3 className="banner-title">{item.name || item.title}</h3>
                {item.location && (
                  <p className="banner-location">
                    <MapPin size={14} /> {item.location}
                  </p>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="booking-body">
              {item.rating && (
                <div className="modal-rating-row">
                  <div className="rating-pill">
                    <Star size={14} fill="#df9745" color="#df9745" />
                    <strong>{item.rating}</strong>
                    <span>({item.reviews || 150} reviews)</span>
                  </div>
                  <span className="verified-tag">
                    <ShieldCheck size={14} color="#16a34a" /> Verified Experience
                  </span>
                </div>
              )}

              <p className="modal-desc">{item.description}</p>

              {/* Amenities / Highlights */}
              {item.amenities && (
                <div className="amenities-block">
                  <h4 className="amenities-title">Featured Inclusions</h4>
                  <div className="amenities-grid">
                    {item.amenities.map((amenity: string, i: number) => (
                      <div key={i} className="amenity-chip">
                        <Check size={14} color="#c57d29" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Selection Box */}
              {type !== "destination" && (
                <div className="booking-pricing-box">
                  <div className="select-row">
                    {type !== "tour" ? (
                      <div className="counter-field">
                        <label>Stay Duration</label>
                        <select 
                          value={nights} 
                          onChange={(e) => setNights(Number(e.target.value))}
                          className="select-input"
                        >
                          <option value={1}>1 Night</option>
                          <option value={2}>2 Nights (Recommended)</option>
                          <option value={3}>3 Nights</option>
                          <option value={5}>5 Nights</option>
                        </select>
                      </div>
                    ) : (
                      <div className="counter-field">
                        <label>Preferred Time</label>
                        <select className="select-input">
                          <option>Sunrise Safari (05:30 AM)</option>
                          <option>Golden Sunset Safari (04:30 PM)</option>
                          <option>Night Stargazing (08:00 PM)</option>
                        </select>
                      </div>
                    )}

                    <div className="counter-field">
                      <label>Guests</label>
                      <select 
                        value={guests} 
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="select-input"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={6}>6+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="price-total-bar">
                    <div className="price-left">
                      <span className="total-label">Total Payable:</span>
                      <span className="price-amount">₹{totalPrice.toLocaleString("en-IN")}</span>
                      <span className="tax-inclusive">Inclusive of taxes & breakfast</span>
                    </div>

                    <button className="btn-confirm-book" onClick={handleConfirm}>
                      Book Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .booking-modal {
          max-width: 660px;
          padding: 0;
          overflow: hidden;
        }

        .booking-banner {
          position: relative;
          height: 240px;
          width: 100%;
        }

        .banner-img {
          object-fit: cover;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(18, 48, 56, 0.85) 100%);
        }

        .banner-info {
          position: absolute;
          bottom: 20px;
          left: 24px;
          right: 24px;
          color: #ffffff;
        }

        .banner-type-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(201, 127, 44, 0.9);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          display: inline-block;
          margin-bottom: 8px;
        }

        .banner-title {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }

        .banner-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: #f7d299;
          margin-top: 4px;
        }

        .booking-body {
          padding: 24px 28px 30px;
        }

        .modal-rating-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #1a1918;
        }

        .verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #15803d;
          font-weight: 600;
        }

        .modal-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #55524e;
          margin-bottom: 20px;
        }

        .amenities-block {
          margin-bottom: 24px;
        }

        .amenities-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 16px;
        }

        .amenity-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #383531;
        }

        .booking-pricing-box {
          background: #fbf8f2;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 18px 20px;
        }

        .select-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .counter-field {
          display: flex;
          flex-direction: column;
        }

        .counter-field label {
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .select-input {
          padding: 8px 12px;
          border: 1px solid #ddd5c7;
          border-radius: var(--radius-sm);
          background: #ffffff;
          font-size: 0.88rem;
          font-family: var(--font-sans);
          outline: none;
        }

        .price-total-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #ebe2d3;
        }

        .price-left {
          display: flex;
          flex-direction: column;
        }

        .total-label {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .price-amount {
          font-size: 1.45rem;
          font-weight: 700;
          color: #c57d29;
          line-height: 1.1;
        }

        .tax-inclusive {
          font-size: 0.72rem;
          color: #8c877e;
        }

        .btn-confirm-book {
          padding: 12px 28px;
          background: #c57d29;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: var(--transition);
          box-shadow: 0 4px 16px rgba(197, 125, 41, 0.35);
        }

        .btn-confirm-book:hover {
          background: #b16c1f;
          transform: translateY(-1px);
        }

        .confirm-view {
          padding: 40px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .confirm-badge {
          margin-bottom: 16px;
        }

        .confirm-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: #1a1918;
          margin-bottom: 10px;
        }

        .confirm-sub {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-muted);
          max-width: 480px;
          margin-bottom: 24px;
        }

        .booking-summary-box {
          width: 100%;
          background: #faf6ef;
          border: 1px solid #ede3d3;
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 24px;
          text-align: left;
        }

        .sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          padding: 6px 0;
          border-bottom: 1px dashed #e5dccb;
          color: #4a4744;
        }

        .sum-row.total {
          border-bottom: none;
          font-size: 1rem;
          font-weight: 700;
          padding-top: 10px;
        }

        .total-gold {
          color: #c57d29;
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
