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
      className="hero-carousel-section" 
      id="hero-carousel" 
      aria-label="Cinematic Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-track">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div 
              key={slide.id} 
              className={`hero-slide ${isActive ? "active" : ""}`}
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                position: isActive ? "relative" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {slide.media_type === "video" ? (
                <video 
                  src={slide.media_url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="hero-bg-media" 
                />
              ) : (
                <img 
                  src={slide.media_url} 
                  alt={slide.title} 
                  className="hero-bg-media" 
                  fetchPriority={idx === 0 ? "high" : "low"}
                />
              )}
              <div className="hero-overlay"></div>

              <div className="container hero-content">
                <div className="eyebrow">{slide.eyebrow}</div>
                <h1 className="serif-heading">
                  {slide.title}
                  {slide.highlighted_text && (
                    <>
                      <br />
                      <span className="text-gold-gradient">{slide.highlighted_text}</span>
                    </>
                  )}
                </h1>
                <p>{slide.description}</p>
                <div className="hero-actions">
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
            </div>
          );
        })}
      </div>

      {/* Manual Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="hero-indicators">
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
