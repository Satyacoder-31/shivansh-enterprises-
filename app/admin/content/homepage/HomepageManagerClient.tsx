"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HeroSlide, PageSection } from "@/types/database";
import { saveHeroSlide, deleteHeroSlide, savePageSection } from "@/lib/actions/admin";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Save, 
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  MessageSquare,
  Eye,
  EyeOff,
  ArrowRight,
  Check
} from "lucide-react";

interface HomepageManagerClientProps {
  initialSlides: HeroSlide[];
  initialSections: PageSection[];
}

export default function HomepageManagerClient({ initialSlides, initialSections }: HomepageManagerClientProps) {
  const router = useRouter();
  
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Helper to find existing section
  const getSection = (key: string) => sections.find(s => s.section_key === key);

  // --------------------------------------------------------------------------
  // Section 2: About Preview State
  // --------------------------------------------------------------------------
  const aboutSec = getSection("about_preview");
  const [showAbout, setShowAbout] = useState(aboutSec?.is_active !== false);
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
  // Section 3: Disciplines / Services Header State
  // --------------------------------------------------------------------------
  const servicesSec = getSection("services_header") || getSection("services");
  const [showServices, setShowServices] = useState(servicesSec?.is_active !== false);
  const [servicesEyebrow, setServicesEyebrow] = useState(servicesSec?.subtitle || "Technical Disciplines");
  const [servicesTitle, setServicesTitle] = useState(servicesSec?.title || "BESPOKE SOLUTIONS. ZERO COMPROMISE.");
  const [servicesDesc, setServicesDesc] = useState(
    servicesSec?.description || 
    "Three synchronized engineering divisions addressing the critical pillars of modern properties."
  );

  // --------------------------------------------------------------------------
  // Section 4: Curated Flagship Hardware (Featured Products) State
  // --------------------------------------------------------------------------
  const featuredSec = getSection("featured_products");
  const [showFeatured, setShowFeatured] = useState(featuredSec?.is_active !== false);
  const [featuredEyebrow, setFeaturedEyebrow] = useState(featuredSec?.subtitle || "Authentic Catalog");
  const [featuredTitle, setFeaturedTitle] = useState(featuredSec?.title || "CURATED FLAGSHIP HARDWARE.");
  const [featuredDesc, setFeaturedDesc] = useState(
    featuredSec?.description || 
    "Genuine brochures, authentic test certifications, and verified parameters."
  );

  // --------------------------------------------------------------------------
  // Section 5: Sivansh Advantage / Standards State
  // --------------------------------------------------------------------------
  const advantageSec = getSection("why_choose_us");
  const [showAdvantage, setShowAdvantage] = useState(advantageSec?.is_active !== false);
  const [advEyebrow, setAdvEyebrow] = useState(advantageSec?.subtitle || "Our Standards");
  const [advTitle, setAdvTitle] = useState(advantageSec?.title || "THE SIVANSH ADVANTAGE.");
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
  // Section 6: Testimonials State
  // --------------------------------------------------------------------------
  const testimonialsSec = getSection("testimonials");
  const [showTestimonials, setShowTestimonials] = useState(testimonialsSec?.is_active !== false);
  const [testEyebrow, setTestEyebrow] = useState(testimonialsSec?.subtitle || "Client Testimonials");
  const [testTitle, setTestTitle] = useState(testimonialsSec?.title || "TRUSTED BY ESTATE & BUSINESS LEADERS.");

  // --------------------------------------------------------------------------
  // Section 7: Consultation CTA State
  // --------------------------------------------------------------------------
  const ctaSec = getSection("cta");
  const [showCta, setShowCta] = useState(ctaSec?.is_active !== false);
  const [ctaEyebrow, setCtaEyebrow] = useState(ctaSec?.subtitle || "Direct Consultation");
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

  // --------------------------------------------------------------------------
  // Helper for Section Scrolling
  // --------------------------------------------------------------------------
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // --------------------------------------------------------------------------
  // Save Handlers
  // --------------------------------------------------------------------------
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setLoadingSection("hero");

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
      setLoadingSection(null);
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

  const handleSaveAbout = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("about");
    const active = overrideActive !== undefined ? overrideActive : showAbout;

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
        is_active: active,
      });

      setSuccessMsg("Section 2 (About & Heritage) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save About section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveServices = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("services");
    const active = overrideActive !== undefined ? overrideActive : showServices;

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
        is_active: active,
      });

      setSuccessMsg("Section 3 (Services Header) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Services section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveFeatured = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("featured");
    const active = overrideActive !== undefined ? overrideActive : showFeatured;

    try {
      await savePageSection({
        id: featuredSec?.id,
        page_slug: "home",
        section_key: "featured_products",
        title: featuredTitle,
        subtitle: featuredEyebrow,
        description: featuredDesc,
        content: {},
        display_order: 4,
        is_active: active,
      });

      setSuccessMsg("Section 4 (Flagship Products Header) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Featured Products section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveAdvantage = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("advantage");
    const active = overrideActive !== undefined ? overrideActive : showAdvantage;

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
        is_active: active,
      });

      setSuccessMsg("Section 5 (Sivansh Advantage) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Advantage section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveTestimonials = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("testimonials");
    const active = overrideActive !== undefined ? overrideActive : showTestimonials;

    try {
      await savePageSection({
        id: testimonialsSec?.id,
        page_slug: "home",
        section_key: "testimonials",
        title: testTitle,
        subtitle: testEyebrow,
        description: "",
        content: {},
        display_order: 6,
        is_active: active,
      });

      setSuccessMsg("Section 6 (Testimonials Header) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save Testimonials section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveCta = async (e?: React.FormEvent, overrideActive?: boolean) => {
    if (e) e.preventDefault();
    setLoadingSection("cta");
    const active = overrideActive !== undefined ? overrideActive : showCta;

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
        },
        display_order: 7,
        is_active: active,
      });

      setSuccessMsg("Section 7 (Consultation CTA) updated on live homepage!");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert("Failed to save CTA section: " + err.message);
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* ------------------------------------------------------------------ */}
      {/* Header Banner */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold mb-1">
            <span>Website Pages</span>
            <span>/</span>
            <span>Homepage (/)</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <span>HOMEPAGE</span>
            <span className="text-gold">CONTINUOUS CMS</span>
          </h1>
          <p className="text-secondary text-xs mt-1 max-w-2xl">
            Sections are arranged in <strong>continuous top-to-bottom order</strong>, matching the live homepage flow. Edit any section and save directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold-outline text-xs px-3.5 py-2 flex items-center gap-1.5"
            title="Open live homepage in a new tab"
          >
            <ExternalLink size={13} />
            <span>View Live Homepage</span>
          </a>

          <button
            type="button"
            onClick={() => setEditingSlide({
              title: "PERIMETER SECURITY.",
              eyebrow: "Sivansh Enterprise",
              highlighted_text: "ENGINEERED FOR GUJARAT.",
              description: "STQC & BIS-ER certified surveillance architecture and autonomous 4G solar optics.",
              primary_btn_text: "Explore CCTV Systems",
              primary_btn_url: "/cctv",
              secondary_btn_text: "Request Site Survey",
              secondary_btn_url: "/contact",
              media_url: "/assets/images/hero/hero-cctv.jpg",
              media_type: "image",
              display_order: slides.length + 1,
              is_active: true
            })}
            className="btn btn-gold text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky Table of Contents / Section Quick-Jump Bar */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-16 z-20 bg-carbon-900/95 backdrop-blur-md py-3 border-y border-gold/15">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted mr-1 shrink-0">
            Jump To:
          </span>
          {[
            { id: "sec-hero", label: "1. Hero Carousel (" + slides.length + ")" },
            { id: "sec-about", label: "2. About & Heritage" },
            { id: "sec-services", label: "3. Core Services" },
            { id: "sec-products", label: "4. Flagship Products" },
            { id: "sec-advantage", label: "5. Sivansh Advantage" },
            { id: "sec-testimonials", label: "6. Testimonials" },
            { id: "sec-cta", label: "7. Consultation CTA" },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider bg-carbon-800 hover:bg-gold/15 hover:text-gold text-secondary border border-gold/10 hover:border-gold/30 transition-all shrink-0 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center gap-2 animate-in fade-in sticky top-28 z-30 shadow-lg">
          <CheckCircle2 size={16} />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* ================================================================== */}
      {/* SECTION 1: HERO CAROUSEL SLIDER (TOP OF HOMEPAGE) */}
      {/* ================================================================== */}
      <section id="sec-hero" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 01 / 07 • Top of Homepage
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                ● Live ({slides.length} Slides)
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              1. Full-Screen Cinematic Hero Carousel
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              The full-width introductory slider at the very top of the homepage. Supports high-resolution images or background video with gold gradient typography.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingSlide({
              title: "PERIMETER SECURITY.",
              eyebrow: "Sivansh Enterprise",
              highlighted_text: "ENGINEERED FOR GUJARAT.",
              description: "STQC & BIS-ER certified surveillance architecture and autonomous 4G solar optics.",
              primary_btn_text: "Explore CCTV Systems",
              primary_btn_url: "/cctv",
              secondary_btn_text: "Request Site Survey",
              secondary_btn_url: "/contact",
              media_url: "/assets/images/hero/hero-cctv.jpg",
              media_type: "image",
              display_order: slides.length + 1,
              is_active: true
            })}
            className="btn btn-gold btn-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={14} /> Add Hero Slide
          </button>
        </div>

        {/* Slide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id}
              className="bg-carbon-900 border border-gold/20 hover:border-gold/50 rounded-xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              {/* Media Preview Box */}
              <div className="relative h-40 bg-black/60 overflow-hidden">
                {slide.media_type === "video" ? (
                  <video 
                    src={slide.media_url} 
                    className="w-full h-full object-cover opacity-80" 
                    muted 
                    loop 
                    autoPlay 
                    playsInline 
                  />
                ) : (
                  <img 
                    src={slide.media_url} 
                    alt={slide.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                  />
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-gold font-bold">
                  Slide #{idx + 1}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-secondary uppercase">
                  {slide.media_type || "image"}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] text-gold uppercase font-bold tracking-wider">{slide.eyebrow}</div>
                  <h3 className="font-serif text-sm font-bold text-white mt-0.5">
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
                      className="p-1.5 rounded bg-white/5 hover:bg-gold hover:text-black text-gold transition-colors cursor-pointer"
                      title="Edit Slide"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 rounded bg-white/5 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
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

        {/* Slide Edit Modal */}
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
                  className="text-muted hover:text-white text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSlide} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Eyebrow Text *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sivansh Enterprise"
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
                      onChange={(e) => setEditingSlide({ ...editingSlide, media_type: e.target.value as "image" | "video" })}
                    >
                      <option value="image">Still Photography (Image)</option>
                      <option value="video">Motion Video (MP4 / WebM)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Headline Main Text *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PERIMETER SECURITY."
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

                <div className="flex justify-between items-center pt-4 border-t border-gold/15">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(null)}
                    className="btn btn-gold-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingSection === "hero"}
                    className="btn btn-gold btn-sm px-6 flex items-center gap-2"
                  >
                    <Save size={14} />
                    <span>{loadingSection === "hero" ? "Saving Slide..." : "Save Slide"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* ================================================================== */}
      {/* SECTION 2: ABOUT & HERITAGE PREVIEW */}
      {/* ================================================================== */}
      <section id="sec-about" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 02 / 07 • Below Hero
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showAbout ? "text-emerald-400" : "text-amber-400"}`}>
                {showAbout ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              2. About & Engineering Heritage Preview
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Introduces the firm’s executive profile, engineering philosophy, and 4 high-impact credential statistics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showAbout;
                setShowAbout(newActive);
                handleSaveAbout(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showAbout 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showAbout ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showAbout ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#about-preview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveAbout} className="space-y-5">
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
              <label className="form-label text-xs">Section Headline</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Lead Introductory Paragraph</label>
            <textarea
              rows={3}
              value={aboutLeadText}
              onChange={(e) => setAboutLeadText(e.target.value)}
              className="form-input form-textarea text-xs"
            />
          </div>

          <div>
            <label className="form-label text-xs">Deep Narrative Paragraph</label>
            <textarea
              rows={3}
              value={aboutBodyText}
              onChange={(e) => setAboutBodyText(e.target.value)}
              className="form-input form-textarea text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-carbon-900 rounded-lg border border-gold/15 space-y-3">
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

            <div className="p-4 bg-carbon-900 rounded-lg border border-gold/15 space-y-3">
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

          {/* 4 Stat Cards */}
          <div className="p-5 bg-carbon-900 border border-gold/15 rounded-xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold">4 Engineering Credential Stat Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutStats.map((stat, idx) => (
                <div key={idx} className="p-3 bg-black/60 border border-gold/15 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-mono font-bold text-[11px]">Card 0{idx + 1}</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Metric Number</label>
                    <input
                      type="text"
                      value={stat.num}
                      onChange={(e) => updateAboutStat(idx, "num", e.target.value)}
                      className="form-input text-xs font-bold text-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Stat Title</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateAboutStat(idx, "label", e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase">Subtext</label>
                    <input
                      type="text"
                      value={stat.sub}
                      onChange={(e) => updateAboutStat(idx, "sub", e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "about"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "about" ? "Saving About Section..." : "Save About Section"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ================================================================== */}
      {/* SECTION 3: TECHNICAL DISCIPLINES / SERVICES HEADER */}
      {/* ================================================================== */}
      <section id="sec-services" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 03 / 07 • Services Showcase
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showServices ? "text-emerald-400" : "text-amber-400"}`}>
                {showServices ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              3. Core Technical Disciplines Header
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Heading and narrative introducing the three synchronized engineering divisions on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showServices;
                setShowServices(newActive);
                handleSaveServices(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showServices 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showServices ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showServices ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveServices} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="form-label text-xs">Section Subtitle / Narrative</label>
            <textarea
              rows={3}
              value={servicesDesc}
              onChange={(e) => setServicesDesc(e.target.value)}
              className="form-input form-textarea text-xs"
            />
          </div>

          <div className="p-4 bg-carbon-900 rounded-lg border border-gold/15 flex items-center justify-between text-xs">
            <span className="text-secondary">
              Need to modify individual service specifications, features, or add new disciplines?
            </span>
            <Link href="/admin/services" className="text-gold font-bold flex items-center gap-1 hover:underline">
              <span>Open Services Editor</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "services"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "services" ? "Saving Services Header..." : "Save Services Header"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ================================================================== */}
      {/* SECTION 4: CURATED FLAGSHIP HARDWARE (FEATURED PRODUCTS) */}
      {/* ================================================================== */}
      <section id="sec-products" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 04 / 07 • Hardware Showcase
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showFeatured ? "text-emerald-400" : "text-amber-400"}`}>
                {showFeatured ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              4. Curated Flagship Hardware
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Displays published products marked as "Featured" in the hardware registry on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showFeatured;
                setShowFeatured(newActive);
                handleSaveFeatured(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showFeatured 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showFeatured ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showFeatured ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#featured-products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveFeatured} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Section Eyebrow</label>
              <input
                type="text"
                value={featuredEyebrow}
                onChange={(e) => setFeaturedEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Section Headline</label>
              <input
                type="text"
                value={featuredTitle}
                onChange={(e) => setFeaturedTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Section Description</label>
            <textarea
              rows={2}
              value={featuredDesc}
              onChange={(e) => setFeaturedDesc(e.target.value)}
              className="form-input form-textarea text-xs"
            />
          </div>

          <div className="p-4 bg-carbon-900 rounded-lg border border-gold/15 flex items-center justify-between text-xs">
            <span className="text-secondary">
              Want to feature new hardware or update product pricing and specifications?
            </span>
            <Link href="/admin/products" className="text-gold font-bold flex items-center gap-1 hover:underline">
              <span>Open Products Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "featured"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "featured" ? "Saving Products Header..." : "Save Products Header"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ================================================================== */}
      {/* SECTION 5: SIVANSH ADVANTAGE / OUR STANDARDS */}
      {/* ================================================================== */}
      <section id="sec-advantage" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 05 / 07 • Engineering Standards
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showAdvantage ? "text-emerald-400" : "text-amber-400"}`}>
                {showAdvantage ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              5. The Sivansh Advantage (4 Pillars)
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Showcases the 4 engineering standard pillars explaining why Saurashtra property owners choose Sivansh Enterprise.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showAdvantage;
                setShowAdvantage(newActive);
                handleSaveAdvantage(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showAdvantage 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showAdvantage ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showAdvantage ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#why-choose-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveAdvantage} className="space-y-5">
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

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {advPillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-carbon-900 border border-gold/15 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-gold font-mono font-bold text-xs">Pillar 0{idx + 1}</span>
                  <span className="text-[10px] text-muted font-mono">Card #{idx + 1}</span>
                </div>
                <div>
                  <label className="text-[10px] text-muted uppercase">Pillar Title</label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => updateAdvPillar(idx, "title", e.target.value)}
                    className="form-input text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted uppercase">Description Narrative</label>
                  <textarea
                    rows={2}
                    value={pillar.desc}
                    onChange={(e) => updateAdvPillar(idx, "desc", e.target.value)}
                    className="form-input form-textarea text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "advantage"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "advantage" ? "Saving Advantage..." : "Save Advantage Section"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ================================================================== */}
      {/* SECTION 6: CLIENT TESTIMONIALS */}
      {/* ================================================================== */}
      <section id="sec-testimonials" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 06 / 07 • Social Proof
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showTestimonials ? "text-emerald-400" : "text-amber-400"}`}>
                {showTestimonials ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              6. Client Testimonials Header
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Displays executive reviews and client ratings on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showTestimonials;
                setShowTestimonials(newActive);
                handleSaveTestimonials(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showTestimonials 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showTestimonials ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showTestimonials ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#testimonials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveTestimonials} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Section Eyebrow</label>
              <input
                type="text"
                value={testEyebrow}
                onChange={(e) => setTestEyebrow(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Section Headline</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="p-4 bg-carbon-900 rounded-lg border border-gold/15 flex items-center justify-between text-xs">
            <span className="text-secondary">
              Want to add, approve, or edit individual client review cards?
            </span>
            <Link href="/admin/testimonials" className="text-gold font-bold flex items-center gap-1 hover:underline">
              <span>Manage Client Reviews</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "testimonials"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "testimonials" ? "Saving Testimonials..." : "Save Testimonials Header"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ================================================================== */}
      {/* SECTION 7: CONSULTATION & SURVEY CTA (BOTTOM OF HOMEPAGE) */}
      {/* ================================================================== */}
      <section id="sec-cta" className="p-6 bg-carbon-800 border border-gold/25 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                Section 07 / 07 • Bottom of Homepage
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${showCta ? "text-emerald-400" : "text-amber-400"}`}>
                {showCta ? "● Visible on Website" : "○ Hidden from Website"}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              7. Consultation & Survey CTA Section
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              The high-conversion closing section at the bottom of the homepage with contact details and consultation request form.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newActive = !showCta;
                setShowCta(newActive);
                handleSaveCta(undefined, newActive);
              }}
              className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showCta 
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60" 
                  : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              {showCta ? <Eye size={13} /> : <EyeOff size={13} />}
              <span>{showCta ? "Section Active" : "Section Hidden"}</span>
            </button>
            <a
              href="/#consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold/80 hover:text-gold flex items-center gap-1 p-1.5"
              title="Preview on live homepage"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveCta} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Section Eyebrow</label>
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
            <label className="form-label text-xs">CTA Narrative Paragraph</label>
            <textarea
              rows={3}
              value={ctaDesc}
              onChange={(e) => setCtaDesc(e.target.value)}
              className="form-input form-textarea text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label text-xs">Direct Hotline Phone</label>
              <input
                type="text"
                value={ctaHotline}
                onChange={(e) => setCtaHotline(e.target.value)}
                className="form-input text-xs font-mono font-bold"
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
              <label className="form-label text-xs">Operating Hours</label>
              <input
                type="text"
                value={ctaHours}
                onChange={(e) => setCtaHours(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Survey Form Title</label>
              <input
                type="text"
                value={ctaFormTitle}
                onChange={(e) => setCtaFormTitle(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Survey Form Subtitle</label>
              <input
                type="text"
                value={ctaFormSub}
                onChange={(e) => setCtaFormSub(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingSection === "cta"}
              className="btn btn-gold flex items-center gap-2 px-8"
            >
              <Save size={15} />
              <span>{loadingSection === "cta" ? "Saving CTA Section..." : "Save Consultation CTA"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
