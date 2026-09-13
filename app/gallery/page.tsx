import React from "react";
import { getGalleryItems, getPageSections } from "@/lib/actions/admin";
import GalleryClient from "./GalleryClient";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function GalleryPage() {
  const [items, sections] = await Promise.all([
    getGalleryItems(),
    getPageSections("gallery"),
  ]);

  const bannerSec = sections.find((s) => s.section_key === "hero_banner");
  const bannerEyebrow = bannerSec?.subtitle || "Visual Portfolio";
  const bannerTitle = bannerSec?.title || "PROJECT INSTALLATIONS.";
  const bannerDesc = bannerSec?.description || 
    "A photographic and technical record of executed CCTV perimeter networks, luxury architectural lighting designs, and turnkey rooftop solar arrays throughout Saurashtra.";
  const bannerMediaUrl = bannerSec?.content?.media_url || "/assets/images/hero/hero-gallery.jpg";

  return (
    <div className="gallery-page-container">
      {/* Header Hero Section with Background Image */}
      <section className="domain-hero-section relative overflow-hidden min-h-[440px] flex items-center">
        <div className="domain-hero-bg absolute inset-0 z-0">
          <img 
            src={bannerMediaUrl} 
            alt="Sivansh Enterprise Project Installations Portfolio" 
            className="hero-bg-media w-full h-full object-cover" 
          />
          <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/70 to-black/80"></div>
        </div>

        <div className="container relative z-10 pt-36 pb-20 text-center">
          <div className="eyebrow text-gold mb-2">{bannerEyebrow}</div>
          <h1 className="serif-heading section-title text-3xl md:text-5xl mb-4 text-white">
            {bannerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-secondary text-sm md:text-base leading-relaxed">
            {bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="section-pad">
        <div className="container">
          <GalleryClient items={items} />
        </div>
      </section>
    </div>
  );
}
