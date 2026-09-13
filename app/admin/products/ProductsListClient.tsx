"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { deleteProduct, toggleProductStock } from "@/lib/actions/admin";
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductsListClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    const matchesSearch = !search.trim() || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.model?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    try {
      await toggleProductStock(id, !currentStock);
      setProducts(products.map(p => p.id === id ? { ...p, in_stock: !currentStock } : p));
    } catch (err) {
      alert("Failed to update stock status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            HARDWARE <span className="text-gold">CATALOG</span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Manage authentic product specifications, pricing modes, and stock availability.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn btn-gold btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} /> Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-carbon-800 p-4 rounded-xl border border-gold/15">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by name, model, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-carbon-900 border border-gold/20 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-muted focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-carbon-900 border border-gold/20 rounded px-3 py-2 text-xs text-secondary focus:outline-none focus:border-gold"
          >
            <option value="all">All Disciplines ({products.length})</option>
            <option value="cctv">CCTV Surveillance</option>
            <option value="led">Architectural LED</option>
            <option value="solar">Rooftop Solar</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-carbon-800 border border-gold/15 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-carbon-900/60 border-b border-gold/10 text-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Hardware Item</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Pricing Mode</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No hardware records found matching current query.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.main_image} 
                          alt={product.name} 
                          className="w-12 h-12 object-contain rounded bg-carbon-900 p-1 border border-gold/20 flex-shrink-0" 
                        />
                        <div>
                          <div className="font-semibold text-white hover:text-gold transition-colors">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-muted">
                            Model: {product.model || "—"} • Brand: {product.brand || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 text-[10px] uppercase font-bold">
                        {product.category_id}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-white">
                        {product.price_value ? formatPrice(product.price_value) : product.price_display}
                      </div>
                      <span className="text-[10px] text-muted capitalize">
                        {product.purchase_mode.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product.id, product.in_stock)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          product.in_stock 
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60" 
                            : "bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900/60"
                        }`}
                        title="Click to toggle stock"
                      >
                        {product.in_stock ? (
                          <>
                            <CheckCircle2 size={12} /> In Stock
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product-details/${product.id}`}
                          target="_blank"
                          className="p-1.5 text-muted hover:text-white"
                          title="View on Public Website"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-gold hover:text-gold-light"
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-red-400 hover:text-red-300"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
