"use client";

import React from "react";
import { ShieldCheck, Award, Users, Headphones } from "lucide-react";

export default function ValueProps() {
  const items = [
    {
      icon: <ShieldCheck size={26} className="prop-icon" />,
      title: "Best Price Guarantee",
      desc: "No hidden charges",
    },
    {
      icon: <Award size={26} className="prop-icon" />,
      title: "Handpicked Properties",
      desc: "Verified stays & camps",
    },
    {
      icon: <Users size={26} className="prop-icon" />,
      title: "Local Experts",
      desc: "Authentic experiences",
    },
    {
      icon: <Headphones size={26} className="prop-icon" />,
      title: "24/7 Support",
      desc: "We're here for you",
    },
  ];

  return (
    <section className="value-props-section">
      <div className="container">
        <div className="props-grid">
          {items.map((item, index) => (
            <div key={index} className="prop-item">
              <div className="icon-wrap">{item.icon}</div>
              <div className="prop-text">
                <h4 className="prop-title">{item.title}</h4>
                <p className="prop-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .value-props-section {
          padding: 44px 0 60px;
          background: var(--desert-sand);
          border-bottom: 1px solid rgba(226, 216, 203, 0.4);
        }

        .props-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .prop-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .prop-item:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-gold);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }

        .prop-item:hover .icon-wrap {
          background: var(--primary-gold);
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(201, 127, 44, 0.35);
          transform: scale(1.1) rotate(6deg);
        }

        .prop-text {
          display: flex;
          flex-direction: column;
        }

        .prop-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }

        .prop-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .props-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .props-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
