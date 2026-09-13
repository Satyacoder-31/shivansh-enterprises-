"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/types/database";
import { saveGalleryItem, deleteGalleryItem } from "@/lib/actions/admin";
import { Plus, Trash2, Edit2, Image, Video, Star, ExternalLink } from "lucide-react";

export default function GalleryManagerClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", label: "All Works" },
    { id: "cctv", label: "CCTV Surveillance" },
    { id: "led", label: "Architectural LED" },
    { id: "solar", label: "Rooftop Solar" },
    { id: "installations", label: "Installations" },
    { id: "commercial", label: "Commercial" },
  ];

  const filteredItems = selectedCat === "all" 
    ? items 
    : items.filter(i => i.category === selectedCat);

  const handleStartEdit = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem({
        title: "",
        caption: "",
        category: (selectedCat !== "all" ? selectedCat : "cctv") as any,
        media_type: "image",
        media_url: "",
        thumbnail_url: "",
        display_order: items.length + 1,
        is_featured: false,
        status: "published"
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.media_url) {
      alert("Please fill in the title and media URL.");
      return;
    }

    setLoading(true);
    try {
      const saved = await saveGalleryItem(editingItem);
      if (editingItem.id) {
        setItems(items.map(it => it.id === saved.id ? saved : it));
      } else {
        setItems([...items, saved]);
      }
      setEditingItem(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save gallery item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from gallery?`)) return;
    try {
      await deleteGalleryItem(id);
      setItems(items.filter(it => it.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Gallery & Portfolio</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage project installations, showroom media, and client showcases</p>
        </div>
        <button
          onClick={() => handleStartEdit()}
          className="btn-luxury px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedCat === cat.id
                ? "bg-[#c5a059] text-black font-semibold"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.label} ({cat.id === "all" ? items.length : items.filter(i => i.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group relative bg-[#141414] border border-white/5 rounded overflow-hidden flex flex-col hover:border-[#c5a059]/40 transition-all duration-300"
          >
            {/* Image Preview */}
            <div className="relative aspect-video bg-black/50 overflow-hidden">
              <img
                src={item.thumbnail_url || item.media_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-black/70 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/30">
                  {item.category}
                </span>
                {item.is_featured && (
                  <span className="p-1 rounded bg-[#c5a059] text-black" title="Featured Item">
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                )}
              </div>

              <div className="absolute top-2 right-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-2 bg-white/10 hover:bg-[#c5a059] text-white hover:text-black rounded transition-colors cursor-pointer"
                  title="Edit Item"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <a
                  href={item.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                  title="View Original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 bg-white/10 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                {item.caption && (
                  <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{item.caption}</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  {item.media_type === "video" ? <Video className="w-3.5 h-3.5 text-[#c5a059]" /> : <Image className="w-3.5 h-3.5 text-[#c5a059]" />}
                  {item.media_type}
                </span>
                <span>Order: {item.display_order}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 border border-dashed border-white/10 rounded">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#c5a059]" />
            <p className="text-base font-serif text-white">No media items in this category</p>
            <p className="text-xs mt-1">Click "Add Media Item" above to upload or link project photos.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-serif text-white">
                {editingItem.id ? "Edit Gallery Item" : "Add New Gallery Item"}
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
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g., Luxury Villa Security Array"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Caption / Description</label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ""}
                  onChange={e => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Brief description of the installation, location, or setup"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Category</label>
                  <select
                    value={editingItem.category || "cctv"}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="cctv">CCTV Surveillance</option>
                    <option value="led">Architectural LED</option>
                    <option value="solar">Rooftop Solar</option>
                    <option value="installations">Installations</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Media Type</label>
                  <select
                    value={editingItem.media_type || "image"}
                    onChange={e => setEditingItem({ ...editingItem, media_type: e.target.value as any })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Media URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.media_url || ""}
                  onChange={e => setEditingItem({ ...editingItem, media_url: e.target.value })}
                  placeholder="https://... or /assets/images/gallery/..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Thumbnail URL (Optional)</label>
                <input
                  type="text"
                  value={editingItem.thumbnail_url || ""}
                  onChange={e => setEditingItem({ ...editingItem, thumbnail_url: e.target.value })}
                  placeholder="Leave blank to use Media URL"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order ?? 0}
                    onChange={e => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Status</label>
                  <select
                    value={editingItem.status || "published"}
                    onChange={e => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={!!editingItem.is_featured}
                      onChange={e => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4 rounded"
                    />
                    <span className="text-white text-xs">Featured</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {loading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
