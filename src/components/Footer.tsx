"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-brand">
              <div className="brand-logo-icon">
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

            <p className="footer-brand-desc">
              Explore the Golden City with handpicked hotels, desert camps, tours and unique experiences.
            </p>

            {/* Social Icons */}
            <div className="social-links-row">
              {/* Instagram */}
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>
              {/* TripAdvisor / Globe */}
              <a href="#" className="social-link" aria-label="TripAdvisor">
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link href="#home">Home</Link></li>
              <li><Link href="#hotels">Hotels</Link></li>
              <li><Link href="#camps">Camps</Link></li>
              <li><Link href="#tours">Tours</Link></li>
              <li><Link href="#packages">Packages</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links-list">
              <li><Link href="#destinations">Jaisalmer Fort</Link></li>
              <li><Link href="#destinations">Sam Sand Dunes</Link></li>
              <li><Link href="#destinations">Kuldhara Village</Link></li>
              <li><Link href="#destinations">Gadisar Lake</Link></li>
              <li><Link href="#destinations">Bada Bagh</Link></li>
            </ul>
          </div>

          {/* Column 4: Help & Support */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Help & Support</h4>
            <ul className="footer-links-list">
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#contact">Contact Us</Link></li>
              <li><Link href="#faqs">FAQs</Link></li>
              <li><Link href="#cancellation">Cancellation Policy</Link></li>
              <li><Link href="#terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-items">
              <div className="contact-item">
                <Phone size={15} className="contact-icon" />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <Mail size={15} className="contact-icon" />
                <span>hello@jaisalmertrips.in</span>
              </div>
              <div className="contact-item">
                <MapPin size={15} className="contact-icon" />
                <span>Jaisalmer, Rajasthan, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Jaisalmer Travel & Experiences. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background: #ffffff;
          border-top: 1px solid var(--border-light);
          padding: 60px 0 25px;
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr 0.9fr 1.1fr;
          gap: 36px;
          margin-bottom: 50px;
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 14px;
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
        }

        .brand-subtitle {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--primary-gold);
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 18px;
          max-width: 280px;
        }

        .social-links-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .social-link {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a4744;
          transition: var(--transition);
        }

        .social-link:hover {
          background: var(--primary-gold);
          color: #ffffff;
          border-color: var(--primary-gold);
        }

        .footer-nav-col {
          display: flex;
          flex-direction: column;
        }

        .footer-col-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1918;
          margin-bottom: 16px;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links-list a {
          font-size: 0.82rem;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .footer-links-list a:hover {
          color: var(--primary-gold);
        }

        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .contact-icon {
          color: var(--primary-gold);
          flex-shrink: 0;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid #f0eae1;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bottom-links a {
          color: var(--text-muted);
        }

        .bottom-links a:hover {
          color: var(--primary-gold);
        }

        @media (max-width: 960px) {
          .footer-top-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
