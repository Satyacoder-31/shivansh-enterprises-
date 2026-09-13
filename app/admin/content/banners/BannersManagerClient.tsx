"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageSection } from "@/types/database";
import { savePageSection } from "@/lib/actions/admin";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { Save, Check, ExternalLink, Sliders, Layers, ImageIcon, ShoppingBag } from "lucide-react";

interface BannersManagerClientProps {
  initialServicesBanner: PageSection | null;
  initialGalleryBanner: PageSection | null;
  initialShopBanner: PageSection | null;
}

export default function BannersManagerClient({
  initialServicesBanner,
  initialGalleryBanner,
  initialShopBanner,
}: BannersManagerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "gallery" | "shop">("services");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Services Banner State
  const [servicesEyebrow, setServicesEyebrow] = useState(initialServicesBanner?.subtitle || "Engineering Capabilities");
  const [servicesTitle, setServicesTitle] = useState(initialServicesBanner?.title || "SPECIALIZED DISCIPLINES.");
  const [servicesDesc, setServicesDesc] = useState(
    initialServicesBanner?.description || 
    "End-to-end design, deployment, liaisoning, and maintenance across CCTV security, architectural LED illumination, and turnkey rooftop solar power."
  );

  // 2. Gallery Banner State
  const [galleryEyebrow, setGalleryEyebrow] = useState(initialGalleryBanner?.subtitle || "Visual Portfolio");
  const [galleryTitle, setGalleryTitle] = useState(initialGalleryBanner?.title || "PROJECT INSTALLATIONS.");
  const [galleryDesc, setGalleryDesc] = useState(
    initialGalleryBanner?.description || 
    "A photographic and technical record of executed CCTV perimeter networks, luxury architectural lighting designs, and turnkey rooftop solar arrays throughout Saurashtra."
  );

  // 3. Shop Banner State
  const [shopEyebrow, setShopEyebrow] = useState(initialShopBanner?.subtitle || "Official Product Registry");
  const [shopTitle, setShopTitle] = useState(initialShopBanner?.title || "AUTHENTIC HARDWARE CATALOG.");
  const [shopDesc, setShopDesc] = useState(
    initialShopBanner?.description || 
    "Verified manufacturer specifications, zero fabricated pricing, and authentic test parameters. Directly from official brand brochures."
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      if (activeTab === "services") {
        await savePageSection({
          id: initialServicesBanner?.id,
          page_slug: "services",
          section_key: "hero_banner",
          title: servicesTitle,
          subtitle: servicesEyebrow,
          description: servicesDesc,
          content: {},
          display_order: 1,
          is_active: true,
        });
      } else if (activeTab === "gallery") {
        await savePageSection({
          id: initialGalleryBanner?.id,
          page_slug: "gallery",
          section_key: "hero_banner",
          title: galleryTitle,
          subtitle: galleryEyebrow,
          description: galleryDesc,
          content: {},
          display_order: 1,
          is_active: true,
        });
      } else if (activeTab === "shop") {
        await savePageSection({
          id: initialShopBanner?.id,
          page_slug: "shop",
          section_key: "hero_banner",
          title: shopTitle,
          subtitle: shopEyebrow,
          description: shopDesc,
          content: {},
          display_order: 1,
          is_active: true,
        });
      }

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save banner: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-gold" />
            <span>PAGE BANNERS <span className="text-gold">CMS</span></span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Customize header banners, titles, eyebrows, and intro descriptions across Services, Gallery, and Shop pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={activeTab === "services" ? "/services" : activeTab === "gallery" ? "/gallery" : "/shop"}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
            <span>View Live Page</span>
          </a>

          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold/15">
        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "services"
              ? "bg-gold text-black font-bold shadow-md"
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "gallery"
              ? "bg-gold text-black font-bold shadow-md"
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shop")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "shop"
              ? "bg-gold text-black font-bold shadow-md"
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Catalog Banner</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "services" && (
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">Services Page Header Banner</h2>
            
            <div>
              <label className="form-label text-xs">Banner Eyebrow</label>
              <input
                type="text"
                value={servicesEyebrow}
                onChange={(e) => setServicesEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Headline Title</label>
              <input
                type="text"
                value={servicesTitle}
                onChange={(e) => setServicesTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Subtitle / Description</label>
              <textarea
                rows={3}
                value={servicesDesc}
                onChange={(e) => setServicesDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">Gallery & Portfolio Page Banner</h2>
            
            <div>
              <label className="form-label text-xs">Banner Eyebrow</label>
              <input
                type="text"
                value={galleryEyebrow}
                onChange={(e) => setGalleryEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Headline Title</label>
              <input
                type="text"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Subtitle / Description</label>
              <textarea
                rows={3}
                value={galleryDesc}
                onChange={(e) => setGalleryDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === "shop" && (
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">Shop / Hardware Catalog Banner</h2>
            
            <div>
              <label className="form-label text-xs">Banner Eyebrow</label>
              <input
                type="text"
                value={shopEyebrow}
                onChange={(e) => setShopEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Headline Title</label>
              <input
                type="text"
                value={shopTitle}
                onChange={(e) => setShopTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Banner Subtitle / Description</label>
              <textarea
                rows={3}
                value={shopDesc}
                onChange={(e) => setShopDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-gold flex items-center gap-2 px-8"
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes..." : "Save Banner Content"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
