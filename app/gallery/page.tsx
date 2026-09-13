import React from "react";
import { getGalleryItems } from "@/lib/actions/admin";
import GalleryClient from "./GalleryClient";

export const revalidate = 0;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="gallery-page-container">
      {/* Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm text-center">
        <div className="container">
          <div className="eyebrow text-gold">Visual Portfolio</div>
          <h1 className="serif-heading section-title">
            PROJECT <span className="text-gold-gradient">INSTALLATIONS.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary">
            A photographic and technical record of executed CCTV perimeter networks, luxury architectural 
            lighting designs, and turnkey rooftop solar arrays throughout Saurashtra.
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
