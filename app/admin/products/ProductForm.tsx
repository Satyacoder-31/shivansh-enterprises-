"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/lib/actions/admin";
import type { Product, ProductSpec, ProductFeature } from "@/types/database";
import { Plus, Trash2, Save, ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import { getProductStockStatus } from "@/lib/stock";

interface ProductFormProps {
  initialProduct?: Product | null;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    model: initialProduct?.model || "",
    brand: initialProduct?.brand || "",
    category_id: initialProduct?.category_id || "cctv",
    sub_category: initialProduct?.sub_category || "",
    badge: initialProduct?.badge || "",
    purchase_mode: initialProduct?.purchase_mode || "contact_for_price",
    price_display: initialProduct?.price_display || "Contact for Price",
    price_value: initialProduct?.price_value || "",
    mrp: initialProduct?.mrp !== undefined && initialProduct?.mrp !== null ? String(initialProduct.mrp) : "",
    weight_kg: (initialProduct?.specs?.find((s) => s.spec_name === '__weight_kg' || s.spec_name?.toLowerCase() === 'shipping weight')?.spec_value)
      || (initialProduct?.weight_kg !== undefined && initialProduct?.weight_kg !== null && Number(initialProduct?.weight_kg) > 0 ? String(initialProduct.weight_kg) : "1.0"),
    rating: initialProduct?.rating || 5.0,
    in_stock: initialProduct?.in_stock !== false,
    stock_quantity: initialProduct?.stock_quantity !== undefined && initialProduct?.stock_quantity !== null
      ? String(initialProduct.stock_quantity)
      : (initialProduct?.in_stock === false ? "0" : "100"),
    main_image: initialProduct?.main_image || "/assets/images/products/cofe-4g-solar-camera.jpg",
    short_desc: initialProduct?.short_desc || "",
    tagline: initialProduct?.tagline || "",
    application: initialProduct?.application || "",
    status: initialProduct?.status || "published",
    is_featured: initialProduct?.is_featured || false,
    display_order: initialProduct?.display_order || 1,
  });

  const [specs, setSpecs] = useState<{ spec_name: string; spec_value: string }[]>(
    initialProduct?.specs
      ?.filter((s) => !s.spec_name.startsWith('__') && s.spec_name.toLowerCase() !== 'shipping weight')
      .map((s) => ({ spec_name: s.spec_name, spec_value: s.spec_value })) || [
      { spec_name: "Resolution", spec_value: "4 Megapixel Full HD" },
      { spec_name: "Power Source", spec_value: "Solar Panel with Inbuilt Battery" }
    ]
  );

  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features?.map((f) => f.feature_text) || [
      "100% Wire-Free autonomous deployment",
      "Starlight Color Night Vision multi-array"
    ]
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialProduct?.images?.map((img) => img.image_url).filter((url) => url !== initialProduct?.main_image) || []
  );

  // Add & remove specs
  const addSpec = () => {
    setSpecs([...specs, { spec_name: "", spec_value: "" }]);
  };

  const updateSpec = (index: number, field: "spec_name" | "spec_value", value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Add & remove features
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add & remove gallery images
  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, ""]);
  };

  const updateGalleryImage = (index: number, url: string) => {
    const updated = [...galleryImages];
    updated[index] = url;
    setGalleryImages(updated);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name.trim()) throw new Error("Product name is required.");

      let safePriceVal: number | null = null;
      if (formData.price_value !== undefined && formData.price_value !== null && String(formData.price_value).trim() !== "") {
        const parsed = parseFloat(String(formData.price_value).replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed) && parsed > 0) {
          safePriceVal = Math.round(parsed);
        }
      }

      let safeMrpVal: number | null = null;
      if (formData.mrp !== undefined && formData.mrp !== null && String(formData.mrp).trim() !== "") {
        const parsedMrp = parseFloat(String(formData.mrp).replace(/[^0-9.]/g, ''));
        if (!isNaN(parsedMrp) && parsedMrp > 0) {
          safeMrpVal = Math.round(parsedMrp);
        }
      }

      const safePurchaseMode = safePriceVal !== null && safePriceVal > 0 
        ? "buy_online" 
        : (formData.purchase_mode as any);

      const userEnteredDisplay = formData.price_display?.trim();
      const safePriceDisplay = userEnteredDisplay && userEnteredDisplay !== ""
        ? userEnteredDisplay
        : (safePriceVal !== null && safePriceVal > 0
            ? `₹${safePriceVal.toLocaleString('en-IN')}`
            : "Contact for Price");

      const productPayload: Partial<Product> = {
        ...(initialProduct?.id ? { id: initialProduct.id } : {}),
        name: formData.name,
        model: formData.model || null,
        brand: formData.brand || null,
        category_id: formData.category_id,
        sub_category: formData.sub_category || null,
        badge: formData.badge || null,
        purchase_mode: safePurchaseMode,
        price_display: safePriceDisplay,
        price_value: safePriceVal,
        sale_price: safePriceVal,
        mrp: safeMrpVal,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : 1.0,
        rating: Number(formData.rating),
        stock_quantity: Math.max(0, parseInt(String(formData.stock_quantity || 0), 10) || 0),
        in_stock: Boolean(formData.in_stock && (parseInt(String(formData.stock_quantity || 0), 10) || 0) > 0),
        main_image: formData.main_image,
        short_desc: formData.short_desc,
        tagline: formData.tagline,
        application: formData.application,
        status: formData.status as any,
        is_featured: Boolean(formData.is_featured),
        display_order: Number(formData.display_order),
      };

      const validSpecs = specs.filter((s) => s.spec_name.trim() && s.spec_value.trim());
      const validFeatures = features.filter((f) => f.trim());
      const validGalleryImages = galleryImages.filter((img) => img.trim());

      setSuccessMsg("");
      await saveProduct(productPayload, validSpecs, validFeatures, validGalleryImages);
      setSuccessMsg(`Product details & shipping weight (${formData.weight_kg || '1.0'} kg) saved successfully!`);
      router.refresh();
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-6 border-b border-gold/15">
        <Link 
          href="/admin/products"
          className="text-xs text-secondary hover:text-gold flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold btn-sm flex items-center gap-1.5"
        >
          <Save size={14} />
          {loading ? "Persisting to Supabase..." : initialProduct ? "Update Product" : "Publish Product"}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
          <Link href="/admin/products" className="underline text-xs text-white hover:text-gold">
            Return to Catalog →
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/40 text-red-300 rounded text-sm">
          {error}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="p-6 bg-carbon-800 border border-gold/15 rounded-xl space-y-4">
        <h2 className="font-serif text-lg font-bold text-gold">1. Hardware Identity & Categorization</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-xs">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. COFE 4G Solar PTZ Camera"
              className="form-input text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-xs">Model Number</label>
            <input
              type="text"
              placeholder="e.g. CF-4G-PTSL24-A-DL Pro"
              className="form-input text-sm"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label text-xs">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. COFE, CP PLUS, HI-FOCUS"
              className="form-input text-sm"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-xs">Category *</label>
            <select
              className="form-input form-select text-sm"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="cctv">CCTV Surveillance</option>
              <option value="led">Architectural LED Lighting</option>
              <option value="solar">Rooftop Solar</option>
            </select>
          </div>
          <div>
            <label className="form-label text-xs">Subcategory</label>
            <input
              type="text"
              placeholder="e.g. Solar CCTV, Downlights"
              className="form-input text-sm"
              value={formData.sub_category}
              onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-xs">Badge Text</label>
            <input
              type="text"
              placeholder="e.g. 10-Day Battery Backup"
              className="form-input text-sm"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-xs">Official Tagline</label>
            <input
              type="text"
              placeholder="e.g. Eyes That Never Blink On Your Safety"
              className="form-input text-sm"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label text-xs">Short Technical Summary</label>
          <textarea
            rows={3}
            placeholder="Concise overview of product capabilities..."
            className="form-input form-textarea text-sm"
            value={formData.short_desc}
            onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label text-xs">Recommended Deployment & Applications</label>
          <input
            type="text"
            placeholder="e.g. Farms, Agricultural Land, Luxury Residences, Commercial GIDC"
            className="form-input text-sm"
            value={formData.application}
            onChange={(e) => setFormData({ ...formData, application: e.target.value })}
          />
        </div>
      </div>

      {/* 2. Pricing & Purchase Mode */}
      <div className="p-6 bg-carbon-800 border border-gold/15 rounded-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-gold">2. Pricing, MRP & Purchase Mode</h2>
          <span className="text-[11px] text-muted font-mono">Both Selling Price & MRP editable</span>
        </div>

        {/* Core Pricing Grid: Selling Price & MRP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-carbon-900/90 border border-gold/20 rounded-lg">
          <div>
            <label className="form-label text-xs block mb-1 text-white font-semibold">
              Selling Price (₹ Customer Pays) *
            </label>
            <div className="flex items-stretch rounded-lg overflow-hidden border border-gold/40 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25 transition-all bg-carbon-950">
              <span className="inline-flex items-center justify-center px-4 bg-carbon-900 border-r border-gold/30 text-gold font-bold text-sm select-none shrink-0">
                ₹
              </span>
              <input
                type="text"
                placeholder="e.g. 1650"
                className="w-full bg-transparent px-3.5 py-2.5 text-base font-mono font-bold text-white placeholder:text-neutral-500 focus:outline-none"
                value={formData.price_value}
                onChange={(e) => {
                  const val = e.target.value;
                  const clean = val.replace(/[^0-9.]/g, "");
                  const num = parseFloat(clean);
                  const currentDisplay = formData.price_display?.trim() || "";
                  const isAutoDisplay = !currentDisplay || 
                    currentDisplay.toLowerCase().includes("contact") || 
                    /^₹[\d,]+$/.test(currentDisplay);

                  setFormData({
                    ...formData,
                    price_value: val,
                    price_display: isAutoDisplay && !isNaN(num) && num > 0 
                      ? `₹${Math.round(num).toLocaleString('en-IN')}` 
                      : formData.price_display,
                    purchase_mode: !isNaN(num) && num > 0 ? "buy_online" : formData.purchase_mode
                  });
                }}
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Active direct checkout price. Customer pays this amount online.
            </span>
          </div>

          <div>
            <label className="form-label text-xs block mb-1 text-white font-semibold">
              Maximum Retail Price — MRP (₹ Original Printed Price)
            </label>
            <div className="flex items-stretch rounded-lg overflow-hidden border border-gold/40 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25 transition-all bg-carbon-950">
              <span className="inline-flex items-center justify-center px-4 bg-carbon-900 border-r border-gold/30 text-neutral-400 font-bold text-sm select-none shrink-0">
                ₹
              </span>
              <input
                type="text"
                placeholder="e.g. 2499"
                className="w-full bg-transparent px-3.5 py-2.5 text-base font-mono text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
                value={formData.mrp}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    mrp: val
                  });
                }}
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              When MRP is higher than Selling Price, MRP is displayed with a strikethrough text.
            </span>
          </div>

          {/* Dynamic Live Discount & Strikethrough Preview */}
          {(() => {
            const cleanPrice = parseFloat(String(formData.price_value || "").replace(/[^0-9.]/g, ""));
            const cleanMrp = parseFloat(String(formData.mrp || "").replace(/[^0-9.]/g, ""));
            const hasValidPrice = !isNaN(cleanPrice) && cleanPrice > 0;
            const hasValidMrp = !isNaN(cleanMrp) && cleanMrp > 0;

            if (hasValidPrice && hasValidMrp) {
              if (cleanMrp > cleanPrice) {
                const discount = Math.round(((cleanMrp - cleanPrice) / cleanMrp) * 100);
                const savings = Math.round(cleanMrp - cleanPrice);
                return (
                  <div className="sm:col-span-2 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-muted">Storefront Display:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="line-through text-xs text-neutral-400 font-mono">
                          ₹{Math.round(cleanMrp).toLocaleString("en-IN")}
                        </span>
                        <span className="text-base font-bold text-gold font-mono">
                          ₹{Math.round(cleanPrice).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ Strikethrough active (Customer saves ₹{savings.toLocaleString("en-IN")})
                    </span>
                  </div>
                );
              } else {
                return (
                  <div className="sm:col-span-2 p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                    ℹ️ MRP (₹{cleanMrp.toLocaleString("en-IN")}) is less than or equal to Selling Price (₹{cleanPrice.toLocaleString("en-IN")}). Strikethrough is only displayed when MRP &gt; Selling Price.
                  </div>
                );
              }
            } else if (hasValidPrice) {
              return (
                <div className="sm:col-span-2 p-2.5 bg-carbon-950/40 border border-neutral-700/50 rounded-lg text-xs text-neutral-400 flex items-center justify-between">
                  <span>Display price: <strong className="text-white">₹{Math.round(cleanPrice).toLocaleString("en-IN")}</strong></span>
                  <span className="text-[11px] text-muted">Add an MRP above to show strikethrough price and savings badge.</span>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Secondary Details: Purchase Mode, Display Label, Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label text-xs">Purchase Mode *</label>
            <select
              className="form-input form-select text-sm"
              value={formData.purchase_mode}
              onChange={(e) => setFormData({ ...formData, purchase_mode: e.target.value as any })}
            >
              <option value="contact_for_price">Contact for Price (Quotation / WhatsApp)</option>
              <option value="buy_online">Buy Online (Instant Add to Cart & Checkout)</option>
            </select>
          </div>

          <div>
            <label className="form-label text-xs">Display Label Override</label>
            <input
              type="text"
              placeholder="e.g. ₹1,650 or Contact for Price"
              className="form-input text-sm"
              value={formData.price_display}
              onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label text-xs flex items-center justify-between">
              <span>Package Weight (kg)</span>
              <span className="text-[10px] text-gold font-normal">Courier Rate</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.05"
              placeholder="e.g. 1.0 or 15.5"
              className="form-input text-sm font-mono"
              value={formData.weight_kg}
              onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Dead/volumetric weight used for live Shiprocket freight quotes.
            </span>
          </div>
        </div>

        {/* Inventory & Stock Section */}
        <div className="p-4 bg-carbon-900/80 border border-gold/20 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold flex items-center gap-2">
              <span>Warehouse Stock & Inventory Control</span>
            </h3>
            {(() => {
              const stockInfo = getProductStockStatus({
                in_stock: formData.in_stock,
                stock_quantity: formData.stock_quantity
              });
              if (stockInfo.status === 'out_of_stock') {
                return (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-red-950/80 text-red-400 border border-red-500/40">
                    <XCircle size={13} /> Out of Stock (0)
                  </span>
                );
              }
              if (stockInfo.status === 'low_stock') {
                return (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse">
                    <AlertTriangle size={13} /> Low Stock ({stockInfo.quantity} left)
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={13} /> In Stock ({stockInfo.quantity} units)
                </span>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs block mb-1">
                Stock Quantity Available (Units) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 50"
                className="form-input text-sm font-mono"
                value={formData.stock_quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = parseInt(val, 10);
                  setFormData({
                    ...formData,
                    stock_quantity: val,
                    in_stock: !isNaN(num) && num > 0,
                  });
                }}
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Units ≤ 5 trigger "Only X left!" urgency alerts on storefront. Setting 0 marks product Out of Stock.
              </span>
            </div>

            <div className="flex flex-col justify-center space-y-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({
                      ...formData,
                      in_stock: checked,
                      stock_quantity: checked ? (parseInt(formData.stock_quantity, 10) > 0 ? formData.stock_quantity : "50") : "0",
                    });
                  }}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span className="font-medium text-white">In Stock / Immediate Availability</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>
          </div>

          {/* Real-time Customer Storefront Stock Preview Alert */}
          {(() => {
            const stockInfo = getProductStockStatus({
              in_stock: formData.in_stock,
              stock_quantity: formData.stock_quantity
            });

            if (stockInfo.status === 'out_of_stock') {
              return (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-300 flex items-start gap-2">
                  <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-200">Storefront Notice: Out of Stock</strong>
                    Customer Add to Cart and Buy Now buttons will be disabled. An "Inquire Availability via WhatsApp" button will be displayed instead.
                  </div>
                </div>
              );
            }

            if (stockInfo.status === 'low_stock') {
              return (
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-200">Storefront Notice: Low Stock Warning Active</strong>
                    Customers will see an urgent badge <span className="underline font-mono font-bold">Only {stockInfo.quantity} left!</span> on product cards and details to incentivize quick order placement.
                  </div>
                </div>
              );
            }

            return (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-200">Storefront Notice: Standard Stock Available</strong>
                  Customers can purchase normally and order up to {stockInfo.quantity} units directly.
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. Media & Image Upload */}
      <div className="p-6 bg-carbon-800 border border-gold/15 rounded-xl space-y-4">
        <h2 className="font-serif text-lg font-bold text-gold">3. Product Media & Gallery</h2>
        <MediaUploadInput
          label="Product Main Image *"
          value={formData.main_image}
          onChange={(url) => setFormData({ ...formData, main_image: url })}
          folder="products"
          placeholder="/assets/images/products/... or upload directly"
          required
        />

        {/* Additional Gallery Images */}
        <div className="pt-4 border-t border-gold/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-neutral-300 font-medium">Additional Gallery Photos</h3>
              <p className="text-muted text-[11px]">Secondary photo angles shown in the thumbnail carousel on the product page.</p>
            </div>
            <button
              type="button"
              onClick={addGalleryImage}
              className="btn btn-gold-outline btn-sm flex items-center gap-1"
            >
              <Plus size={14} /> Add Gallery Photo
            </button>
          </div>

          <div className="space-y-3">
            {galleryImages.map((imgUrl, idx) => (
              <div key={idx} className="flex gap-2 items-start p-3 bg-black/40 rounded border border-white/5">
                <div className="flex-1">
                  <MediaUploadInput
                    label={`Gallery Image ${idx + 1}`}
                    value={imgUrl}
                    onChange={(url) => updateGalleryImage(idx, url)}
                    folder="products"
                    placeholder="Upload or select secondary product angle"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="p-2 text-red-400 hover:text-red-300 mt-6"
                  aria-label="Remove Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Dynamic Specifications (Repeatable) */}
      <div className="p-6 bg-carbon-800 border border-gold/15 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-gold">4. Technical Specifications</h2>
            <p className="text-muted text-xs">Dynamic key-value pairs matching official brand brochures.</p>
          </div>
          <button
            type="button"
            onClick={addSpec}
            className="btn btn-gold-outline btn-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Specification
          </button>
        </div>

        <div className="space-y-2">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Spec Name (e.g. Image Sensor)"
                className="form-input text-xs w-1/3"
                value={spec.spec_name}
                onChange={(e) => updateSpec(idx, "spec_name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Value (e.g. 1/2.8 2.4MP CMOS)"
                className="form-input text-xs flex-1"
                value={spec.spec_value}
                onChange={(e) => updateSpec(idx, "spec_value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="p-2 text-red-400 hover:text-red-300"
                aria-label="Remove Spec"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Dynamic Features (Repeatable) */}
      <div className="p-6 bg-carbon-800 border border-gold/15 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-gold">5. Core Feature Highlights</h2>
            <p className="text-muted text-xs">Repeatable bullet points with gold checkmarks on product page.</p>
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="btn btn-gold-outline btn-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Feature
          </button>
        </div>

        <div className="space-y-2">
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-gold text-xs font-bold w-5">{idx + 1}.</span>
              <input
                type="text"
                placeholder="Feature description (e.g. 10 Days Continuous Battery Backup)"
                className="form-input text-xs flex-1"
                value={feat}
                onChange={(e) => updateFeature(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-2 text-red-400 hover:text-red-300"
                aria-label="Remove Feature"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gold/15">
        <Link href="/admin/products" className="btn btn-gold-outline">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold px-8 flex items-center gap-2"
        >
          <Save size={16} />
          {loading ? "Persisting Changes..." : initialProduct ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
