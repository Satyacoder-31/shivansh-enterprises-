"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PageSection } from "@/types/database";
import { savePageSection } from "@/lib/actions/admin";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { Save, Check, ExternalLink, ShieldCheck, Zap, Sun, Package, Plus } from "lucide-react";

interface DomainPageManagerClientProps {
  pageSlug: "cctv" | "led" | "solar";
  pageTitle: string;
  initialHeroBanner: PageSection | null;
  initialStandards: PageSection | null;
  initialProductsHeader?: PageSection | null;
}

export default function DomainPageManagerClient({
  pageSlug,
  pageTitle,
  initialHeroBanner,
  initialStandards,
  initialProductsHeader,
}: DomainPageManagerClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hero Banner State
  const [heroTitle, setHeroTitle] = useState(initialHeroBanner?.title || "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialHeroBanner?.subtitle || "");
  const [heroDesc, setHeroDesc] = useState(initialHeroBanner?.description || "");
  const [heroMediaUrl, setHeroMediaUrl] = useState(initialHeroBanner?.content?.media_url || `/assets/images/hero/hero-${pageSlug}.jpg`);
  const [heroMediaType, setHeroMediaType] = useState<"image" | "video">(initialHeroBanner?.content?.media_type || "image");
  const [heroPrimaryBtnText, setHeroPrimaryBtnText] = useState(initialHeroBanner?.content?.primary_btn_text || "Explore Hardware");
  const [heroPrimaryBtnUrl, setHeroPrimaryBtnUrl] = useState(initialHeroBanner?.content?.primary_btn_url || `#${pageSlug}-hardware`);
  const [heroSecondaryBtnText, setHeroSecondaryBtnText] = useState(initialHeroBanner?.content?.secondary_btn_text || "Request Audit");
  const [heroSecondaryBtnUrl, setHeroSecondaryBtnUrl] = useState(initialHeroBanner?.content?.secondary_btn_url || "/contact");

  // Standards Section State
  const [standardsTitle, setStandardsTitle] = useState(initialStandards?.title || "ENGINEERING STANDARDS");
  const [standardsSubtitle, setStandardsSubtitle] = useState(initialStandards?.subtitle || "CORE BENCHMARKS");
  const [pillars, setPillars] = useState<Array<{ num: string; title: string; desc: string }>>(
    initialStandards?.content?.pillars || [
      { num: "01", title: "Standard One", desc: "Detailed technical specification description." },
      { num: "02", title: "Standard Two", desc: "Detailed technical specification description." },
      { num: "03", title: "Standard Three", desc: "Detailed technical specification description." }
    ]
  );

  // Products Showcase Section State
  const defaultProductsSubtitle = 
    pageSlug === "cctv" ? "Verified Hardware" : 
    pageSlug === "led" ? "Verified Fixtures" : "Solar Modules & Arrays";
  const defaultProductsTitle = 
    pageSlug === "cctv" ? "AUTHENTIC CCTV" : 
    pageSlug === "led" ? "ARCHITECTURAL" : "MONOCRYSTALLINE";
  const defaultProductsHighlight = 
    pageSlug === "cctv" ? "SOLUTIONS." : 
    pageSlug === "led" ? "LED SUITE." : "SOLAR SUITE.";

  const [productsSubtitle, setProductsSubtitle] = useState(
    initialProductsHeader?.subtitle || defaultProductsSubtitle
  );
  const [productsTitle, setProductsTitle] = useState(
    initialProductsHeader?.title || defaultProductsTitle
  );
  const [productsHighlight, setProductsHighlight] = useState(
    initialProductsHeader?.content?.highlighted_text || defaultProductsHighlight
  );

  const updatePillar = (index: number, field: "num" | "title" | "desc", val: string) => {
    const next = [...pillars];
    next[index][field] = val;
    setPillars(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Save Hero Banner Section
      await savePageSection({
        page_slug: pageSlug,
        section_key: "hero_banner",
        title: heroTitle,
        subtitle: heroSubtitle,
        description: heroDesc,
        content: {
          media_url: heroMediaUrl,
          media_type: heroMediaType,
          primary_btn_text: heroPrimaryBtnText,
          primary_btn_url: heroPrimaryBtnUrl,
          secondary_btn_text: heroSecondaryBtnText,
          secondary_btn_url: heroSecondaryBtnUrl,
        },
        display_order: 1,
        is_active: true,
      });

      // 2. Save Standards Section
      await savePageSection({
        page_slug: pageSlug,
        section_key: "standards",
        title: standardsTitle,
        subtitle: standardsSubtitle,
        description: initialStandards?.description || "",
        content: {
          pillars: pillars,
        },
        display_order: 2,
        is_active: true,
      });

      // 3. Save Products Showcase Section Header
      await savePageSection({
        page_slug: pageSlug,
        section_key: "products_header",
        title: productsTitle,
        subtitle: productsSubtitle,
        description: "",
        content: {
          highlighted_text: productsHighlight,
        },
        display_order: 3,
        is_active: true,
      });

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getIcon = () => {
    if (pageSlug === "cctv") return <ShieldCheck className="w-5 h-5 text-[#c5a059]" />;
    if (pageSlug === "led") return <Zap className="w-5 h-5 text-[#c5a059]" />;
    return <Sun className="w-5 h-5 text-[#c5a059]" />;
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-serif tracking-wider text-white">
              {pageTitle} Page CMS
            </h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              Customize hero banner headlines, background image or video, and engineering standard pillars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${pageSlug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>View Live Page</span>
          </a>

          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-luxury px-6 py-2.5 rounded-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Page"}</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Banner Media & Content */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-serif text-white tracking-wide uppercase">
            1. Hero Banner Section
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full-width top section with background media, main headline, and primary call-to-actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Eyebrow / Subtitle
            </label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="e.g. SURVEILLANCE ARCHITECTURE DIVISION"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Main Headline Title *
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="e.g. PERIMETER SECURITY, ENGINEERED FOR GUJARAT."
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
            Description Paragraph
          </label>
          <textarea
            rows={3}
            value={heroDesc}
            onChange={(e) => setHeroDesc(e.target.value)}
            placeholder="Detailed overview of capabilities, certifications, and target applications..."
            className="w-full bg-[#1c1c1c] border border-white/10 rounded p-3 text-xs text-white focus:border-[#c5a059] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Hero Background Media Uploader */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-[#c5a059]">
              Hero Background Media (Image or Video)
            </span>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`mediaType-${pageSlug}`}
                  checked={heroMediaType === "image"}
                  onChange={() => setHeroMediaType("image")}
                  className="accent-[#c5a059]"
                />
                <span>Image</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`mediaType-${pageSlug}`}
                  checked={heroMediaType === "video"}
                  onChange={() => setHeroMediaType("video")}
                  className="accent-[#c5a059]"
                />
                <span>Video (MP4 / WebM)</span>
              </label>
            </div>
          </div>

          <MediaUploadInput
            label="Background Media File"
            value={heroMediaUrl}
            mediaType={heroMediaType}
            folder="hero"
            onChange={(url, detectedType) => {
              setHeroMediaUrl(url);
              if (detectedType) setHeroMediaType(detectedType);
            }}
            helperText="Upload a high-res photo (1920x1080) or cinematic video clip. Changes will display instantly on the live page."
          />
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Primary Button Label
            </label>
            <input
              type="text"
              value={heroPrimaryBtnText}
              onChange={(e) => setHeroPrimaryBtnText(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Primary Button URL
            </label>
            <input
              type="text"
              value={heroPrimaryBtnUrl}
              onChange={(e) => setHeroPrimaryBtnUrl(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Secondary Button Label
            </label>
            <input
              type="text"
              value={heroSecondaryBtnText}
              onChange={(e) => setHeroSecondaryBtnText(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Secondary Button URL
            </label>
            <input
              type="text"
              value={heroSecondaryBtnUrl}
              onChange={(e) => setHeroSecondaryBtnUrl(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Engineering Standards / 3 Pillar Cards */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-serif text-white tracking-wide uppercase">
            2. Core Standards & Capabilities Section
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            The 3 benchmark feature cards highlighting technical advantages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={standardsSubtitle}
              onChange={(e) => setStandardsSubtitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={standardsTitle}
              onChange={(e) => setStandardsTitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="space-y-4 pt-2">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3"
            >
              <span className="text-xs font-mono uppercase text-[#c5a059] block">
                Pillar Card 0{idx + 1}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Badge / Number
                  </label>
                  <input
                    type="text"
                    value={pillar.num}
                    onChange={(e) => updatePillar(idx, "num", e.target.value)}
                    placeholder="e.g. 01 / Autonomous 4G"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => updatePillar(idx, "title", e.target.value)}
                    placeholder="e.g. 10-Day Battery Autonomy"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Card Description
                </label>
                <textarea
                  rows={2}
                  value={pillar.desc}
                  onChange={(e) => updatePillar(idx, "desc", e.target.value)}
                  placeholder="Explain why this feature matters for clients..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Products Hardware Showcase Section ("Authentic Solutions") */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-serif text-white tracking-wide uppercase">
              3. Hardware Solutions Showcase Section
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize the section header and manage the hardware grid displayed below Core Capabilities.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 self-start sm:self-auto">
            {pageSlug.toUpperCase()} Catalog Grid
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={productsSubtitle}
              onChange={(e) => setProductsSubtitle(e.target.value)}
              placeholder="e.g. Verified Hardware"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Main Title
            </label>
            <input
              type="text"
              value={productsTitle}
              onChange={(e) => setProductsTitle(e.target.value)}
              placeholder="e.g. AUTHENTIC CCTV"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Highlighted Gold Text
            </label>
            <input
              type="text"
              value={productsHighlight}
              onChange={(e) => setProductsHighlight(e.target.value)}
              placeholder="e.g. SOLUTIONS."
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Live Preview of Header */}
        <div className="p-4 bg-black/40 border border-[#c5a059]/15 rounded-lg">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mb-2">
            Live Header Preview
          </div>
          <div className="text-center py-4 bg-[#0e0e0e] rounded border border-white/5">
            <div className="text-xs uppercase tracking-wider font-mono text-[#c5a059] mb-1">
              {productsSubtitle || "Verified Hardware"}
            </div>
            <h3 className="text-xl font-serif text-white">
              {productsTitle || "AUTHENTIC CCTV"}{" "}
              <span className="text-[#c5a059]">{productsHighlight || "SOLUTIONS."}</span>
            </h3>
          </div>
        </div>

        {/* Product Catalog Direct Manager Callout */}
        <div className="p-4 bg-[#181818] border border-[#c5a059]/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Individual {pageSlug.toUpperCase()} Products in this Grid
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                The product cards appearing inside this grid (photos, prices, specifications, and stock) are managed directly in your Hardware Catalog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/admin/products?category=${pageSlug}`}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              <Package size={13} className="text-[#c5a059]" />
              <span>View {pageSlug.toUpperCase()} Products</span>
            </Link>
            <Link
              href="/admin/products/new"
              className="px-3.5 py-2 bg-[#c5a059] hover:bg-[#b08d4b] text-black font-semibold rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              <span>+ Add New Product</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
