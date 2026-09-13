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

  return (
    <div className="gallery-page-container">
      {/* Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm text-center">
        <div className="container">
          <div className="eyebrow text-gold">{bannerEyebrow}</div>
          <h1 className="serif-heading section-title">
            {bannerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-secondary">
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
