"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.main_image);

  const isBuyOnline = Boolean(product.price_value) || product.purchase_mode === "buy_online";
  const displayPrice = product.price_value
    ? formatPrice(product.price_value)
    : product.price_display || "Contact for Price";

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const allImages = [
    product.main_image,
    ...(product.images?.map((img) => img.image_url) || []).filter((url) => url !== product.main_image),
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello Sivansh Enterprise, I am reviewing the ${product.name} (Model: ${product.model || "N/A"}) on your official catalog. Could you please provide immediate pricing, deployment feasibility, and availability?`
  );

  return (
    <div className="product-details-grid">
      {/* Col 1: Media Showcase */}
      <div className="product-gallery-column">
        <div className="main-image-viewport">
          {product.badge && (
            <span className="product-badge-large">{product.badge}</span>
          )}
          <img 
            src={activeImage} 
            alt={product.name} 
            className="main-detail-img" 
          />
        </div>

        {allImages.length > 1 && (
          <div className="thumbnail-strip mt-4 flex gap-3">
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                className={`thumb-btn ${activeImage === imgUrl ? "active" : ""}`}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="thumb-img" />
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

        <div className="product-rating-row mb-4">
          <div className="stars text-gold">★★★★★</div>
          <span className="rating-num">5.0 Official Rating</span>
          <span className="stock-pill in-stock ml-3">
            {product.in_stock ? "Authentic Stock Available" : "Special Order"}
          </span>
          {Number(product.weight_kg) > 0 && (
            <span className="stock-pill ml-2 border border-gold/30 bg-gold/10 text-gold text-xs">
              ⚖️ {product.weight_kg} kg Ship Weight
            </span>
          )}
        </div>

        {product.tagline && (
          <p className="product-tagline-quote text-gold italic mb-4">
            "{product.tagline}"
          </p>
        )}

        <p className="product-full-desc text-secondary mb-6 leading-relaxed">
          {product.short_desc || product.full_desc}
        </p>

        {/* Pricing Block */}
        <div className="product-price-box p-4 bg-surface rounded mb-6 border border-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted block mb-1">Pricing Mode</span>
              <span className="text-2xl font-bold text-gold">{displayPrice}</span>
            </div>
            <span className="text-xs text-secondary max-w-xs text-right">
              {isBuyOnline ? "Ex-Keshod warehouse • GST & shipping estimated at checkout" : "Genuine brand quotation directly from authorized distributor"}
            </span>
          </div>
        </div>

        {/* Purchase / Inquiry Actions */}
        <div className="product-cta-container mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="quantity-selector flex items-center border border-gold/40 rounded">
              <button
                type="button"
                className="px-3 py-2 text-gold hover:bg-gold/10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                type="button"
                className="px-3 py-2 text-gold hover:bg-gold/10"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
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
            >
              Inquire on WhatsApp
            </a>
          </div>
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
                  {product.specs.map((s, idx) => (
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
