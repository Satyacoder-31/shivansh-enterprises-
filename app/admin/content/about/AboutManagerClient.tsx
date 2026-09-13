"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageSection } from "@/types/database";
import { savePageSection } from "@/lib/actions/admin";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { Save, Check, ExternalLink, Award, ShieldCheck, Plus, Trash2 } from "lucide-react";

interface AboutManagerClientProps {
  initialBanner: PageSection | null;
  initialFoundation: PageSection | null;
  initialPillars: PageSection | null;
  initialQualityMandates?: PageSection | null;
}

export default function AboutManagerClient({
  initialBanner,
  initialFoundation,
  initialPillars,
  initialQualityMandates,
}: AboutManagerClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Banner State
  const [bannerTitle, setBannerTitle] = useState(initialBanner?.title || "DEFINING RELIABILITY IN SAURASHTRA.");
  const [bannerSubtitle, setBannerSubtitle] = useState(initialBanner?.subtitle || "ENGINEERING HERITAGE");
  const [bannerDesc, setBannerDesc] = useState(initialBanner?.description || "Based in Keshod, Gujarat, Sivansh Enterprise was established with a singular conviction: critical security, illumination, and clean energy infrastructures must be engineered without compromise.");

  // 2. Foundation Section State
  const [foundTitle, setFoundTitle] = useState(initialFoundation?.title || "BUILT TO PROTECT, ILLUMINATE & EMPOWER.");
  const [foundSubtitle, setFoundSubtitle] = useState(initialFoundation?.subtitle || "OUR FOUNDATION");
  const [para1, setPara1] = useState(initialFoundation?.content?.body_paragraph_1 || "In an industry frequently clouded by gray-market imports and inflated marketing claims, Sivansh Enterprise operates strictly with authentic, BIS-ER and STQC certified hardware. Every camera model number in our catalog reflects an official manufacturer datasheet.");
  const [para2, setPara2] = useState(initialFoundation?.content?.body_paragraph_2 || "From luxury villas across Junagadh requiring spotless architectural cove lighting to remote agricultural perimeters demanding 10-day autonomous solar 4G cameras, we execute turnkey engineering from technical survey to final commissioning.");
  const [foundMediaUrl, setFoundMediaUrl] = useState(initialFoundation?.content?.media_url || "/assets/images/lifestyle/commercial-security.jpg");
  const [btn1Text, setBtn1Text] = useState(initialFoundation?.content?.primary_btn_text || "Explore Disciplines");
  const [btn1Url, setBtn1Url] = useState(initialFoundation?.content?.primary_btn_url || "/services");
  const [btn2Text, setBtn2Text] = useState(initialFoundation?.content?.secondary_btn_text || "Consult With Us");
  const [btn2Url, setBtn2Url] = useState(initialFoundation?.content?.secondary_btn_url || "/contact");

  // 3. Pillars State
  const [pillarsTitle, setPillarsTitle] = useState(initialPillars?.title || "OUR GUIDING PILLARS");
  const [pillarsSubtitle, setPillarsSubtitle] = useState(initialPillars?.subtitle || "CORE VALUES");
  const [pillarsCards, setPillarsCards] = useState<Array<{ num: string; title: string; desc: string }>>(
    initialPillars?.content?.cards || [
      {
        num: "01 / Mission",
        title: "Uncompromised Engineering",
        desc: "To deliver industrial-grade security, museum-caliber illumination, and maximum-yield solar power built specifically for Saurashtra climate conditions."
      },
      {
        num: "02 / Vision",
        title: "Regional Benchmark",
        desc: "To establish Sivansh Enterprise as Gujarat most trusted turnkey technological engineering partner across residential, commercial, and agricultural sectors."
      },
      {
        num: "03 / Standards",
        title: "Certified Authenticity",
        desc: "Zero tolerance for counterfeit components. Only BIS-ER, STQC, and Tier-1 certified systems backed by comprehensive warranty documentation."
      }
    ]
  );

  // 4. Quality Mandates State
  const [qmTitle, setQmTitle] = useState(initialQualityMandates?.title || "VERIFIED ACCREDITATIONS");
  const [qmSubtitle, setQmSubtitle] = useState(initialQualityMandates?.subtitle || "Quality Mandates");
  const [qmDesc, setQmDesc] = useState(initialQualityMandates?.description || "Our products and installations comply with BIS-ER standards tested through accredited STQC laboratories, CE, RoHS, and IEC 61215/61730 solar generation norms.");
  const [qmBadges, setQmBadges] = useState<string[]>(
    initialQualityMandates?.content?.badges || [
      "BIS-ER Certified",
      "Accredited STQC Tested",
      "Tier-1 TopCon Solar",
      "IK10 Vandal-Proof",
      "CRI 95+ Photometric"
    ]
  );
  const [newBadge, setNewBadge] = useState("");

  const addBadge = () => {
    if (!newBadge.trim()) return;
    setQmBadges([...qmBadges, newBadge.trim()]);
    setNewBadge("");
  };

  const removeBadge = (idx: number) => {
    setQmBadges(qmBadges.filter((_, i) => i !== idx));
  };

  const updateBadge = (idx: number, val: string) => {
    const next = [...qmBadges];
    next[idx] = val;
    setQmBadges(next);
  };

  const updateCard = (index: number, field: "num" | "title" | "desc", val: string) => {
    const next = [...pillarsCards];
    next[index][field] = val;
    setPillarsCards(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Save Banner
      await savePageSection({
        page_slug: "about",
        section_key: "hero_banner",
        title: bannerTitle,
        subtitle: bannerSubtitle,
        description: bannerDesc,
        content: initialBanner?.content || {},
        display_order: 1,
        is_active: true,
      });

      // 2. Save Foundation Section
      await savePageSection({
        page_slug: "about",
        section_key: "foundation",
        title: foundTitle,
        subtitle: foundSubtitle,
        description: para1,
        content: {
          body_paragraph_1: para1,
          body_paragraph_2: para2,
          media_url: foundMediaUrl,
          primary_btn_text: btn1Text,
          primary_btn_url: btn1Url,
          secondary_btn_text: btn2Text,
          secondary_btn_url: btn2Url,
        },
        display_order: 2,
        is_active: true,
      });

      // 3. Save Pillars Section
      await savePageSection({
        page_slug: "about",
        section_key: "pillars",
        title: pillarsTitle,
        subtitle: pillarsSubtitle,
        description: initialPillars?.description || "",
        content: {
          cards: pillarsCards,
        },
        display_order: 3,
        is_active: true,
      });

      // 4. Save Quality Mandates Section
      await savePageSection({
        page_slug: "about",
        section_key: "quality_mandates",
        title: qmTitle,
        subtitle: qmSubtitle,
        description: qmDesc,
        content: {
          badges: qmBadges,
        },
        display_order: 4,
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

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#c5a059]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif tracking-wider text-white">About Page CMS</h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              Customize company heritage, philosophy, showcase media, and guiding mission pillars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
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

      {/* 1. Header Banner */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-serif text-white tracking-wide uppercase">
            1. Header Banner Section
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">Top introduction banner of the About Us page.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Eyebrow / Subtitle
            </label>
            <input
              type="text"
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Banner Headline Title
            </label>
            <input
              type="text"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
            Introductory Summary
          </label>
          <textarea
            rows={2}
            value={bannerDesc}
            onChange={(e) => setBannerDesc(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Foundation Section with Photo */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-serif text-white tracking-wide uppercase">
            2. Our Foundation & Heritage Section
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            The core story and engineering operations photo displayed on the About page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={foundSubtitle}
              onChange={(e) => setFoundSubtitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Headline
            </label>
            <input
              type="text"
              value={foundTitle}
              onChange={(e) => setFoundTitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Story Paragraph 1 (Authenticity & Standards)
            </label>
            <textarea
              rows={4}
              value={para1}
              onChange={(e) => setPara1(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Story Paragraph 2 (Turnkey Scope & Geography)
            </label>
            <textarea
              rows={4}
              value={para2}
              onChange={(e) => setPara2(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Foundation Image Uploader */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
          <MediaUploadInput
            label="Operations Showcase Image"
            value={foundMediaUrl}
            mediaType="image"
            folder="general"
            onChange={(url) => setFoundMediaUrl(url)}
            helperText="High-resolution image showcasing technicians, engineers, or company operations."
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Button 1 Label
            </label>
            <input
              type="text"
              value={btn1Text}
              onChange={(e) => setBtn1Text(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Button 1 URL
            </label>
            <input
              type="text"
              value={btn1Url}
              onChange={(e) => setBtn1Url(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Button 2 Label
            </label>
            <input
              type="text"
              value={btn2Text}
              onChange={(e) => setBtn2Text(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Button 2 URL
            </label>
            <input
              type="text"
              value={btn2Url}
              onChange={(e) => setBtn2Url(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Guiding Pillars (3 Cards) */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-sm font-serif text-white tracking-wide uppercase">
            3. Guiding Pillars & Core Values
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">The 3 core value cards: Mission, Vision, and Certified Standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Pillars Eyebrow
            </label>
            <input
              type="text"
              value={pillarsSubtitle}
              onChange={(e) => setPillarsSubtitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Pillars Title
            </label>
            <input
              type="text"
              value={pillarsTitle}
              onChange={(e) => setPillarsTitle(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {pillarsCards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3"
            >
              <span className="text-xs font-mono uppercase text-[#c5a059] block">
                Pillar {idx + 1}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={card.num}
                    onChange={(e) => updateCard(idx, "num", e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(idx, "title", e.target.value)}
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
                  value={card.desc}
                  onChange={(e) => updateCard(idx, "desc", e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quality Mandates & Accreditations Section */}
      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-5">
        <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-serif text-white tracking-wide uppercase">
              4. Quality Mandates & Verified Accreditations Section
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize the quality mandates headline, laboratory compliance narrative, and certification checkmark badges.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 self-start sm:self-auto">
            Accreditations Box
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={qmSubtitle}
              onChange={(e) => setQmSubtitle(e.target.value)}
              placeholder="e.g. Quality Mandates"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Section Headline Title *
            </label>
            <input
              type="text"
              required
              value={qmTitle}
              onChange={(e) => setQmTitle(e.target.value)}
              placeholder="e.g. VERIFIED ACCREDITATIONS"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
            Accreditations Overview Description
          </label>
          <textarea
            rows={3}
            value={qmDesc}
            onChange={(e) => setQmDesc(e.target.value)}
            placeholder="Describe certifications, standards compliance, and testing laboratories..."
            className="w-full bg-[#1c1c1c] border border-white/10 rounded p-3 text-xs text-white focus:border-[#c5a059] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Accreditation Badges Manager */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-[#c5a059] block font-semibold">
                Accreditation Badges & Certification Tags
              </span>
              <span className="text-[11px] text-neutral-400">
                These tags display with a checkmark across the quality mandates ribbon on the live website.
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              {qmBadges.length} Active Badges
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {qmBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 focus-within:border-[#c5a059]"
              >
                <span className="text-xs text-[#c5a059] font-bold">✓</span>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => updateBadge(idx, e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                  placeholder="e.g. BIS-ER Certified"
                />
                <button
                  type="button"
                  onClick={() => removeBadge(idx)}
                  className="text-neutral-500 hover:text-rose-400 text-xs p-1 transition-colors"
                  title="Remove badge"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Badge Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBadge();
                }
              }}
              placeholder="Type new accreditation (e.g. ISO 9001, CE Certified)..."
              className="flex-1 bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
            <button
              type="button"
              onClick={addBadge}
              className="px-4 py-2 bg-[#c5a059] hover:bg-[#b08d4b] text-black font-semibold rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              <span>Add Badge</span>
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 bg-black/50 border border-[#c5a059]/20 rounded-lg text-center">
          <div className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider mb-2">Live Accreditation Preview</div>
          <div className="text-xs uppercase font-mono text-[#c5a059] mb-1">{qmSubtitle || "Quality Mandates"}</div>
          <h3 className="text-lg font-serif text-white mb-2">{qmTitle || "VERIFIED ACCREDITATIONS"}</h3>
          <p className="text-xs text-neutral-400 max-w-xl mx-auto mb-4 leading-relaxed">{qmDesc}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#c5a059]">
            {qmBadges.map((badge, idx) => (
              <span key={idx} className="flex items-center gap-1.5 bg-[#c5a059]/10 px-2.5 py-1 rounded border border-[#c5a059]/20">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
