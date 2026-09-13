"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/types/database";
import { saveTestimonial, deleteTestimonial } from "@/lib/actions/admin";
import { Plus, Edit2, Trash2, Star, Quote } from "lucide-react";

export default function TestimonialsClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartEdit = (t?: Testimonial) => {
    if (t) {
      setEditingItem(t);
    } else {
      setEditingItem({
        customer_name: "",
        company: "",
        position: "",
        content: "",
        photo_url: "/assets/images/user-placeholder.png",
        rating: 5.0,
        display_order: testimonials.length + 1,
        is_active: true
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.customer_name || !editingItem.content) {
      alert("Customer name and review content are required.");
      return;
    }
    setLoading(true);

    try {
      const saved = await saveTestimonial(editingItem);
      if (editingItem.id) {
        setTestimonials(testimonials.map(item => item.id === saved.id ? saved : item));
      } else {
        setTestimonials([...testimonials, saved]);
      }
      setEditingItem(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to save review: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(item => item.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete review: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Client Reviews & Testimonials</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage verified client feedback, ratings, and social proof shown on the website</p>
        </div>
        <button
          onClick={() => handleStartEdit()}
          className="btn-luxury px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div
            key={t.id}
            className="bg-[#141414] border border-white/5 rounded-lg p-5 flex flex-col justify-between hover:border-[#c5a059]/40 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#c5a059]">
                  {Array.from({ length: Math.round(Number(t.rating || 5)) }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  t.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {t.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>

              <p className="text-neutral-300 text-xs italic leading-relaxed line-clamp-4">
                "{t.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-xs">{t.customer_name}</p>
                {(t.position || t.company) && (
                  <p className="text-neutral-500 text-[10px]">
                    {[t.position, t.company].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(t)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs cursor-pointer"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.customer_name)}
                  className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-xs cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-serif text-white">
                {editingItem.id ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-neutral-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.customer_name || ""}
                  onChange={e => setEditingItem({ ...editingItem, customer_name: e.target.value })}
                  placeholder="e.g., Rajesh Patel"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Company / Org</label>
                  <input
                    type="text"
                    value={editingItem.company || ""}
                    onChange={e => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g., Patel Agro Mills"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Designation / City</label>
                  <input
                    type="text"
                    value={editingItem.position || ""}
                    onChange={e => setEditingItem({ ...editingItem, position: e.target.value })}
                    placeholder="e.g., Managing Director, Keshod"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Review Content *</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content || ""}
                  onChange={e => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Quote from the client regarding service quality, CCTV installation, or solar savings..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Star Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="5"
                    value={editingItem.rating ?? 5.0}
                    onChange={e => setEditingItem({ ...editingItem, rating: parseFloat(e.target.value) || 5 })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order ?? 0}
                    onChange={e => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={!!editingItem.is_active}
                      onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4 rounded"
                    />
                    <span className="text-white text-xs">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury px-5 py-2 text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
