"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroSlide, PageSection } from "@/types/database";
import { saveHeroSlide, deleteHeroSlide } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Eye, Save } from "lucide-react";

interface HomepageManagerClientProps {
  initialSlides: HeroSlide[];
  initialSections: PageSection[];
}

export default function HomepageManagerClient({ initialSlides, initialSections }: HomepageManagerClientProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [sections, setSections] = useState(initialSections);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
    } catch (err: any) {
      alert(err.message || "Failed to delete slide.");
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
    } catch (err) {
      alert("Failed to update section visibility.");
    }
  };

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            HOMEPAGE <span className="text-gold">CMS</span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Manage cinematic hero slides, slide media, titles, button destinations, and section visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingSlide({
            eyebrow: "Engineering Division",
            title: "TITLE,",
            highlighted_text: "HIGHLIGHT.",
            description: "Detailed description of capability...",
            primary_btn_text: "Explore Now",
            primary_btn_url: "/shop",
            secondary_btn_text: "Get a Quote",
            secondary_btn_url: "/contact",
            media_url: "/assets/images/hero/hero-cctv.jpg",
            media_type: "image",
            display_order: slides.length + 1,
            is_active: true
          })}
          className="btn btn-gold btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} /> Add New Hero Slide
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 rounded text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Hero Slides Section */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-gold">1. Full-Screen Cinematic Hero Slides</h2>
        <p className="text-xs text-secondary">
          Live slides currently cycling in the homepage hero carousel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="bg-carbon-800 rounded-xl border border-gold/20 overflow-hidden flex flex-col">
              {/* Media Preview */}
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
                  slide.is_active ? "bg-emerald-900 text-emerald-300" : "bg-red-900 text-red-300"
                }`}>
                  {slide.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Text info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] text-gold uppercase font-bold tracking-wider">{slide.eyebrow}</div>
                  <h3 className="font-serif text-base font-bold text-white mt-0.5">
                    {slide.title} {slide.highlighted_text}
                  </h3>
                  <p className="text-muted text-xs line-clamp-2 mt-1">{slide.description}</p>
                </div>

                <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-secondary">
                    Btn: <strong>{slide.primary_btn_text}</strong> → {slide.primary_btn_url}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSlide(slide)}
                      className="p-1 text-gold hover:text-gold-light"
                      title="Edit Slide"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1 text-red-400 hover:text-red-300"
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
      </div>

      {/* Slide Edit Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-carbon-800 border border-gold/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/15 pb-3">
              <h3 className="font-serif text-lg font-bold text-gold">
                {editingSlide.id ? "Edit Hero Slide" : "Create New Hero Slide"}
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingSlide(null)}
                className="text-muted hover:text-white"
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
                    placeholder="e.g. Surveillance Architecture"
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
                    <option value="video">Video (MP4)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Headline Part 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SECURITY,"
                    className="form-input text-xs"
                    value={editingSlide.title || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Highlighted Text (Gold Gradient)</label>
                  <input
                    type="text"
                    placeholder="e.g. ELEVATED."
                    className="form-input text-xs"
                    value={editingSlide.highlighted_text || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlighted_text: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Description Paragraph *</label>
                <textarea
                  required
                  rows={3}
                  className="form-input form-textarea text-xs"
                  value={editingSlide.description || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Media File URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/assets/images/hero/hero-cctv.jpg"
                  className="form-input text-xs"
                  value={editingSlide.media_url || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, media_url: e.target.value })}
                />
              </div>

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
                  <label className="form-label text-xs">Primary Button Destination</label>
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
                  <label className="form-label text-xs">Secondary Button Destination</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={editingSlide.secondary_btn_url || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondary_btn_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSlide.is_active !== false}
                    onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Display on Live Website</span>
                </label>
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
                  {loading ? "Saving..." : "Save Hero Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Sections Visibility Manager */}
      <div className="space-y-4 pt-6 border-t border-gold/15">
        <h2 className="font-serif text-xl font-bold text-gold">2. Section Visibility & Layout Controls</h2>
        <p className="text-xs text-secondary">
          Enable or disable sections on the public homepage. Changes take effect immediately upon update.
        </p>

        <div className="bg-carbon-800 border border-gold/15 rounded-xl overflow-hidden divide-y divide-gold/10">
          {sections.map((sec) => (
            <div key={sec.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white text-sm">{sec.title}</div>
                <div className="text-xs text-muted">
                  Key: <code className="text-gold font-mono">{sec.section_key}</code> • {sec.subtitle || "Section"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSection(sec.id, sec.is_active)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
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
  );
}
