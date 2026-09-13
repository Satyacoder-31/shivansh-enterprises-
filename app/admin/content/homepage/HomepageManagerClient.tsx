"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroSlide, PageSection } from "@/types/database";
import { saveHeroSlide, deleteHeroSlide, savePageSection } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Save, 
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  PhoneCall,
  Sliders,
  Check
} from "lucide-react";

interface HomepageManagerClientProps {
  initialSlides: HeroSlide[];
  initialSections: PageSection[];
}

export default function HomepageManagerClient({ initialSlides, initialSections }: HomepageManagerClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"slides" | "about" | "services" | "advantage" | "cta" | "visibility">("slides");
  
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Find existing section data helper
  const getSection = (key: string) => sections.find(s => s.section_key === key);

  // --------------------------------------------------------------------------
  // About Preview Section State
  // --------------------------------------------------------------------------
  const aboutSec = getSection("about_preview");
  const [aboutEyebrow, setAboutEyebrow] = useState(aboutSec?.subtitle || "Sivansh Enterprise");
  const [aboutTitle, setAboutTitle] = useState(aboutSec?.title || "ENGINEERING PERFECTION FOR SAURASHTRA.");
  const [aboutLeadText, setAboutLeadText] = useState(
    aboutSec?.content?.lead_text || 
    aboutSec?.description || 
    "Headquartered in Keshod, Gujarat, Sivansh Enterprise is the premier technology partner for estate owners, commercial enterprises, and modern agricultural setups who demand uncompromising reliability in surveillance, illumination, and clean energy."
  );
  const [aboutBodyText, setAboutBodyText] = useState(
    aboutSec?.content?.body_text || 
    "We bridge the gap between authentic global certifications (STQC, BIS-ER, Tier-1 Solar) and local on-ground execution. Whether securing remote agricultural boundaries with autonomous 4G solar optics or sculpting luxury residences with zero-glare honeycomb LED lighting, our work defines benchmarks."
  );
  const [aboutPrimaryBtnText, setAboutPrimaryBtnText] = useState(aboutSec?.content?.primary_btn_text || "Our Engineering Philosophy");
  const [aboutPrimaryBtnUrl, setAboutPrimaryBtnUrl] = useState(aboutSec?.content?.primary_btn_url || "/about");
  const [aboutSecondaryBtnText, setAboutSecondaryBtnText] = useState(aboutSec?.content?.secondary_btn_text || "Schedule Site Survey");
  const [aboutSecondaryBtnUrl, setAboutSecondaryBtnUrl] = useState(aboutSec?.content?.secondary_btn_url || "/contact");

  const [aboutStats, setAboutStats] = useState<Array<{ num: string; label: string; sub: string }>>(
    aboutSec?.content?.stats || [
      { num: "100%", label: "Authentic Brand Hardware", sub: "Strict adherence to official manufacturer specifications." },
      { num: "10-Day", label: "Solar Battery Autonomy", sub: "Wire-free perimeter security even through monsoon overcast." },
      { num: "CRI 95+", label: "Architectural LED Optics", sub: "Museum-grade color fidelity for marble, wood, and gold leaf." },
      { num: "25-Year", label: "Solar Output Warranty", sub: "N-Type TopCon bifacial generation designed for Gujarat heat." }
    ]
  );

  const updateAboutStat = (index: number, field: "num" | "label" | "sub", value: string) => {
    const updated = [...aboutStats];
    updated[index][field] = value;
    setAboutStats(updated);
  };

  // --------------------------------------------------------------------------
  // Services Header Section State
  // --------------------------------------------------------------------------
  const servicesSec = getSection("services_header") || getSection("services");
  const [servicesEyebrow, setServicesEyebrow] = useState(servicesSec?.subtitle || "Technical Disciplines");
  const [servicesTitle, setServicesTitle] = useState(servicesSec?.title || "BESPOKE SOLUTIONS. ZERO COMPROMISE.");
  const [servicesDesc, setServicesDesc] = useState(
    servicesSec?.description || 
    "Three synchronized engineering divisions addressing the critical pillars of modern properties."
  );

  // --------------------------------------------------------------------------
  // Sivansh Advantage / Why Choose Us Section State
  // --------------------------------------------------------------------------
  const advantageSec = getSection("why_choose_us");
  const [advEyebrow, setAdvEyebrow] = useState(advantageSec?.subtitle || "THE SIVANSH BENCHMARK");
  const [advTitle, setAdvTitle] = useState(advantageSec?.title || "TECHNICAL RIGOR. ZERO SHORTCUTS.");
  const [advDesc, setAdvDesc] = useState(
    advantageSec?.description || 
    "Why prominent families and commercial operators throughout Junagadh & Saurashtra choose our firm."
  );

  const [advPillars, setAdvPillars] = useState<Array<{ num: string; title: string; subtitle?: string; desc: string }>>(
    advantageSec?.content?.pillars || [
      {
        num: "01",
        title: "Accredited STQC & BIS Certification",
        subtitle: "Verified Authentic",
        desc: "Surveillance cameras verified through accredited testing laboratories with genuine serial tracking."
      },
      {
        num: "02",
        title: "Zero-Glare Honeycomb Optics",
        subtitle: "Visual Comfort",
        desc: "Architectural downlights engineered with deep UGR < 13 baffles preventing optical fatigue in luxury spaces."
      },
      {
        num: "03",
        title: "End-to-End Solar Liaisoning",
        subtitle: "Full Approvals",
        desc: "From shadow modeling to DISCOM bi-directional net-metering synchronization and government subsidy approvals."
      },
      {
        num: "04",
        title: "Rapid On-Ground Technical Support",
        subtitle: "Keshod Headquarters",
        desc: "Dedicated local field engineers stationed in Keshod, delivering rapid emergency breakdown response."
      }
    ]
  );

  const updateAdvPillar = (index: number, field: "num" | "title" | "subtitle" | "desc", value: string) => {
    const updated = [...advPillars];
    updated[index][field] = value;
    setAdvPillars(updated);
  };

  // --------------------------------------------------------------------------
  // Consultation CTA Section State
  // --------------------------------------------------------------------------
  const ctaSec = getSection("cta");
  const [ctaEyebrow, setCtaEyebrow] = useState(ctaSec?.subtitle || "DIRECT CONSULTATION");
  const [ctaTitle, setCtaTitle] = useState(ctaSec?.title || "READY TO ELEVATE YOUR PROPERTY?");
  const [ctaDesc, setCtaDesc] = useState(
    ctaSec?.description || 
    "Consult with our lead technical specialists in Keshod. We conduct on-site perimeter audits, lux-level simulations, and solar generation feasibility reports."
  );
  const [ctaHotline, setCtaHotline] = useState(ctaSec?.content?.hotline || "+91 7533838538");
  const [ctaAddress, setCtaAddress] = useState(ctaSec?.content?.address || "Station Road, Near Bus Stand, Keshod, Gujarat");
  const [ctaHours, setCtaHours] = useState(ctaSec?.content?.hours || "Mon - Sat: 9:00 AM - 8:30 PM");
  const [ctaFormTitle, setCtaFormTitle] = useState(ctaSec?.content?.form_title || "Request Professional Survey");
  const [ctaFormSub, setCtaFormSub] = useState(ctaSec?.content?.form_subtitle || "Receive a comprehensive technical proposal within 24 hours.");
  const [ctaPrimaryBtnText, setCtaPrimaryBtnText] = useState(ctaSec?.content?.primary_btn_text || "Request Consultation");
  const [ctaPrimaryBtnUrl, setCtaPrimaryBtnUrl] = useState(ctaSec?.content?.primary_btn_url || "/contact");
  const [ctaSecondaryBtnText, setCtaSecondaryBtnText] = useState(ctaSec?.content?.secondary_btn_text || "Message on WhatsApp");
  const [ctaSecondaryBtnUrl, setCtaSecondaryBtnUrl] = useState(ctaSec?.content?.secondary_btn_url || "https://wa.me/917533838538");

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setLoading(true);
    setSuccessMsg("");

    try {
      const saved = await saveHeroSlide(editingSlide);
      if (editingSlide.id) {
        setSlides(slides.map(s => s.id === saved.id ? saved : s));
      } else {
        setSlides([...slides, saved]);
      }
      setEditingSlide(null);
      setSuccessMsg("Hero slide saved and updated on live website!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to save slide.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    try {
      await deleteHeroSlide(id);
      setSlides(slides.filter(s => s.id !== id));
      setSuccessMsg("Hero slide deleted.");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete slide.");
    }
  };

  const handleSaveAboutSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await savePageSection({
        id: aboutSec?.id,
        page_slug: "home",
        section_key: "about_preview",
        title: aboutTitle,
        subtitle: aboutEyebrow,
        description: aboutLeadText,
        content: {
          lead_text: aboutLeadText,
          body_text: aboutBodyText,
          primary_btn_text: aboutPrimaryBtnText,
          primary_btn_url: aboutPrimaryBtnUrl,
          secondary_btn_text: aboutSecondaryBtnText,
          secondary_btn_url: aboutSecondaryBtnUrl,
          stats: aboutStats,
        },
        display_order: 2,
        is_active: aboutSec?.is_active ?? true,
      });

      setSuccessMsg("About Preview section updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save About section: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveServicesHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await savePageSection({
        id: servicesSec?.id,
        page_slug: "home",
        section_key: "services_header",
        title: servicesTitle,
        subtitle: servicesEyebrow,
        description: servicesDesc,
        content: {},
        display_order: 3,
        is_active: servicesSec?.is_active ?? true,
      });

      setSuccessMsg("Disciplines / Services Header updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Services header: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdvantageSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await savePageSection({
        id: advantageSec?.id,
        page_slug: "home",
        section_key: "why_choose_us",
        title: advTitle,
        subtitle: advEyebrow,
        description: advDesc,
        content: {
          pillars: advPillars,
        },
        display_order: 5,
        is_active: advantageSec?.is_active ?? true,
      });

      setSuccessMsg("Sivansh Advantage & Standards updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Advantage section: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCtaSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await savePageSection({
        id: ctaSec?.id,
        page_slug: "home",
        section_key: "cta",
        title: ctaTitle,
        subtitle: ctaEyebrow,
        description: ctaDesc,
        content: {
          hotline: ctaHotline,
          address: ctaAddress,
          hours: ctaHours,
          form_title: ctaFormTitle,
          form_subtitle: ctaFormSub,
          primary_btn_text: ctaPrimaryBtnText,
          primary_btn_url: ctaPrimaryBtnUrl,
          secondary_btn_text: ctaSecondaryBtnText,
          secondary_btn_url: ctaSecondaryBtnUrl,
        },
        display_order: 7,
        is_active: ctaSec?.is_active ?? true,
      });

      setSuccessMsg("Consultation CTA section updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save CTA section: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = async (sectionId: string, currentActive: boolean) => {
    const supabase = createClient();
    try {
      await supabase
        .from("page_sections")
        .update({ is_active: !currentActive, updated_at: new Date().toISOString() })
        .eq("id", sectionId);

      setSections(sections.map(s => s.id === sectionId ? { ...s, is_active: !currentActive } : s));
      setSuccessMsg("Section visibility updated.");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to update section visibility.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-gold" />
            <span>HOMEPAGE <span className="text-gold">CMS</span></span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Edit text, headlines, descriptions, stats, buttons, images, and videos for every homepage section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
            <span>View Live Site</span>
          </a>

          {activeTab === "slides" && (
            <button
              type="button"
              onClick={() => setEditingSlide({
                eyebrow: "Surveillance Architecture Division",
                title: "PERIMETER SECURITY,",
                highlighted_text: "ENGINEERED FOR GUJARAT.",
                description: "Industrial-grade 4G solar linkage, BIS-ER & STQC certified IP cameras, and IK10 vandal-proof dome infrastructures.",
                primary_btn_text: "Explore Catalog",
                primary_btn_url: "/shop",
                secondary_btn_text: "Request Site Survey",
                secondary_btn_url: "/contact",
                media_url: "/assets/images/hero/hero-cctv.jpg",
                media_type: "image",
                display_order: slides.length + 1,
                is_active: true
              })}
              className="btn btn-gold btn-sm flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Hero Slide
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 rounded text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold/15 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("slides")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "slides" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Hero Carousel ({slides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "about" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>2. About & Heritage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "services" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Disciplines Header</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("advantage")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "advantage" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Sivansh Advantage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cta")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "cta" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>5. Consultation CTA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("visibility")}
          className={`px-4 py-2.5 rounded text-xs uppercase font-mono tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "visibility" 
              ? "bg-gold text-black font-bold shadow-md" 
              : "bg-carbon-800 text-secondary hover:text-white border border-gold/10"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>6. Section Visibility</span>
        </button>
      </div>

      {/* ================================================================== */}
      {/* TAB 1: HERO CAROUSEL SLIDES */}
      {/* ================================================================== */}
      {activeTab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-gold">Full-Screen Cinematic Hero Carousel</h2>
            <span className="text-xs text-secondary">{slides.length} slides registered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, idx) => (
              <div key={slide.id} className="bg-carbon-800 rounded-xl border border-gold/20 overflow-hidden flex flex-col hover:border-gold/50 transition-colors">
                <div className="aspect-video relative overflow-hidden bg-black/60">
                  {slide.media_type === "video" ? (
                    <video src={slide.media_url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={slide.media_url} alt={slide.title} className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-gold font-bold uppercase">
                    Slide 0{idx + 1}
                  </span>
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    slide.is_active ? "bg-emerald-900 text-emerald-300 border border-emerald-500/30" : "bg-red-900 text-red-300 border border-red-500/30"
                  }`}>
                    {slide.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] text-gold uppercase font-bold tracking-wider">{slide.eyebrow}</div>
                    <h3 className="font-serif text-base font-bold text-white mt-0.5">
                      {slide.title} <span className="text-gold">{slide.highlighted_text}</span>
                    </h3>
                    <p className="text-secondary text-xs line-clamp-2 mt-1">{slide.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-secondary truncate max-w-[170px]">
                      Btn: <strong>{slide.primary_btn_text}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSlide(slide)}
                        className="p-1.5 rounded bg-white/5 hover:bg-gold hover:text-black text-gold transition-colors"
                        title="Edit Slide"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 rounded bg-white/5 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Modal Editor */}
          {editingSlide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-carbon-800 border border-gold/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                <div className="flex justify-between items-center border-b border-gold/15 pb-3">
                  <h3 className="font-serif text-lg font-bold text-gold">
                    {editingSlide.id ? "Edit Hero Slide" : "Create New Hero Slide"}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setEditingSlide(null)}
                    className="text-muted hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs">Eyebrow Text *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Surveillance Architecture Division"
                        className="form-input text-xs"
                        value={editingSlide.eyebrow || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Media Type</label>
                      <select
                        className="form-input form-select text-xs"
                        value={editingSlide.media_type || "image"}
                        onChange={(e) => setEditingSlide({ ...editingSlide, media_type: e.target.value as any })}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video (MP4 / WebM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs">Headline Main Text *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PERIMETER SECURITY,"
                        className="form-input text-xs"
                        value={editingSlide.title || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Highlighted Text (Gold Gradient)</label>
                      <input
                        type="text"
                        placeholder="e.g. ENGINEERED FOR GUJARAT."
                        className="form-input text-xs"
                        value={editingSlide.highlighted_text || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, highlighted_text: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xs">Slide Description *</label>
                    <textarea
                      required
                      rows={3}
                      className="form-input form-textarea text-xs"
                      value={editingSlide.description || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                    />
                  </div>

                  <MediaUploadInput
                    label="Slide Media File (Photo or Video) *"
                    value={editingSlide.media_url || ""}
                    onChange={(url, detectedType) => setEditingSlide({
                      ...editingSlide,
                      media_url: url,
                      media_type: detectedType || editingSlide.media_type || "image"
                    })}
                    mediaType="both"
                    folder="hero"
                    placeholder="/assets/images/hero/hero-cctv.jpg or upload video/photo"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs">Primary Button Label</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={editingSlide.primary_btn_text || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, primary_btn_text: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Primary Button URL</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={editingSlide.primary_btn_url || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, primary_btn_url: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs">Secondary Button Label</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={editingSlide.secondary_btn_text || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, secondary_btn_text: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Secondary Button URL</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={editingSlide.secondary_btn_url || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, secondary_btn_url: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSlide.is_active !== false}
                        onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-white text-xs">Active on Public Homepage</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-muted text-xs">Display Order:</span>
                      <input
                        type="number"
                        className="form-input text-xs w-16 text-center"
                        value={editingSlide.display_order ?? 1}
                        onChange={(e) => setEditingSlide({ ...editingSlide, display_order: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gold/15">
                    <button
                      type="button"
                      onClick={() => setEditingSlide(null)}
                      className="btn btn-gold-outline btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-gold btn-sm"
                    >
                      {loading ? "Saving Slide..." : "Save Hero Slide"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: ABOUT PREVIEW & HERITAGE */}
      {/* ================================================================== */}
      {activeTab === "about" && (
        <form onSubmit={handleSaveAboutSection} className="space-y-6">
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">2. About Preview & Engineering Heritage</h2>
            <p className="text-xs text-secondary">
              This section introduces Sivansh Enterprise on the homepage, highlighting your certifications and regional focus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Section Eyebrow</label>
                <input
                  type="text"
                  value={aboutEyebrow}
                  onChange={(e) => setAboutEyebrow(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Main Heading</label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Lead Paragraph</label>
              <textarea
                rows={3}
                value={aboutLeadText}
                onChange={(e) => setAboutLeadText(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Body Narrative Paragraph</label>
              <textarea
                rows={4}
                value={aboutBodyText}
                onChange={(e) => setAboutBodyText(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-black/40 rounded border border-gold/10 space-y-3">
                <span className="text-gold font-bold text-xs">Primary Action Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={aboutPrimaryBtnText}
                  onChange={(e) => setAboutPrimaryBtnText(e.target.value)}
                  className="form-input text-xs"
                />
                <input
                  type="text"
                  placeholder="Button Destination (/about)"
                  value={aboutPrimaryBtnUrl}
                  onChange={(e) => setAboutPrimaryBtnUrl(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="p-4 bg-black/40 rounded border border-gold/10 space-y-3">
                <span className="text-gold font-bold text-xs">Secondary Action Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={aboutSecondaryBtnText}
                  onChange={(e) => setAboutSecondaryBtnText(e.target.value)}
                  className="form-input text-xs"
                />
                <input
                  type="text"
                  placeholder="Button Destination (/contact)"
                  value={aboutSecondaryBtnUrl}
                  onChange={(e) => setAboutSecondaryBtnUrl(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-gold">4 Engineering Credential Stat Cards</h3>
            <p className="text-xs text-secondary">Displayed on the right side of the About Preview section.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-black/50 border border-gold/15 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-xs uppercase font-mono">Card 0{idx + 1}</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Highlighted Number / Metric</label>
                    <input
                      type="text"
                      value={stat.num}
                      onChange={(e) => updateAboutStat(idx, "num", e.target.value)}
                      className="form-input text-xs font-bold text-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Stat Title / Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateAboutStat(idx, "label", e.target.value)}
                      className="form-input text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Description Subtext</label>
                    <input
                      type="text"
                      value={stat.sub}
                      onChange={(e) => updateAboutStat(idx, "sub", e.target.value)}
                      className="form-input text-xs text-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save About Section"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================== */}
      {/* TAB 3: DISCIPLINES HEADER */}
      {/* ================================================================== */}
      {activeTab === "services" && (
        <form onSubmit={handleSaveServicesHeader} className="space-y-6">
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">3. Technical Disciplines / Services Header</h2>
            <p className="text-xs text-secondary">
              The heading and introduction for the services showcase on the homepage.
            </p>

            <div>
              <label className="form-label text-xs">Section Eyebrow</label>
              <input
                type="text"
                value={servicesEyebrow}
                onChange={(e) => setServicesEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Section Headline</label>
              <input
                type="text"
                value={servicesTitle}
                onChange={(e) => setServicesTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={servicesDesc}
                onChange={(e) => setServicesDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Disciplines Header"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================== */}
      {/* TAB 4: SIVANSH ADVANTAGE / STANDARDS */}
      {/* ================================================================== */}
      {activeTab === "advantage" && (
        <form onSubmit={handleSaveAdvantageSection} className="space-y-6">
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">4. The Sivansh Advantage & Engineering Standards</h2>
            <p className="text-xs text-secondary">
              Highlights your regional competitive edge and technical quality mandates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Section Eyebrow</label>
                <input
                  type="text"
                  value={advEyebrow}
                  onChange={(e) => setAdvEyebrow(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Section Headline</label>
                <input
                  type="text"
                  value={advTitle}
                  onChange={(e) => setAdvTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Section Description</label>
              <textarea
                rows={2}
                value={advDesc}
                onChange={(e) => setAdvDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>
          </div>

          {/* 4 Advantage Pillars */}
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-gold">Advantage Standard Pillars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advPillars.map((pillar, idx) => (
                <div key={idx} className="p-4 bg-black/50 border border-gold/15 rounded-lg space-y-2">
                  <span className="text-gold font-bold text-xs uppercase font-mono">Pillar 0{idx + 1}</span>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updateAdvPillar(idx, "title", e.target.value)}
                      className="form-input text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={pillar.desc}
                      onChange={(e) => updateAdvPillar(idx, "desc", e.target.value)}
                      className="form-input form-textarea text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Advantage Section"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================== */}
      {/* TAB 5: CONSULTATION CTA */}
      {/* ================================================================== */}
      {activeTab === "cta" && (
        <form onSubmit={handleSaveCtaSection} className="space-y-6">
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">5. Consultation & Site Survey CTA Section</h2>
            <p className="text-xs text-secondary">
              The high-converting consultation banner and direct contact card before the homepage footer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Eyebrow</label>
                <input
                  type="text"
                  value={ctaEyebrow}
                  onChange={(e) => setCtaEyebrow(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Section Headline</label>
                <input
                  type="text"
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">CTA Narrative</label>
              <textarea
                rows={3}
                value={ctaDesc}
                onChange={(e) => setCtaDesc(e.target.value)}
                className="form-input form-textarea text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="form-label text-xs">Direct Hotline</label>
                <input
                  type="text"
                  value={ctaHotline}
                  onChange={(e) => setCtaHotline(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Headquarters Location</label>
                <input
                  type="text"
                  value={ctaAddress}
                  onChange={(e) => setCtaAddress(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Operational Hours</label>
                <input
                  type="text"
                  value={ctaHours}
                  onChange={(e) => setCtaHours(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gold/10">
              <div>
                <label className="form-label text-xs">Form Box Heading</label>
                <input
                  type="text"
                  value={ctaFormTitle}
                  onChange={(e) => setCtaFormTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Form Box Subtitle</label>
                <input
                  type="text"
                  value={ctaFormSub}
                  onChange={(e) => setCtaFormSub(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Consultation CTA"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================== */}
      {/* TAB 6: SECTION VISIBILITY */}
      {/* ================================================================== */}
      {activeTab === "visibility" && (
        <div className="space-y-4">
          <div className="p-6 bg-carbon-800 border border-gold/20 rounded-xl space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold">6. Section Visibility Controls</h2>
            <p className="text-xs text-secondary">
              Enable or disable specific sections on the public homepage.
            </p>

            <div className="divide-y divide-gold/10">
              {sections.map((sec) => (
                <div key={sec.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white text-sm">{sec.title}</div>
                    <div className="text-xs text-muted">
                      Key: <code className="text-gold font-mono">{sec.section_key}</code> • {sec.subtitle || "Section"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSection(sec.id, sec.is_active)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                      sec.is_active 
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30" 
                        : "bg-red-950/60 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {sec.is_active ? (
                      <>
                        <CheckCircle2 size={14} /> Visible
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Hidden
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
