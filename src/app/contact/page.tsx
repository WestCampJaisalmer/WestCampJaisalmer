"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  Headphones, 
  ShieldCheck, 
  Sparkles, 
  Star,
  Calendar,
  ChevronDown,
  Maximize2,
  Plus,
  Minus,
  Compass
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanTripModal from "@/components/PlanTripModal";
import SearchResultsModal from "@/components/SearchResultsModal";
import { openWhatsApp, getWhatsAppUrl } from "@/utils/whatsapp";
import { recordEnquiry } from "@/utils/enquiry";

export default function ContactPage() {
  // Modal states
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      setFormError("Please fill in all required fields (*).");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const message = `📩 *NEW CONTACT INQUIRY - WEST CAMP JAISALMER* 📩

👤 *Full Name:* ${formData.fullName.trim()}
📧 *Email Address:* ${formData.email.trim()}
📱 *Phone Number:* ${formData.phone.trim() || "Not provided"}
📅 *Travel Date:* ${formData.travelDate || "Flexible / Not decided"}
🎯 *Subject:* ${formData.subject}
💬 *Message:*
${formData.message.trim()}

_Please respond via WhatsApp or call._`;

    const url = getWhatsAppUrl(message);
    setLastWhatsAppUrl(url);
    recordEnquiry({
      type: "contact",
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      subject: formData.subject,
      message: formData.message.trim(),
      details: { travelDate: formData.travelDate || "Flexible / not decided" },
    });
    openWhatsApp(message);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const scrollToLocation = () => {
    const el = document.getElementById("our-location");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#1F2022] antialiased">
      {/* Top Navbar */}
      <Navbar
        onPlanTripClick={() => setIsPlanTripOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Hero Banner Section with bg_01_contact.png */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 lg:pb-10 overflow-hidden border-b border-[#EBDCC8]/90 bg-[#FAF6F0]">
        {/* Panoramic Fort Background Image (bg_01_contact.png) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/contacts/bg_01_contact.png"
            alt="Jaisalmer Golden Fort at sunset with traditional jharokha balcony and glowing lanterns"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-top sm:object-right"
          />
          {/* Subtle soft gradient overlay on the left so typography is razor-sharp across all screen sizes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 to-transparent sm:via-[#FAF6F0]/85 md:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#FAF6F0]/80 sm:hidden pointer-events-none" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 py-6">
          <div className="max-w-2xl lg:max-w-4xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-1.5 text-[#8C765E]">
              <Link href="/" className="hover:text-gold transition-colors">
                HOME
              </Link>
              <span className="text-[#C68339] font-bold">›</span>
              <span className="text-[#C68339] font-bold">CONTACT</span>
            </div>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="font-sans text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#AF6E26]">
                GET IN TOUCH WITH LOCAL EXPERTS
              </span>
              <span className="w-6 sm:w-10 h-[1.5px] bg-[#C97F2C]" />
            </div>

            {/* Page Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#123038] tracking-tight leading-[1.12] mb-2 sm:mb-2.5 text-center sm:text-left">
              Contact Us
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#5C5A55] max-w-xl font-normal leading-relaxed mb-5 sm:mb-7 text-center sm:text-left mx-auto sm:mx-0">
              We&apos;re here to help you plan your perfect Jaisalmer experience. Reach out for desert camps, fort havelis, safaris, or custom trip advice.
            </p>

            {/* 4 Trust Highlights / Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-5 pt-1 w-full max-w-md sm:max-w-none">
              {/* Badge 1: 24/7 Support */}
              <div className="flex items-center justify-start gap-2 sm:gap-2.5 bg-white/80 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 rounded-[5px] border border-[#E9DAC6]/70 sm:border-0 shadow-2xs sm:shadow-none text-left">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center shrink-0 shadow-xs border border-[#E9DAC6]">
                  <Headphones size={16} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[11px] sm:text-sm font-bold text-[#142B36] leading-tight truncate">
                    24/7 Support
                  </span>
                  <span className="font-sans text-[9.5px] sm:text-xs text-[#7A7670] leading-tight truncate">
                    We&apos;re always here
                  </span>
                </div>
              </div>

              {/* Badge 2: Trusted Travel Experts */}
              <div className="flex items-center justify-start gap-2 sm:gap-2.5 bg-white/80 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 rounded-[5px] border border-[#E9DAC6]/70 sm:border-0 shadow-2xs sm:shadow-none text-left">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center shrink-0 shadow-xs border border-[#E9DAC6]">
                  <ShieldCheck size={17} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[11px] sm:text-sm font-bold text-[#142B36] leading-tight truncate">
                    Trusted Experts
                  </span>
                  <span className="font-sans text-[9.5px] sm:text-xs text-[#7A7670] leading-tight truncate">
                    Plan with confidence
                  </span>
                </div>
              </div>

              {/* Badge 3: Local Guidance */}
              <div className="flex items-center justify-start gap-2 sm:gap-2.5 bg-white/80 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 rounded-[5px] border border-[#E9DAC6]/70 sm:border-0 shadow-2xs sm:shadow-none text-left">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center shrink-0 shadow-xs border border-[#E9DAC6]">
                  <MapPin size={16} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[11px] sm:text-sm font-bold text-[#142B36] leading-tight truncate">
                    Local Guidance
                  </span>
                  <span className="font-sans text-[9.5px] sm:text-xs text-[#7A7670] leading-tight truncate">
                    Authentic Thar info
                  </span>
                </div>
              </div>

              {/* Badge 4: Personalized Trips */}
              <div className="flex items-center justify-start gap-2 sm:gap-2.5 bg-white/80 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 rounded-[5px] border border-[#E9DAC6]/70 sm:border-0 shadow-2xs sm:shadow-none text-left">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4E8D8] text-[#B07129] flex items-center justify-center shrink-0 shadow-xs border border-[#E9DAC6]">
                  <Star size={16} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[11px] sm:text-sm font-bold text-[#142B36] leading-tight truncate">
                    Custom Trips
                  </span>
                  <span className="font-sans text-[9.5px] sm:text-xs text-[#7A7670] leading-tight truncate">
                    Tailored to your needs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: 3-Column Layout matching reference image */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: "Get In Touch" Card */}
          <div className="lg:col-span-4 xl:col-span-3 bg-[#FAF4EB] border border-[#ECDDC7] rounded-[5px] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#123038] tracking-tight">
                Get In Touch
              </h2>
              {/* Gold underline accent bar */}
              <div className="w-9 h-[2.5px] bg-[#C97F2C] mt-1.5 mb-3 rounded-full" />

              <p className="font-sans text-xs text-[#63615C] leading-relaxed mb-6">
                Have questions about our packages, need a custom tour plan, or just want to know more about Jaisalmer? Our team is here to help.
              </p>

              {/* Contact Info Items List */}
              <div className="space-y-4 sm:space-y-4.5">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <a
                      href="tel:+917877221729"
                      className="font-sans font-bold text-xs sm:text-sm text-[#1B2B34] hover:text-[#B07129] transition-colors"
                    >
                      +91 78772 21729
                    </a>
                    <span className="font-sans text-[11px] text-[#7D7973]">
                      Mon - Sun, 8:00 AM - 10:00 PM
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col">
                    <a
                      href="mailto:bk3661758@gmail.com"
                      className="font-sans font-bold text-xs sm:text-sm text-[#1B2B34] hover:text-[#B07129] transition-colors break-all"
                    >
                      bk3661758@gmail.com
                    </a>
                    <span className="font-sans text-[11px] text-[#7D7973]">
                      We reply within 24 hours
                    </span>
                  </div>
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-bold text-xs sm:text-sm text-[#1B2B34]">
                      Jaisalmer, Rajasthan, India
                    </span>
                    <button 
                      onClick={scrollToLocation}
                      className="font-sans text-[11px] text-[#B07129] hover:underline text-left"
                    >
                      Visit our office
                    </button>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-bold text-xs sm:text-sm text-[#1B2B34]">
                      Mon - Sun : 8:00 AM - 10:00 PM
                    </span>
                    <span className="font-sans text-[11px] text-[#7D7973]">
                      Our support hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Social Icons */}
            <div className="mt-8 pt-5 border-t border-[#ECDDC7]">
              <span className="block font-sans text-xs font-bold text-[#1B2B34] tracking-wider uppercase mb-3">
                Follow Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#D9C7B0] text-[#7D6C57] hover:border-[#B07129] hover:text-white hover:bg-[#B07129] transition-all flex items-center justify-center shadow-xs"
                  aria-label="Instagram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#D9C7B0] text-[#7D6C57] hover:border-[#B07129] hover:text-white hover:bg-[#B07129] transition-all flex items-center justify-center shadow-xs"
                  aria-label="Facebook"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#D9C7B0] text-[#7D6C57] hover:border-[#B07129] hover:text-white hover:bg-[#B07129] transition-all flex items-center justify-center shadow-xs"
                  aria-label="YouTube"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
                  </svg>
                </a>
                {/* Pinterest */}
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#D9C7B0] text-[#7D6C57] hover:border-[#B07129] hover:text-white hover:bg-[#B07129] transition-all flex items-center justify-center shadow-xs"
                  aria-label="Pinterest"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.057.24-.19.291-.439.175-1.638-.762-2.664-3.154-2.664-5.076 0-4.135 3.008-7.935 8.672-7.935 4.553 0 8.092 3.246 8.092 7.581 0 4.524-2.854 8.163-6.814 8.163-1.331 0-2.584-.692-3.013-1.509l-.821 3.13c-.298 1.144-1.104 2.578-1.644 3.453 1.229.379 2.534.584 3.89.584 6.622 0 11.99-5.368 11.99-11.988C24.007 5.367 18.639 0 12.017 0z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: "Send Us a Message" Form Card */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white border border-[#E9DFD1] rounded-[5px] p-6 sm:p-7 md:p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#123038] tracking-tight mb-1">
              Send Us a Message
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6C6962] mb-6">
              Fill out the form below and we&apos;ll get back to you shortly.
            </p>

            {isSubmitted ? (
              <div className="bg-[#FAF6EE] border border-[#ECDCC7] rounded-xl p-6 sm:p-8 text-center my-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 bg-[#E8F8EE] text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#123038] mb-1">
                  Inquiry Sent on WhatsApp!
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#63615C] max-w-md mx-auto mb-5 leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Your message has been prepared for our Jaisalmer travel desk on WhatsApp. We will reply promptly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  {lastWhatsAppUrl && (
                    <a
                      href={lastWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-sans text-xs font-bold hover:bg-[#20bd5a] transition-all shadow-xs"
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        travelDate: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#123038] text-white font-sans text-xs font-semibold hover:bg-[#1c4753] transition-all shadow-xs"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[5px] font-medium">
                    {formError}
                  </div>
                )}

                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                      Full Name <span className="text-[#AF6E26]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] placeholder:text-[#A8A49C] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                      Email Address <span className="text-[#AF6E26]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="yourname@example.com"
                      required
                      className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] placeholder:text-[#A8A49C] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number & Travel Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 78772 21729"
                      className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] placeholder:text-[#A8A49C] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                      Travel Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Subject */}
                <div>
                  <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                    Subject <span className="text-[#AF6E26]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] appearance-none transition-all cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="Desert Camp Booking">Desert Camp & Swiss Tent Booking</option>
                      <option value="Heritage Hotel Booking">Heritage Haveli & Palace Stay</option>
                      <option value="Camel & Jeep Safari">Camel & 4x4 Dune Bashing Safari</option>
                      <option value="Custom Tour Package">Customized Tour / Honeymoon Package</option>
                      <option value="Group & Corporate">Corporate Retreat / Group Event</option>
                      <option value="General Inquiry">General Inquiry & Travel Advice</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D7973]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                {/* Row 4: Your Message */}
                <div>
                  <label className="block font-sans text-[11px] sm:text-xs font-semibold text-[#1B2B34] mb-1.5">
                    Your Message <span className="text-[#AF6E26]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your travel plans, requirements or any questions..."
                    required
                    className="w-full border border-[#E2D7C7] rounded-[5px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1B2B34] placeholder:text-[#A8A49C] focus:border-[#B07129] focus:ring-1 focus:ring-[#B07129] focus:outline-none bg-[#FCFBF8] transition-all resize-y min-h-[110px]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-sans font-bold py-3 px-6 rounded-lg text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={17} />
                  <span>{isSubmitting ? "Opening WhatsApp..." : "Send Message on WhatsApp"}</span>
                </button>
              </form>
            )}
          </div>

          {/* COLUMN 3: Featured Visual & Quick Contact Options */}
          <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-5">
            {/* Top Featured Visual Card: contact_02.png with script text */}
            <div className="relative h-[190px] sm:h-[210px] rounded-[5px] overflow-hidden shadow-md border border-[#E5D7C3] group">
              <Image
                src="/images/contacts/contact_02.png"
                alt="Jaisalmer Fort terrace with royal seating and evening sunset glow"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle evening twilight vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Elegant script text on the bottom right matching reference */}
              <div className="absolute bottom-3.5 right-4 z-10 text-right">
                <span 
                  className="font-script text-2xl sm:text-[1.75rem] text-white font-bold tracking-wide leading-tight block drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Let&apos;s Plan<br />Your Jaisalmer<br />Getaway
                </span>
              </div>
            </div>

            {/* Quick Contact Options Card with 2x2 Action Grid */}
            <div>
              <h3 className="font-serif text-lg font-bold text-[#123038] tracking-tight mb-3">
                Quick Contact Options
              </h3>

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {/* 1. Chat on WhatsApp */}
                <a
                  href="https://wa.me/917877221729?text=Hello!%20I%20would%20like%20to%20inquire%20about%20Jaisalmer%20tours%20and%20camps."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-[#E9DFD1] hover:border-[#25D366] rounded-[5px] p-3 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <MessageCircle size={15} className="fill-current" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-xs font-bold text-[#1B2B34] truncate">
                        Chat on WhatsApp
                      </span>
                      <span className="font-sans text-[10px] text-[#7D7973] truncate">
                        Instant Support
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#C68339] group-hover:translate-x-1 transition-transform shrink-0" />
                </a>

                {/* 2. Call Us Now */}
                <a
                  href="tel:+917877221729"
                  className="bg-white border border-[#E9DFD1] hover:border-[#B07129] rounded-[5px] p-3 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Phone size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-xs font-bold text-[#1B2B34] truncate">
                        Call Us Now
                      </span>
                      <span className="font-sans text-[10px] text-[#7D7973] truncate">
                        +91 78772 21729
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#C68339] group-hover:translate-x-1 transition-transform shrink-0" />
                </a>

                {/* 3. Email Us */}
                <a
                  href="mailto:bk3661758@gmail.com"
                  className="bg-white border border-[#E9DFD1] hover:border-[#B07129] rounded-[5px] p-3 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-xs font-bold text-[#1B2B34] truncate">
                        Email Us
                      </span>
                      <span className="font-sans text-[10px] text-[#7D7973] truncate">
                        bk3661758@gmail.com
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#C68339] group-hover:translate-x-1 transition-transform shrink-0" />
                </a>

                {/* 4. Visit Our Office */}
                <button
                  type="button"
                  onClick={scrollToLocation}
                  className="bg-white border border-[#E9DFD1] hover:border-[#B07129] rounded-[5px] p-3 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#B07129] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <MapPin size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-xs font-bold text-[#1B2B34] truncate">
                        Visit Our Office
                      </span>
                      <span className="font-sans text-[10px] text-[#7D7973] truncate">
                        Jaisalmer, Rajasthan
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#C68339] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: "Our Location" Panoramic Map Container matching reference */}
        <section 
          id="our-location" 
          className="mt-8 sm:mt-12 relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#E7DAC7] shadow-sm bg-[#FAF5EB]"
        >
          {/* Mobile Info Header Card (Centered on mobile, hidden on sm+) */}
          <div className="sm:hidden p-4 bg-white/95 border-b border-[#E7DAC7] text-center flex flex-col items-center">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#C97F2C] mb-1">
              VISIT OUR OFFICE
            </span>
            <h3 className="font-serif text-xl font-bold text-[#123038] tracking-tight">
              Our Location in Jaisalmer
            </h3>
            <div className="w-8 h-[2px] bg-[#C97F2C] mt-1 mb-2 rounded-full" />
            <p className="font-sans text-xs text-[#63615C] leading-relaxed mb-3 max-w-sm">
              Visit us at our office in the heart of Jaisalmer. We&apos;d love to meet you and help plan your next desert journey.
            </p>
            <div className="flex items-center gap-2 w-full max-w-xs justify-center">
              <a
                href="https://maps.google.com/?q=Jaisalmer+Fort+Rajasthan+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#AF6E26] hover:bg-[#975D1D] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all"
              >
                <MapPin size={13} />
                <span>Get Directions</span>
                <ArrowRight size={12} />
              </a>
              <button
                type="button"
                onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DECDB3] bg-[#FAF6F0] hover:bg-white text-xs font-semibold text-[#123038] transition-colors"
              >
                <Maximize2 size={13} />
                <span>{showInteractiveMap ? "Scenic Map" : "Google Map"}</span>
              </button>
            </div>
          </div>

          {/* Panoramic Map & Dune Silhouette Background: bg_03_contact.png */}
          <div className="relative h-[270px] sm:h-[400px] lg:h-[440px] w-full overflow-hidden">
            {showInteractiveMap ? (
              <iframe
                title="Jaisalmer Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113476.99443657738!2d70.83540545938833!3d26.915748729577907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3947bc647898510b%3A0x6b4cf8794c4897f2!2sJaisalmer%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full min-h-[270px] sm:min-h-[400px] lg:min-h-[440px] border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div 
                className="relative w-full h-full min-h-[270px] sm:min-h-[400px] lg:min-h-[440px] transition-transform duration-300"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <Image
                  src="/images/contacts/bg_03_contact.png"
                  alt="Our Location Map in Jaisalmer with desert dunes, Fort backdrop, and camel caravan"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            )}

            {/* Desktop Left Content Card Overlay (Visible on sm+ screens) */}
            <div className="hidden sm:block absolute top-6 left-6 z-20 max-w-sm bg-white/90 backdrop-blur-md border border-[#E9DFD1] p-5 rounded-xl shadow-md">
              <h3 className="font-serif text-2xl font-bold text-[#123038] tracking-tight">
                Our Location
              </h3>
              <div className="w-8 h-[2px] bg-[#C97F2C] mt-1 mb-2 rounded-full" />
              
              <p className="font-sans text-xs text-[#63615C] leading-relaxed mb-4">
                Visit us at our office in the heart of Jaisalmer.<br />
                We&apos;d love to meet you and help plan your next adventure.
              </p>

              <a
                href="https://maps.google.com/?q=Jaisalmer+Fort+Rajasthan+India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#AF6E26] hover:bg-[#975D1D] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all group"
              >
                <MapPin size={14} />
                <span>Get Directions</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Floating Jaisalmer Pin Badge in Map Area */}
            {!showInteractiveMap && (
              <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-md shadow-lg border border-[#E5D7C3] animate-pulse">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 animate-ping absolute" />
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-600 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="font-sans text-[11px] sm:text-xs font-bold text-[#142B36] leading-none">
                    Jaisalmer
                  </span>
                  <span className="font-sans text-[9px] sm:text-[10px] text-[#7A7670]">
                    Rajasthan, India
                  </span>
                </div>
              </div>
            )}

            {/* Map Controls (Top Right) */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md text-[#142B36] border border-[#E2D7C7] hover:bg-white hover:text-[#B07129] shadow-xs flex items-center justify-center transition-colors"
                title={showInteractiveMap ? "Switch to Scenic Map" : "Switch to Google Map"}
                aria-label="Toggle map view"
              >
                <Maximize2 size={14} />
              </button>

              {!showInteractiveMap && (
                <>
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.min(prev + 0.15, 1.4))}
                    className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md text-[#142B36] border border-[#E2D7C7] hover:bg-white hover:text-[#B07129] shadow-xs flex items-center justify-center transition-colors font-bold text-base"
                    title="Zoom In"
                    aria-label="Zoom in"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.max(prev - 0.15, 0.9))}
                    className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md text-[#142B36] border border-[#E2D7C7] hover:bg-white hover:text-[#B07129] shadow-xs flex items-center justify-center transition-colors font-bold text-base"
                    title="Zoom Out"
                    aria-label="Zoom out"
                  >
                    <Minus size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Decorative bottom trim gradient blending into page */}
            <div className="absolute bottom-0 inset-x-0 h-8 sm:h-10 bg-gradient-to-t from-[#FAF6F0]/70 to-transparent pointer-events-none" />
          </div>
        </section>
      </main>

      {/* Unified Site Footer */}
      <Footer />

      {/* Plan Trip Modal for CTA and Navigation */}
      <PlanTripModal
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />

      {/* Search Modal */}
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchParams={{ destination: "all" }}
        onSelectItem={() => {}}
      />
    </div>
  );
}
