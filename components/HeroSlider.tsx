"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/types/database";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides && slides.length > 0 ? slides : [
    {
      id: "fallback-1",
      eyebrow: "Surveillance Architecture",
      title: "SECURITY,",
      highlighted_text: "ELEVATED.",
      description: "Advanced CCTV solutions designed to bring greater visibility and unwavering confidence to your residential estate, commercial enterprise, or agricultural property.",
      primary_btn_text: "Explore CCTV",
      primary_btn_url: "/cctv",
      secondary_btn_text: "Get a Quote",
      secondary_btn_url: "/contact",
      media_url: "/assets/images/hero/hero-cctv.jpg",
      media_type: "image" as const,
      display_order: 1,
      is_active: true
    }
  ];

  // Automatic cycle every 4.5 seconds
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length, isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section 
      className="domain-hero-section hero-carousel-section relative overflow-hidden min-h-[540px] md:min-h-[640px] flex items-center" 
      id="hero-carousel" 
      aria-label="Cinematic Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media Slides - Stretched over to the top header section (identical to CCTV) */}
      <div className="domain-hero-bg absolute inset-0 z-0">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div 
              key={slide.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.media_type === "video" ? (
                <video 
                  src={slide.media_url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="hero-bg-media w-full h-full object-cover" 
                />
              ) : (
                <img 
                  src={slide.media_url} 
                  alt={slide.title} 
                  className="hero-bg-media w-full h-full object-cover" 
                  fetchPriority={idx === 0 ? "high" : "low"} 
                />
              )}
              <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/20"></div>
            </div>
          );
        })}
      </div>

      {/* Hero Content Container - Matching CCTV section with pt-36 pb-20 */}
      <div className="container relative z-10 pt-36 pb-20 w-full">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          if (!isActive) return null;
          return (
            <div 
              key={slide.id} 
              className="max-w-2xl transition-all duration-700 ease-out"
            >
              <div className="eyebrow text-gold mb-2">{slide.eyebrow}</div>
              <h1 className="serif-heading section-title text-4xl md:text-5xl mb-4 text-white">
                {slide.title}
                {slide.highlighted_text && (
                  <>
                    {" "}
                    <span className="text-gold-gradient">{slide.highlighted_text}</span>
                  </>
                )}
              </h1>
              <p className="page-header-sub text-secondary text-base md:text-lg mb-8 leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={slide.primary_btn_url} className="btn btn-gold">
                  {slide.primary_btn_text}
                </Link>
                {slide.secondary_btn_text && slide.secondary_btn_url && (
                  <Link href={slide.secondary_btn_url} className="btn btn-gold-outline">
                    {slide.secondary_btn_text}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="hero-indicators absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Previous & Next Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button 
            type="button" 
            className="hero-nav-arrow hero-arrow-prev" 
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            ‹
          </button>
          <button 
            type="button" 
            className="hero-nav-arrow hero-arrow-next" 
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
