"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Building2, Tent, Compass } from "lucide-react";

interface ExperienceBannerProps {
  onSelectCategory: (category: string) => void;
}

export default function ExperienceBanner({ onSelectCategory }: ExperienceBannerProps) {
  const experiences = [
    {
      id: "hotels",
      title: "Hotels",
      desc: "Heritage stays with modern comforts",
      icon: <Building2 size={16} />,
      image: "/images/golden-palace.jpg",
      link: "#hotels",
    },
    {
      id: "camps",
      title: "Camps",
      desc: "Luxury desert camps in the Thar Desert",
      icon: <Tent size={16} />,
      image: "/images/royal-camp.jpg",
      link: "#camps",
    },
    {
      id: "tours",
      title: "Tours & Activities",
      desc: "Forts, dunes, culture and local experiences",
      icon: <Compass size={16} />,
      image: "/images/jeep-safari.jpg",
      link: "#tours",
    },
  ];

  return (
    <section className="experience-banner-section">
      <div className="container">
        <div className="exp-banner-grid">
          {/* Left Text */}
          <div className="exp-text-block">
            <h2 className="exp-title">
              Choose Your<br />
              Perfect Experience
            </h2>
            <p className="exp-desc">
              Stays, camps, tours and unique activities crafted for every kind of traveler.
            </p>
            <a href="#hotels" className="btn-explore-all">
              <span>Explore All</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Right 3 Experience Cards */}
          <div className="exp-cards-row">
            {experiences.map((item) => (
              <a 
                href={item.link} 
                key={item.id} 
                className="exp-card"
                onClick={(e) => {
                  onSelectCategory(item.id);
                }}
              >
                <div className="exp-card-img-wrap">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="exp-card-img"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                  <div className="exp-card-overlay" />
                </div>

                <div className="exp-card-content">
                  <div className="exp-badge">
                    <span className="exp-icon">{item.icon}</span>
                    <span className="exp-name">{item.title}</span>
                  </div>
                  <p className="exp-card-desc">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .experience-banner-section {
          background: #123038;
          padding: 60px 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .experience-banner-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 10% 20%, rgba(201, 127, 44, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 90% 80%, rgba(223, 151, 69, 0.1) 0%, transparent 40%);
          pointer-events: none;
        }

        .exp-banner-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .exp-text-block {
          display: flex;
          flex-direction: column;
        }

        .exp-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1.2;
          color: #ffffff;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }

        .exp-desc {
          font-size: 0.9rem;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 24px;
        }

        .btn-explore-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: #c57d29;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          width: fit-content;
          transition: var(--transition);
          box-shadow: 0 4px 14px rgba(197, 125, 41, 0.4);
        }

        .btn-explore-all:hover {
          background: #b16c1f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(197, 125, 41, 0.5);
        }

        .exp-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .exp-card {
          position: relative;
          height: 220px;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .exp-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.35);
          border-color: rgba(201, 127, 44, 0.5);
        }

        .exp-card-img-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .exp-card-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .exp-card:hover .exp-card-img {
          transform: scale(1.08);
        }

        .exp-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(18, 48, 56, 0.1) 0%,
            rgba(18, 48, 56, 0.4) 40%,
            rgba(11, 26, 31, 0.9) 100%
          );
        }

        .exp-card-content {
          position: relative;
          z-index: 2;
        }

        .exp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .exp-icon {
          color: #f7d299;
          display: flex;
          align-items: center;
        }

        .exp-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .exp-card-desc {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.82);
          line-height: 1.35;
        }

        @media (max-width: 960px) {
          .exp-banner-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .exp-cards-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 680px) {
          .exp-cards-row {
            grid-template-columns: 1fr;
          }
          .exp-card {
            height: 180px;
          }
        }
      `}</style>
    </section>
  );
}
