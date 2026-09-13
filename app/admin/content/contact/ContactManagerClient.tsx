"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageSection } from "@/types/database";
import { savePageSection } from "@/lib/actions/admin";
import { Save, Check, ExternalLink, MapPin, MessageSquare, Clock } from "lucide-react";

interface ContactManagerClientProps {
  initialBanner: PageSection | null;
  initialOperational: PageSection | null;
}

export default function ContactManagerClient({
  initialBanner,
  initialOperational,
}: ContactManagerClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Hero Banner State
  const [bannerTitle, setBannerTitle] = useState(
    initialBanner?.title || "CONTACT SIVANSH ENTERPRISE."
  );
  const [bannerSubtitle, setBannerSubtitle] = useState(
    initialBanner?.subtitle || "DIRECT CONSULTATION"
  );
  const [bannerDesc, setBannerDesc] = useState(
    initialBanner?.description ||
      "Schedule an on-site survey or discuss technical specifications directly with our engineering staff in Keshod."
  );
  const [badgeText, setBadgeText] = useState(
    initialBanner?.content?.badge || "Direct Engineering Line"
  );
  const [responseTime, setResponseTime] = useState(
    initialBanner?.content?.response_time || "2-Hour Response Guarantee"
  );

  // 2. Operational & Form State
  const [coverageTitle, setCoverageTitle] = useState(
    initialOperational?.title || "Operational Coverage"
  );
  const [coverageDesc, setCoverageDesc] = useState(
    initialOperational?.description ||
      "We deploy certified technicians across Junagadh District, Keshod, Veraval, Somnath, Porbandar, and surrounding Saurashtra agricultural & industrial zones with rapid dispatch."
  );
  const [formTitle, setFormTitle] = useState(
    initialOperational?.content?.form_title || "Request Quotation or Site Audit"
  );
  const [formSubtitle, setFormSubtitle] = useState(
    initialOperational?.content?.form_subtitle ||
      "Complete the technical brief below and our lead engineer will respond promptly."
  );
  const [mapEmbedUrl, setMapEmbedUrl] = useState(
    initialOperational?.content?.map_embed_url ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59400!2d70.24!3d21.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bf54d2417777777%3A0x123456789abcdef!2sKeshod%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Save Hero Banner Section
      await savePageSection({
        id: initialBanner?.id,
        page_slug: "contact",
        section_key: "hero_banner",
        title: bannerTitle,
        subtitle: bannerSubtitle,
        description: bannerDesc,
        content: {
          badge: badgeText,
          response_time: responseTime,
        },
        display_order: 1,
        is_active: true,
      });

      // 2. Save Operational & Map Section
      await savePageSection({
        id: initialOperational?.id,
        page_slug: "contact",
        section_key: "operational_info",
        title: coverageTitle,
        subtitle: "REGIONAL DISPATCH",
        description: coverageDesc,
        content: {
          form_title: formTitle,
          form_subtitle: formSubtitle,
          map_embed_url: mapEmbedUrl,
        },
        display_order: 2,
        is_active: true,
      });

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert("Failed to save Contact Page CMS: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif text-white tracking-wide">
              Contact Page CMS
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-gold/10 text-gold border border-gold/30 rounded-full uppercase tracking-wider">
              Live Synced
            </span>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Customize header banners, response commitments, operational radius, and interactive maps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            <span>View Live Page</span>
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-neutral-950 font-semibold text-sm transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : savedSuccess ? (
              <>
                <Check size={16} className="text-emerald-950" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Publish Updates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in">
          <Check size={18} className="text-emerald-400" />
          <span>Contact Page CMS successfully published to live website! Changes are immediately live.</span>
        </div>
      )}

      {/* SECTION 1: HERO HEADER BANNER */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
            <MessageSquare size={16} />
            <span>Hero Header Section</span>
          </div>
          <h2 className="text-lg font-serif text-white mt-1">
            Top Banner & Page Header
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Eyebrow Subtitle
            </label>
            <input
              type="text"
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. DIRECT CONSULTATION"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Main Headline
            </label>
            <input
              type="text"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none font-serif"
              placeholder="e.g. CONTACT SIVANSH ENTERPRISE."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Lead Description
            </label>
            <textarea
              rows={3}
              value={bannerDesc}
              onChange={(e) => setBannerDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="Introductory instructions for visitors..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Badge Tag
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Direct Engineering Line"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Response Guarantee Tag
            </label>
            <input
              type="text"
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. 2-Hour Response Time"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: OPERATIONAL COVERAGE & INQUIRY FORM */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
            <MapPin size={16} />
            <span>Regional Coverage & Lead Form</span>
          </div>
          <h2 className="text-lg font-serif text-white mt-1">
            Service Coverage Card & Quotation Form Content
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Operational Coverage Title
            </label>
            <input
              type="text"
              value={coverageTitle}
              onChange={(e) => setCoverageTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none font-serif"
              placeholder="e.g. Operational Coverage"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Operational Coverage Description
            </label>
            <textarea
              rows={3}
              value={coverageDesc}
              onChange={(e) => setCoverageDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="Areas and districts served by your technical staff..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Quotation Form Heading
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none font-serif"
              placeholder="e.g. Request Quotation or Site Audit"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Quotation Form Subtitle
            </label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="e.g. Complete the technical brief below..."
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: GOOGLE MAPS EMBED */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
            <MapPin size={16} />
            <span>Interactive Map Embed</span>
          </div>
          <h2 className="text-lg font-serif text-white mt-1">
            Showroom / Office Google Maps Embed URL
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Paste the standard embed URL (`https://www.google.com/maps/embed?...`) from Google Maps &gt; Share &gt; Embed a map.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Map Iframe Embed URL
          </label>
          <input
            type="text"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:border-gold focus:outline-none"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>

        {mapEmbedUrl && (
          <div className="mt-4 rounded-lg overflow-hidden border border-neutral-800 h-64 bg-neutral-950">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Map Preview"
            />
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-4 p-4 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-xl">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gold hover:bg-gold-light text-neutral-950 font-bold text-sm transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Changes...</span>
          ) : savedSuccess ? (
            <>
              <Check size={18} />
              <span>Saved & Live!</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save & Publish Live</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
