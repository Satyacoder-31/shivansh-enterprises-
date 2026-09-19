"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { useCart } from "@/components/CartContext";
import { formatPrice, getProductDisplayPrice } from "@/lib/utils";
import { getProductStockStatus } from "@/lib/stock";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.main_image);

  const stockInfo = getProductStockStatus(product);

  const isBuyOnline = Boolean(product.price_value) || product.purchase_mode === "buy_online";
  const displayPrice = getProductDisplayPrice(product);

  const hasDiscount = Boolean(
    product.mrp &&
    product.price_value &&
    Number(product.mrp) > Number(product.price_value)
  );
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.mrp) - Number(product.price_value)) / Number(product.mrp)) * 100)
    : 0;
  const savingsAmount = hasDiscount
    ? Math.round(Number(product.mrp) - Number(product.price_value))
    : 0;

  const handleBuyNow = () => {
    if (!stockInfo.isAvailable) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Sivansh Enterprise, I would like to inquire about ${product.name} (Model: ${product.model || 'N/A'}). Please share availability and customized quotation.`
  );

  const restockWhatsAppMessage = encodeURIComponent(
    `Hello Sivansh Enterprise, I would like to order ${product.name} (Model: ${product.model || 'N/A'}), but noticed it is currently Out of Stock. When will new stock arrive or can you reserve units for me?`
  );

  return (
    <div className="product-details-grid">
      {/* Col 1: Media Showcase */}
      <div className="product-gallery-column">
        <div className="main-image-viewport relative">
          {!stockInfo.isAvailable && (
            <div className="absolute top-4 left-4 z-10 bg-red-600/95 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-lg">
              Out of Stock
            </div>
          )}
          {stockInfo.isLowStock && (
            <div className="absolute top-4 left-4 z-10 bg-amber-600/95 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-lg animate-pulse">
              Only {stockInfo.quantity} Left
            </div>
          )}
          {stockInfo.isAvailable && hasDiscount && (
            <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white text-xs font-bold tracking-wider px-3 py-1 rounded shadow-lg">
              {discountPercent}% OFF
            </div>
          )}
          <img 
            src={activeImage} 
            alt={product.name} 
            className={`main-display-image ${!stockInfo.isAvailable ? "grayscale-[25%]" : ""}`} 
          />
        </div>

        {/* Image Thumbnails Carousel */}
        {product.images && product.images.length > 1 && (
          <div className="thumbnail-track mt-4 flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              className={`thumb-btn ${activeImage === product.main_image ? "active" : ""}`}
              onClick={() => setActiveImage(product.main_image)}
            >
              <img src={product.main_image} alt={product.name} className="w-16 h-16 object-cover rounded border" />
            </button>
            {product.images.map((img) => (
              <button
                key={img.id || img.image_url}
                type="button"
                className={`thumb-btn ${activeImage === img.image_url ? "active" : ""}`}
                onClick={() => setActiveImage(img.image_url)}
              >
                <img src={img.image_url} alt={product.name} className="w-16 h-16 object-cover rounded border" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Col 2: Specifications, Pricing & Actions */}
      <div className="product-info-column">
        <div className="product-header-meta">
          <span className="product-category-tag">
            {product.sub_category || product.category?.name || product.category_id.toUpperCase()}
          </span>
          {product.brand && (
            <span className="product-brand-tag">{product.brand}</span>
          )}
        </div>

        <h1 className="product-details-title serif-heading">{product.name}</h1>

        {product.model && (
          <div className="product-model-chip mb-3">
            <span>Model Number:</span> <strong>{product.model}</strong>
          </div>
        )}

        <div className="product-rating-row mb-4 flex flex-wrap items-center gap-2">
          <div className="stars text-gold">★★★★★</div>
          <span className="rating-num">5.0 Official Rating</span>
          <span className={`stock-pill ${stockInfo.status.replace(/_/g, '-')}`}>
            {stockInfo.detailLabel}
          </span>
          {Number(product.weight_kg) > 0 && (
            <span className="stock-pill border border-gold/30 bg-gold/10 text-gold text-xs">
              ⚖️ {product.weight_kg} kg Ship Weight
            </span>
          )}
        </div>

        {/* Low Stock Urgency Alert Banner */}
        {stockInfo.isLowStock && (
          <div className="p-3.5 mb-5 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 animate-pulse">
            <span className="text-xl leading-none mt-0.5">⚡</span>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">Limited Stock Remaining</h4>
              <p className="text-xs text-amber-200/90 mt-0.5">{stockInfo.urgencyMessage}</p>
            </div>
          </div>
        )}

        {/* Out of Stock Alert Banner */}
        {!stockInfo.isAvailable && (
          <div className="p-3.5 mb-5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">🚫</span>
            <div>
              <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide">Currently Unavailable</h4>
              <p className="text-xs text-red-200/90 mt-0.5">{stockInfo.urgencyMessage}</p>
            </div>
          </div>
        )}

        {product.tagline && (
          <p className="product-tagline-quote text-gold italic mb-4">
            "{product.tagline}"
          </p>
        )}

        <p className="product-full-desc text-secondary mb-6 leading-relaxed">
          {product.short_desc || product.full_desc}
        </p>

        {/* Pricing Block */}
        <div className="product-price-box p-5 bg-surface rounded-xl mb-6 border border-gold/25 shadow-lg shadow-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted block mb-1.5">
                {isBuyOnline ? "Authentic Equipment Pricing" : "Pricing Mode"}
              </span>
              <div className="flex items-baseline flex-wrap gap-3">
                {hasDiscount && (
                  <span 
                    className="line-through text-lg text-neutral-400 font-mono" 
                    title={`Original Maximum Retail Price (MRP): ${formatPrice(product.mrp!)}`}
                  >
                    <span className="text-xs font-sans text-neutral-500 mr-1">MRP:</span>
                    {formatPrice(product.mrp!)}
                  </span>
                )}
                <span className="text-3xl font-bold text-gold font-mono tracking-tight">
                  {displayPrice}
                </span>
                {isBuyOnline && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                    Incl. GST
                  </span>
                )}
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <span>⚡</span> {discountPercent}% OFF
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-emerald-400 font-medium mt-1.5 flex items-center gap-1.5">
                  <span>✓</span> You save <strong className="font-mono">₹{savingsAmount.toLocaleString("en-IN")}</strong> ({discountPercent}%) directly from authorized distributor stock
                </p>
              )}
              {isBuyOnline && (
                <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Price is inclusive of 18% GST. Zero tax surcharge at checkout.
                </p>
              )}
            </div>
            <div className="text-xs text-secondary sm:max-w-[210px] sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gold/10">
              {isBuyOnline 
                ? "Ex-Keshod warehouse • Official manufacturer warranty • Price includes 18% GST" 
                : "Genuine brand quotation directly from authorized distributor"}
            </div>
          </div>
        </div>

        {/* Purchase / Inquiry Actions */}
        <div className="product-cta-container mb-8">
          {stockInfo.isAvailable ? (
            <div className="flex flex-wrap gap-4 items-center">
              {/* Quantity Selector clamped to stock */}
              <div className="quantity-selector flex items-center border border-gold/40 rounded">
                <button
                  type="button"
                  className="px-3 py-2 text-gold hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium font-mono">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-gold hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity >= stockInfo.quantity}
                  onClick={() => setQuantity(Math.min(stockInfo.quantity, quantity + 1))}
                  aria-label="Increase quantity"
                  title={quantity >= stockInfo.quantity ? `Max available stock reached (${stockInfo.quantity} units)` : "Increase quantity"}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-gold-outline flex-1"
                onClick={() => addToCart(product, quantity)}
              >
                Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-gold flex-1 font-bold"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <a
                href={`https://wa.me/917533838538?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold-outline"
                title="Inquire via WhatsApp"
              >
                Inquire on WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="button"
                disabled
                className="btn bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed py-3 px-6 font-medium"
                title="This product is currently out of stock"
              >
                Sold Out / Out of Stock
              </button>

              <a
                href={`https://wa.me/917533838538?text=${restockWhatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold flex-1 text-center font-bold py-3 px-6 shadow-lg shadow-gold/10"
                title="Notify me when restocked or book via WhatsApp"
              >
                Inquire Restock & Reserve via WhatsApp
              </a>
            </div>
          )}

          {stockInfo.isAvailable && quantity >= stockInfo.quantity && stockInfo.quantity < 20 && (
            <p className="text-[11px] text-amber-400 mt-2">
              ⚠️ You have selected the maximum available quantity ({stockInfo.quantity} units) currently in stock.
            </p>
          )}
        </div>

        {/* Dynamic Features List */}
        {product.features && product.features.length > 0 && (
          <div className="product-features-block mb-8">
            <h3 className="features-heading text-lg font-serif mb-3 text-gold">
              Core Technical Features
            </h3>
            <ul className="feature-list-detailed">
              {product.features.map((f, idx) => (
                <li key={idx} className="feature-item-row flex items-start gap-3 mb-2">
                  <span className="check-bullet text-gold">✓</span>
                  <span className="feature-text text-secondary">{f.feature_text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dynamic Specifications Table */}
        {product.specs && product.specs.length > 0 && (
          <div className="product-specs-table-wrap mb-8">
            <h3 className="specs-heading text-lg font-serif mb-3 text-gold">
              Detailed Engineering Specifications
            </h3>
            <div className="specs-table-container border border-gold/20 rounded overflow-hidden">
              <table className="w-full text-left text-sm">
                <tbody>
                  {product.specs.filter((s) => !s.spec_name.startsWith('__')).map((s, idx) => (
                    <tr 
                      key={idx} 
                      className={idx % 2 === 0 ? "bg-surface/50" : "bg-transparent"}
                    >
                      <th className="py-2.5 px-4 font-semibold text-gold/90 w-1/3 border-b border-gold/10">
                        {s.spec_name}
                      </th>
                      <td className="py-2.5 px-4 text-secondary border-b border-gold/10">
                        {s.spec_value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Application Deployment Recommendations */}
        {product.application && (
          <div className="product-application-card p-4 bg-surface rounded border border-gold/15">
            <span className="text-xs uppercase tracking-wider text-gold block mb-1">
              Recommended Deployments
            </span>
            <p className="text-sm text-secondary">{product.application}</p>
          </div>
        )}
      </div>
    </div>
  );
}
