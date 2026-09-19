"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { deleteProduct, toggleProductStock, updateProductWeight, updateProductPrice, updateProductStockQuantity } from "@/lib/actions/admin";
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, ExternalLink, Check, X, AlertTriangle, ArrowUpDown, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductStockStatus } from "@/lib/stock";

export default function ProductsListClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick weight inline edit state
  const [editingWeightId, setEditingWeightId] = useState<string | null>(null);
  const [tempWeight, setTempWeight] = useState<string>("");
  const [savingWeightId, setSavingWeightId] = useState<string | null>(null);

  // Quick price inline edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");
  const [tempMrp, setTempMrp] = useState<string>("");
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);

  // Quick stock quantity inline edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<string>("");
  const [savingStockId, setSavingStockId] = useState<string | null>(null);

  const startEditWeight = (product: Product) => {
    setEditingWeightId(product.id);
    setTempWeight(String(product.weight_kg ? Number(product.weight_kg) : 1.0));
  };

  const handleSaveWeight = async (productId: string) => {
    const val = parseFloat(tempWeight);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid numeric weight in kg (e.g. 0.5 or 15.0)");
      return;
    }
    setSavingWeightId(productId);
    try {
      await updateProductWeight(productId, val);
      setProducts(products.map(p => p.id === productId ? { ...p, weight_kg: val } : p));
      setEditingWeightId(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to update weight: " + (err.message || "Unknown error"));
    } finally {
      setSavingWeightId(null);
    }
  };

  const startEditPrice = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(product.price_value ? String(product.price_value) : "");
    setTempMrp(product.mrp ? String(product.mrp) : "");
  };

  const handleSavePrice = async (productId: string) => {
    const cleanPrice = tempPrice.replace(/[^0-9.]/g, "");
    const priceNum = parseFloat(cleanPrice);
    if (tempPrice.trim() !== "" && (isNaN(priceNum) || priceNum < 0)) {
      alert("Please enter a valid numeric selling price (e.g. 1650 or 5899), or leave blank for 'Contact for Price'");
      return;
    }

    const cleanMrp = tempMrp.replace(/[^0-9.]/g, "");
    const mrpNum = parseFloat(cleanMrp);
    if (tempMrp.trim() !== "" && (isNaN(mrpNum) || mrpNum < 0)) {
      alert("Please enter a valid numeric MRP (e.g. 2499), or leave blank");
      return;
    }

    setSavingPriceId(productId);
    try {
      const res = await updateProductPrice(
        productId, 
        tempPrice.trim() === "" ? 0 : priceNum,
        tempMrp.trim() === "" ? null : mrpNum
      );
      setProducts(products.map(p => p.id === productId ? {
        ...p,
        price_value: res.price_value,
        sale_price: res.sale_price,
        mrp: res.mrp,
        price_display: res.price_display,
        purchase_mode: res.purchase_mode as "buy_online" | "contact_for_price"
      } : p));
      setEditingPriceId(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to update price: " + (err.message || "Unknown error"));
    } finally {
      setSavingPriceId(null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setCategoryFilter(cat);
      }
    }
  }, []);

  const startEditStock = (product: Product) => {
    setEditingStockId(product.id);
    const stockInfo = getProductStockStatus(product);
    setTempStock(String(stockInfo.quantity));
  };

  const handleSaveStock = async (productId: string) => {
    const clean = tempStock.replace(/[^0-9]/g, "");
    const val = parseInt(clean, 10);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid non-negative integer stock quantity (e.g. 0, 5, 50)");
      return;
    }
    setSavingStockId(productId);
    try {
      const res = await updateProductStockQuantity(productId, val);
      setProducts(products.map(p => p.id === productId ? {
        ...p,
        stock_quantity: res.stock_quantity,
        in_stock: res.in_stock
      } : p));
      setEditingStockId(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to update stock quantity: " + (err.message || "Unknown error"));
    } finally {
      setSavingStockId(null);
    }
  };

  const handleStepStock = async (product: Product, delta: number) => {
    const currentQty = product.stock_quantity !== undefined && product.stock_quantity !== null
      ? Number(product.stock_quantity)
      : (product.in_stock !== false ? 100 : 0);
    const newQty = Math.max(0, currentQty + delta);
    setSavingStockId(product.id);
    try {
      const res = await updateProductStockQuantity(product.id, newQty);
      setProducts(products.map(p => p.id === product.id ? {
        ...p,
        stock_quantity: res.stock_quantity,
        in_stock: res.in_stock
      } : p));
      router.refresh();
    } catch (err: any) {
      alert("Failed to adjust stock: " + (err.message || "Unknown error"));
    } finally {
      setSavingStockId(null);
    }
  };

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    try {
      const res = await toggleProductStock(id, !currentStock);
      setProducts(products.map(p => p.id === id ? { 
        ...p, 
        in_stock: res.in_stock,
        stock_quantity: res.stock_quantity !== undefined ? res.stock_quantity : (res.in_stock ? 50 : 0)
      } : p));
      router.refresh();
    } catch (err) {
      alert("Failed to update stock status.");
    }
  };

  const totalCount = products.length;
  const inStockCount = products.filter((p) => getProductStockStatus(p).status === "in_stock").length;
  const lowStockCount = products.filter((p) => getProductStockStatus(p).status === "low_stock").length;
  const outOfStockCount = products.filter((p) => getProductStockStatus(p).status === "out_of_stock").length;

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    const matchesSearch = !search.trim() || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.model?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    
    const stockInfo = getProductStockStatus(p);
    const matchesStock = stockFilter === "all" 
      || (stockFilter === "in_stock" && stockInfo.status === "in_stock")
      || (stockFilter === "low_stock" && stockInfo.status === "low_stock")
      || (stockFilter === "out_of_stock" && stockInfo.status === "out_of_stock");

    return matchesCategory && matchesSearch && matchesStock;
  });

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

      {/* Inventory KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStockFilter("all")}
          className={`p-3 rounded-xl border text-left transition-all ${
            stockFilter === "all" 
              ? "bg-gold/15 border-gold shadow-lg shadow-gold/5" 
              : "bg-carbon-800 border-gold/10 hover:border-gold/30"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1">Total Catalog</span>
          <span className="text-xl font-mono font-bold text-white">{totalCount} items</span>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter("in_stock")}
          className={`p-3 rounded-xl border text-left transition-all ${
            stockFilter === "in_stock" 
              ? "bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/10" 
              : "bg-carbon-800 border-gold/10 hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">In Stock</span>
            <CheckCircle2 size={12} className="text-emerald-400" />
          </div>
          <span className="text-xl font-mono font-bold text-emerald-300">{inStockCount} healthy</span>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter("low_stock")}
          className={`p-3 rounded-xl border text-left transition-all ${
            stockFilter === "low_stock" 
              ? "bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-500/10" 
              : "bg-carbon-800 border-gold/10 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Low Stock (≤5)</span>
            <AlertTriangle size={12} className="text-amber-400" />
          </div>
          <span className="text-xl font-mono font-bold text-amber-300">{lowStockCount} urgent</span>
        </button>

        <button
          type="button"
          onClick={() => setStockFilter("out_of_stock")}
          className={`p-3 rounded-xl border text-left transition-all ${
            stockFilter === "out_of_stock" 
              ? "bg-red-950/80 border-red-500 shadow-lg shadow-red-500/10" 
              : "bg-carbon-800 border-gold/10 hover:border-red-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">Out of Stock</span>
            <XCircle size={12} className="text-red-400" />
          </div>
          <span className="text-xl font-mono font-bold text-red-300">{outOfStockCount} zero</span>
        </button>
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

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-carbon-900 border border-gold/20 rounded px-3 py-2 text-xs text-secondary focus:outline-none focus:border-gold"
          >
            <option value="all">All Inventory ({totalCount})</option>
            <option value="in_stock">In Stock ({inStockCount})</option>
            <option value="low_stock">Low Stock ≤ 5 ({lowStockCount})</option>
            <option value="out_of_stock">Out of Stock ({outOfStockCount})</option>
          </select>

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
                <th className="py-3 px-4">Package Weight</th>
                <th className="py-3 px-4">Pricing Mode</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
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
                      {editingWeightId === product.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            min="0.05"
                            value={tempWeight}
                            onChange={(e) => setTempWeight(e.target.value)}
                            className="w-20 bg-carbon-900 border border-gold/40 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-gold"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveWeight(product.id);
                              if (e.key === "Escape") setEditingWeightId(null);
                            }}
                          />
                          <button
                            type="button"
                            disabled={savingWeightId === product.id}
                            onClick={() => handleSaveWeight(product.id)}
                            className="p-1 rounded bg-gold text-black hover:bg-gold-light transition-colors"
                            title="Save weight"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingWeightId(null)}
                            className="p-1 rounded bg-carbon-900 text-muted hover:text-white"
                            title="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditWeight(product)}
                          className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold hover:bg-amber-500/20 hover:border-amber-400 transition-colors"
                          title="Click to quickly edit package shipping weight (kg)"
                        >
                          <span>⚖️ {product.weight_kg ? Number(product.weight_kg) : 1.0} kg</span>
                          <Edit3 size={11} className="opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {editingPriceId === product.id ? (
                        <div className="flex flex-col gap-1.5 p-2 rounded bg-carbon-900/95 border border-gold/40 shadow-xl min-w-[190px]">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mb-0.5">Selling Price (₹)</span>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gold text-xs font-bold">₹</span>
                              <input
                                type="text"
                                placeholder="e.g. 1650"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-full bg-carbon-950 border border-gold/40 rounded pl-5 pr-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-gold"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSavePrice(product.id);
                                  if (e.key === "Escape") setEditingPriceId(null);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mb-0.5">MRP (₹ Strikethrough)</span>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">₹</span>
                              <input
                                type="text"
                                placeholder="e.g. 2499"
                                value={tempMrp}
                                onChange={(e) => setTempMrp(e.target.value)}
                                className="w-full bg-carbon-950 border border-gold/40 rounded pl-5 pr-2 py-1 text-xs text-neutral-200 font-mono focus:outline-none focus:border-gold"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSavePrice(product.id);
                                  if (e.key === "Escape") setEditingPriceId(null);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-gold/15">
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="px-2 py-0.5 rounded bg-carbon-800 text-muted hover:text-white text-[11px]"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={savingPriceId === product.id}
                              onClick={() => handleSavePrice(product.id)}
                              className="px-2.5 py-0.5 rounded bg-gold text-black font-bold hover:bg-gold-light transition-colors text-[11px] flex items-center gap-1"
                              title="Save both Selling Price and MRP"
                            >
                              <Check size={11} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group flex flex-col items-start">
                          {/* Strikethrough MRP and Discount Badge */}
                          {product.mrp && product.price_value && Number(product.mrp) > Number(product.price_value) && (
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="line-through text-[11px] text-neutral-400 font-mono" title={`MRP: ${formatPrice(product.mrp)}`}>
                                {formatPrice(product.mrp)}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/70 px-1 py-0.2 rounded border border-emerald-500/30">
                                {Math.round(((Number(product.mrp) - Number(product.price_value)) / Number(product.mrp)) * 100)}% OFF
                              </span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => startEditPrice(product)}
                            className="inline-flex items-center gap-1.5 font-mono text-white hover:text-gold transition-colors py-0.5"
                            title="Click to quickly edit Selling Price & MRP"
                          >
                            <span className="font-bold text-gold">
                              {product.price_value ? formatPrice(product.price_value) : product.price_display}
                            </span>
                            <Edit3 size={11} className="opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                          </button>
                          <span className="text-[10px] text-muted capitalize">
                            {product.purchase_mode.replace(/_/g, " ")}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {(() => {
                        const stockInfo = getProductStockStatus(product);
                        const isEditingThis = editingStockId === product.id;
                        const isSavingThis = savingStockId === product.id;

                        return (
                          <div className="space-y-1.5">
                            {/* Visual Stock Pill */}
                            <div className="flex items-center gap-2">
                              {stockInfo.status === "out_of_stock" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950/80 text-red-400 border border-red-500/30">
                                  <XCircle size={11} /> Out of Stock
                                </span>
                              )}
                              {stockInfo.status === "low_stock" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-400 border border-amber-500/30 animate-pulse">
                                  <AlertTriangle size={11} /> Low Stock
                                </span>
                              )}
                              {stockInfo.status === "in_stock" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 size={11} /> In Stock
                                </span>
                              )}

                              {/* Toggle Availability Switch Button */}
                              <button
                                type="button"
                                disabled={isSavingThis}
                                onClick={() => handleToggleStock(product.id, product.in_stock)}
                                className="text-[10px] text-muted hover:text-gold transition-colors underline"
                                title={product.in_stock ? "Mark as Out of Stock" : "Mark as In Stock"}
                              >
                                {product.in_stock ? "Turn Off" : "Turn On"}
                              </button>
                            </div>

                            {/* Inline Stock Quantity Editor & Stepper */}
                            {isEditingThis ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  className="w-16 bg-carbon-900 border border-gold rounded px-1.5 py-0.5 text-xs text-white font-mono focus:outline-none"
                                  value={tempStock}
                                  onChange={(e) => setTempStock(e.target.value)}
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveStock(product.id);
                                    if (e.key === "Escape") setEditingStockId(null);
                                  }}
                                />
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() => handleSaveStock(product.id)}
                                  className="p-1 rounded bg-gold text-black hover:bg-gold-light transition-colors"
                                  title="Save stock count"
                                >
                                  <Check size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingStockId(null)}
                                  className="p-1 rounded bg-carbon-900 text-muted hover:text-white"
                                  title="Cancel"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs">
                                <button
                                  type="button"
                                  disabled={isSavingThis || stockInfo.quantity <= 0}
                                  onClick={() => handleStepStock(product, -1)}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-carbon-900 border border-gold/20 text-muted hover:text-white hover:border-gold disabled:opacity-30 text-xs font-mono"
                                  title="Decrease stock by 1"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() => startEditStock(product)}
                                  className="group inline-flex items-center gap-1 font-mono text-white/90 hover:text-gold transition-colors px-1 py-0.5 rounded hover:bg-gold/10"
                                  title="Click to manually edit stock number"
                                >
                                  <span className="font-bold">{stockInfo.quantity}</span>
                                  <span className="text-[10px] text-muted">units</span>
                                  <Edit3 size={10} className="opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isSavingThis}
                                  onClick={() => handleStepStock(product, 1)}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-carbon-900 border border-gold/20 text-muted hover:text-white hover:border-gold disabled:opacity-30 text-xs font-mono"
                                  title="Increase stock by 1"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
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
