"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle, Send, Calendar, Users, MapPin } from "lucide-react";

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanTripModal({ isOpen, onClose }: PlanTripModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "2026-11-20",
    days: "3 Days / 2 Nights",
    guests: "2 Guests",
    preferences: ["Desert Camp", "Camel Safari"],
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3s if desired
    }, 3000);
  };

  const togglePreference = (pref: string) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists 
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref]
      };
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content trip-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="text-gold" />
            </div>
            <h3 className="success-title">Khamma Ghani, {formData.name || "Traveler"}!</h3>
            <p className="success-desc">
              Your custom Jaisalmer itinerary request has been received. Our local travel concierge will contact you on <strong>{formData.phone || "WhatsApp"}</strong> within 30 minutes with personalized options.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Explore More of Jaisalmer
            </button>
          </div>
        ) : (
          <div>
            <div className="modal-header">
              <span className="modal-eyebrow">CUSTOM RAJASTHAN EXPERIENCE</span>
              <h3 className="modal-title">Plan Your Royal Jaisalmer Trip</h3>
              <p className="modal-sub">Tell us your dream holiday preferences and let our local experts design your journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="trip-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Date of Arrival</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select 
                    className="form-input"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  >
                    <option>2 Days / 1 Night (Weekend Special)</option>
                    <option>3 Days / 2 Nights (Most Popular)</option>
                    <option>4 Days / 3 Nights (Complete Desert & Fort)</option>
                    <option>5+ Days (Royal Grand Tour)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Travelers</label>
                  <select 
                    className="form-input"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    <option>Solo Traveler</option>
                    <option>Couple / 2 Guests</option>
                    <option>Family (3-5 Guests)</option>
                    <option>Group (6+ Guests)</option>
                  </select>
                </div>
              </div>

              {/* Preference Pills */}
              <div className="form-group">
                <label className="form-label">Experiences You Want Included</label>
                <div className="pref-pills">
                  {[
                    "Heritage Haveli Stay",
                    "Desert Luxury Camp",
                    "Sunset Camel Safari",
                    "4x4 Dune Bashing",
                    "Cultural Kalbelia Dance",
                    "Romantic Desert Dinner",
                    "Sonar Fort Guided Tour",
                    "Stargazing Night"
                  ].map((p) => {
                    const isSelected = formData.preferences.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        className={`pref-pill ${isSelected ? "active" : ""}`}
                        onClick={() => togglePreference(p)}
                      >
                        {isSelected && <Sparkles size={12} />}
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div className="form-group">
                <label className="form-label">Special Requests / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about special occasions (anniversary, birthday, food choices)..."
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="submit-trip-btn">
                <Send size={16} />
                <span>Get Free Itinerary & Custom Quote</span>
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .trip-modal {
          max-width: 620px;
        }

        .modal-header {
          margin-bottom: 24px;
        }

        .modal-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-gold);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .modal-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 4px 0 8px;
        }

        .modal-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .trip-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.76rem;
          font-weight: 600;
          color: #4a4744;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .form-input {
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-family: var(--font-sans);
          outline: none;
          color: var(--text-main);
          background: #faf7f2;
          transition: var(--transition);
        }

        .form-input:focus {
          border-color: var(--primary-gold);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(201, 127, 44, 0.15);
        }

        .form-textarea {
          resize: vertical;
        }

        .pref-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pref-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-light);
          background: #ffffff;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .pref-pill:hover {
          border-color: var(--primary-gold);
          color: var(--primary-gold);
        }

        .pref-pill.active {
          background: #c57d29;
          color: #ffffff;
          border-color: #c57d29;
          font-weight: 600;
        }

        .submit-trip-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #c57d29;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          box-shadow: 0 6px 20px rgba(197, 125, 41, 0.35);
          transition: var(--transition);
          margin-top: 8px;
        }

        .submit-trip-btn:hover {
          background: #b16c1f;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(197, 125, 41, 0.45);
        }

        .success-view {
          text-align: center;
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-wrap {
          margin-bottom: 18px;
        }

        .success-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .success-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 440px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
