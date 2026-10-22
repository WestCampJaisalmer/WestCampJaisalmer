"use client";

import React from "react";
import { ShieldCheck, Award, Users, Headphones } from "lucide-react";

export default function ValueProps() {
  const items = [
    {
      icon: <ShieldCheck size={20} className="sm:w-6 sm:h-6" />,
      title: "Best Price Guarantee",
      desc: "No hidden charges",
    },
    {
      icon: <Award size={20} className="sm:w-6 sm:h-6" />,
      title: "Handpicked Stays",
      desc: "Verified stays & camps",
    },
    {
      icon: <Users size={20} className="sm:w-6 sm:h-6" />,
      title: "Local Experts",
      desc: "Authentic experiences",
    },
    {
      icon: <Headphones size={20} className="sm:w-6 sm:h-6" />,
      title: "24/7 Support",
      desc: "We're here for you",
    },
  ];

  return (
    <section className="py-6 sm:py-10 md:py-14 bg-cream border-b border-border-light">
      <div className="max-w-[1300px] mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-[6px] bg-white sm:bg-transparent transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-subtle border border-border-light/50 sm:border-transparent hover:border-border-light cursor-default shadow-xs sm:shadow-none"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 min-w-[36px] min-h-[36px] sm:min-w-[48px] sm:min-h-[48px] rounded-[5px] bg-[#FAF4E8] sm:bg-white flex items-center justify-center text-gold shadow-xs shrink-0 transition-all duration-300 group-hover:bg-gold group-hover:text-white group-hover:scale-105">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-sans font-bold text-xs sm:text-sm md:text-[0.95rem] text-text-main group-hover:text-gold-dark transition-colors truncate sm:whitespace-normal">
                  {item.title}
                </h4>
                <p className="font-sans text-[10.5px] sm:text-xs text-text-muted mt-0.5 truncate sm:whitespace-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
