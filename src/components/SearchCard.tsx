"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Tent, 
  Compass, 
  Package, 
  MapPin, 
  Calendar, 
  Users, 
  Search,
  Plus,
  Minus
} from "lucide-react";

interface SearchCardProps {
  onSearch: (searchParams: {
    tab: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export default function SearchCard({ onSearch }: SearchCardProps) {
  const [activeTab, setActiveTab] = useState<"hotels" | "camps" | "tours" | "packages">("hotels");
  const [destination, setDestination] = useState("Jaisalmer");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      tab: activeTab,
      destination,
      checkIn,
      checkOut,
      guests
    });
  };

  return (
    <div className="search-card-wrapper">
      <div className="search-card">
        {/* Search Tabs */}
        <div className="search-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => setActiveTab("hotels")}
          >
            <Building2 size={16} />
            <span>Hotels</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "camps" ? "active" : ""}`}
            onClick={() => setActiveTab("camps")}
          >
            <Tent size={16} />
            <span>Camps</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "tours" ? "active" : ""}`}
            onClick={() => setActiveTab("tours")}
          >
            <Compass size={16} />
            <span>Tours</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "packages" ? "active" : ""}`}
            onClick={() => setActiveTab("packages")}
          >
            <Package size={16} />
            <span>Packages</span>
          </button>
        </div>

        {/* Search Form Fields */}
        <form onSubmit={handleSearchClick} className="search-form-grid">
          {/* Destination */}
          <div className="search-field">
            <span className="field-label">Destination</span>
            <div className="field-input-box">
              <MapPin size={16} className="field-icon" />
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where in Jaisalmer?" 
                className="text-input"
              />
            </div>
          </div>

          <div className="field-divider" />

          {/* Check In */}
          <div className="search-field">
            <span className="field-label">Check In</span>
            <div className="field-input-box">
              <Calendar size={16} className="field-icon" />
              <input 
                type={checkIn ? "date" : "text"} 
                placeholder="Select date"
                value={checkIn}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onChange={(e) => setCheckIn(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          <div className="field-divider" />

          {/* Check Out */}
          <div className="search-field">
            <span className="field-label">Check Out</span>
            <div className="field-input-box">
              <Calendar size={16} className="field-icon" />
              <input 
                type={checkOut ? "date" : "text"} 
                placeholder="Select date"
                value={checkOut}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onChange={(e) => setCheckOut(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          <div className="field-divider" />

          {/* Guests */}
          <div className="search-field relative">
            <span className="field-label">Guests</span>
            <div 
              className="field-input-box clickable"
              onClick={() => setShowGuestPicker(!showGuestPicker)}
            >
              <Users size={16} className="field-icon" />
              <span className="guest-display-text">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
            </div>

            {/* Guest Popover */}
            {showGuestPicker && (
              <div className="guest-popover">
                <div className="guest-row">
                  <div>
                    <div className="guest-type">Adults & Children</div>
                    <div className="guest-sub">Ages 2 and above</div>
                  </div>
                  <div className="counter-btns">
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (guests > 1) setGuests(guests - 1);
                      }}
                      className="counter-btn"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="counter-val">{guests}</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setGuests(guests + 1);
                      }}
                      className="counter-btn"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button 
                  type="button"
                  className="popover-done-btn"
                  onClick={() => setShowGuestPicker(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="search-action">
            <button type="submit" className="search-submit-btn">
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .search-card-wrapper {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .search-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 16px 28px 22px;
          box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .search-tabs {
          display: flex;
          align-items: center;
          gap: 28px;
          border-bottom: 1px solid #f0eae1;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #736d65;
          padding: 6px 4px;
          position: relative;
          transition: var(--transition);
        }

        .tab-btn:hover {
          color: var(--primary-gold-dark);
        }

        .tab-btn.active {
          color: var(--primary-gold-dark);
          font-weight: 600;
        }

        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -13px;
          left: 0;
          right: 0;
          height: 2.5px;
          background: var(--primary-gold);
          border-radius: 2px;
        }

        .search-form-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .search-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .field-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #928b80;
          margin-bottom: 4px;
        }

        .field-input-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
        }

        .field-input-box.clickable {
          cursor: pointer;
        }

        .field-icon {
          color: #928b80;
          flex-shrink: 0;
        }

        .text-input,
        .date-input {
          border: none;
          outline: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          width: 100%;
          background: transparent;
          font-family: var(--font-sans);
        }

        .date-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
        }

        .guest-display-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .field-divider {
          width: 1px;
          height: 38px;
          background: #ebe3d6;
          flex-shrink: 0;
        }

        .guest-popover {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px;
          z-index: 50;
          width: 240px;
        }

        .guest-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .guest-type {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .guest-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .counter-btns {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .counter-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #d4cdc2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          background: #ffffff;
        }

        .counter-btn:hover {
          border-color: var(--primary-gold);
          color: var(--primary-gold);
        }

        .counter-val {
          font-weight: 600;
          font-size: 0.9rem;
          min-width: 16px;
          text-align: center;
        }

        .popover-done-btn {
          width: 100%;
          padding: 6px;
          background: var(--desert-sand);
          color: var(--primary-gold-dark);
          font-weight: 600;
          font-size: 0.82rem;
          border-radius: var(--radius-sm);
        }

        .search-submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--primary-gold-light) 0%, var(--primary-gold) 100%);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 9999px;
          transition: var(--transition);
          box-shadow: 0 6px 18px rgba(197, 125, 41, 0.35);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .search-submit-btn::after {
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

        .search-submit-btn:hover::after {
          left: 150%;
          transition: all 0.75s ease-in-out;
        }

        .search-submit-btn:hover {
          background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(197, 125, 41, 0.45);
        }

        .search-submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .search-form-grid {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          .field-divider {
            display: none;
          }
          .search-submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
