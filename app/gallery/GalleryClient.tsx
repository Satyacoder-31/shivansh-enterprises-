"use client";

import React, { useState } from "react";
import type { GalleryItem } from "@/types/database";

interface GalleryClientProps {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const categories = [
    { label: "All Projects", value: "all" },
    { label: "CCTV Surveillance", value: "cctv" },
    { label: "Architectural LED", value: "led" },
    { label: "Rooftop Solar", value: "solar" },
  ];

  return (
    <div className="gallery-client-wrapper">
      {/* Category Pills */}
      <div className="category-filter-pills flex justify-center flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`filter-pill ${selectedCategory === c.value ? "active" : ""}`}
            onClick={() => setSelectedCategory(c.value)}
          >
            {c.label} ({c.value === "all" ? items.length : items.filter((i) => i.category === c.value).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="gallery-item-card group cursor-pointer overflow-hidden rounded bg-surface border border-gold/20 relative"
            onClick={() => setPreviewItem(item)}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={item.thumbnail_url || item.media_url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 right-3 text-xs uppercase px-2 py-1 rounded bg-black/70 text-gold border border-gold/30">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              {item.caption && (
                <p className="text-secondary text-xs mt-1 line-clamp-2">{item.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="max-w-4xl w-full bg-carbon-800 rounded border border-gold/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-gold/20">
              <h3 className="font-serif text-xl text-gold">{previewItem.title}</h3>
              <button 
                type="button" 
                className="text-muted hover:text-white text-2xl font-bold px-2"
                onClick={() => setPreviewItem(null)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              {previewItem.media_type === "video" ? (
                <video src={previewItem.media_url} controls autoPlay className="max-h-[70vh] w-auto" />
              ) : (
                <img src={previewItem.media_url} alt={previewItem.title} className="max-h-[70vh] w-auto object-contain" />
              )}
            </div>
            {previewItem.caption && (
              <div className="p-4 text-sm text-secondary border-t border-gold/10">
                {previewItem.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
