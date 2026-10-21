"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, Sparkles } from "lucide-react";

interface NavbarProps {
  onPlanTripClick: () => void;
  onSearchClick: () => void;
}

export default function Navbar({ onPlanTripClick, onSearchClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="navbar-brand">
          <div className="brand-logo-icon">
            {/* Traditional Jaisalmer Fort Palace Silhouette SVG */}
            <svg width="34" height="26" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L24 8H28L30 14V28H10V14L12 8H16L20 2Z" fill="#c97f2c" />
              <path d="M4 14L8 18V28H2V18L4 14Z" fill="#df9745" />
              <path d="M36 14L38 18V28H32V18L36 14Z" fill="#df9745" />
              <rect x="18" y="18" width="4" height="10" rx="2" fill="#123038" />
              <circle cx="20" cy="5" r="1.5" fill="#fef08a" />
              <rect x="13" y="12" width="2" height="4" rx="1" fill="#123038" />
              <rect x="25" y="12" width="2" height="4" rx="1" fill="#123038" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">Jaisalmer</span>
            <span className="brand-subtitle">TRAVEL & EXPERIENCES</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link href="#home" className="nav-link active">Home</Link>
          <Link href="#hotels" className="nav-link">Hotels</Link>
          <Link href="#camps" className="nav-link">Camps</Link>
          <Link href="#tours" className="nav-link">Tours</Link>
          <Link href="#experiences" className="nav-link">Experiences</Link>
          <Link href="#packages" className="nav-link">Packages</Link>
          <Link href="#about" className="nav-link">About Us</Link>
          <Link href="#contact" className="nav-link">Contact</Link>
        </nav>

        {/* Right Tools & CTA */}
        <div className="nav-right-tools">
          {/* Search Trigger */}
          <button 
            className="search-icon-btn" 
            onClick={onSearchClick}
            aria-label="Search"
            title="Search stays and tours"
          >
            <Search size={18} />
          </button>

          {/* Currency Selector */}
          <div className="currency-selector-wrap">
            <button 
              className="currency-btn"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            >
              <span>{currency}</span>
              <ChevronDown size={14} />
            </button>
            {currencyDropdownOpen && (
              <div className="currency-dropdown">
                {["INR", "USD", "EUR", "GBP", "AED"].map((cur) => (
                  <button
                    key={cur}
                    className={`currency-option ${cur === currency ? "active" : ""}`}
                    onClick={() => {
                      setCurrency(cur);
                      setCurrencyDropdownOpen(false);
                    }}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plan My Trip Button */}
          <button className="btn-plan-trip" onClick={onPlanTripClick}>
            Plan My Trip
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            <Link href="#home" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="#hotels" onClick={() => setMobileMenuOpen(false)}>Hotels</Link>
            <Link href="#camps" onClick={() => setMobileMenuOpen(false)}>Camps</Link>
            <Link href="#tours" onClick={() => setMobileMenuOpen(false)}>Tours</Link>
            <Link href="#experiences" onClick={() => setMobileMenuOpen(false)}>Experiences</Link>
            <Link href="#packages" onClick={() => setMobileMenuOpen(false)}>Packages</Link>
            <Link href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>
          <div className="mobile-drawer-cta">
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => {
              setMobileMenuOpen(false);
              onPlanTripClick();
            }}>
              <Sparkles size={16} /> Plan My Trip
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 216, 203, 0.4);
          padding: 12px 0;
        }

        .navbar-header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 8px 0;
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brand-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #1a1918;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .brand-subtitle {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--primary-gold);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav-link {
          font-size: 0.88rem;
          font-weight: 500;
          color: #43403b;
          transition: color 0.2s ease;
          position: relative;
          padding: 4px 0;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--primary-gold-dark);
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-gold);
          border-radius: 2px;
        }

        .nav-right-tools {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-icon-btn {
          color: #3e3b36;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
          transition: var(--transition);
        }

        .search-icon-btn:hover {
          color: var(--primary-gold);
          background: var(--desert-sand-alt);
        }

        .currency-selector-wrap {
          position: relative;
        }

        .currency-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #43403b;
          padding: 4px 6px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .currency-btn:hover {
          color: var(--primary-gold);
        }

        .currency-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          padding: 4px;
          z-index: 50;
          min-width: 80px;
        }

        .currency-option {
          padding: 6px 12px;
          text-align: left;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-main);
          border-radius: 4px;
          transition: var(--transition);
        }

        .currency-option:hover,
        .currency-option.active {
          background: var(--desert-sand);
          color: var(--primary-gold);
        }

        .btn-plan-trip {
          padding: 9px 20px;
          background: linear-gradient(135deg, var(--primary-gold-light) 0%, var(--primary-gold) 100%);
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: var(--transition);
          box-shadow: 0 4px 14px rgba(197, 125, 41, 0.3);
          white-space: nowrap;
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
          box-shadow: 0 8px 20px rgba(197, 125, 41, 0.45);
        }

        .mobile-menu-toggle {
          display: none;
          color: var(--text-main);
        }

        .mobile-drawer {
          background: #ffffff;
          border-top: 1px solid var(--border-light);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-nav-list a {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-main);
          padding: 6px 0;
          border-bottom: 1px solid var(--desert-sand);
        }

        @media (max-width: 960px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
          }
          .btn-plan-trip {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
