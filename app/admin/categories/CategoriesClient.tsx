"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/database";
import { saveCategory, deleteCategory } from "@/lib/actions/admin";
import { Plus, Edit2, Trash2, Tag, Check, Layers } from "lucide-react";

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartEdit = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
    } else {
      setEditingCategory({
        name: "",
        slug: "",
        description: "",
        image_url: "/assets/images/hero/hero-cctv.jpg",
        display_order: categories.length + 1,
        is_active: true
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;
    setLoading(true);

    try {
      const saved = await saveCategory(editingCategory);
      if (editingCategory.id) {
        setCategories(categories.map(c => c.id === saved.id ? saved : c));
      } else {
        setCategories([...categories, saved]);
      }
      setEditingCategory(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to save category: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products linked to this category may lose their categorization.`)) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete category: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Product Categories</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage catalog classifications, category banners, and storefront navigation</p>
        </div>
        <button
          onClick={() => handleStartEdit()}
          className="btn-luxury px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c5a059]/40 transition-all"
          >
            {cat.image_url && (
              <div className="h-36 bg-black/50 overflow-hidden relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                    cat.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-serif text-lg">{cat.name}</h3>
                  <span className="text-[11px] font-mono text-neutral-500">Order: {cat.display_order}</span>
                </div>
                <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
                  {cat.description || "No description specified."}
                </p>
                <div className="mt-2 font-mono text-[10px] text-[#c5a059]">
                  slug: /{cat.slug || cat.id}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-serif text-white">
                {editingCategory.id ? "Edit Category" : "New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-neutral-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g., CCTV Cameras"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Slug / ID</label>
                <input
                  type="text"
                  value={editingCategory.slug || ""}
                  onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="Leave empty to auto-generate"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Brief description for category banner"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Banner Image URL</label>
                <input
                  type="text"
                  value={editingCategory.image_url || ""}
                  onChange={e => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  placeholder="/assets/images/hero/hero-cctv.jpg"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.display_order ?? 0}
                    onChange={e => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={!!editingCategory.is_active}
                      onChange={e => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4 rounded"
                    />
                    <span className="text-white text-xs">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury px-5 py-2 text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
