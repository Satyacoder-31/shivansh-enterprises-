"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const isBuyOnline = Boolean(product.price_value) || product.purchase_mode === 'buy_online';
  const displayPrice = product.price_value 
    ? formatPrice(product.price_value) 
    : (product.price_display || "Contact for Price");

  const whatsappMessage = encodeURIComponent(
    `Hello Sivansh Enterprise, I would like to inquire about ${product.name} (Model: ${product.model || 'N/A'}). Please share the price and availability.`
  );

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Product Image Container */}
      <div className="product-img-wrapper">
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        <Link href={`/product-details/${product.id}`} className="product-img-link">
          <img 
            src={product.main_image} 
            alt={product.name} 
            className="product-img" 
            loading="lazy" 
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-category-tag">
            {product.sub_category || product.category?.name || product.category_id.toUpperCase()}
          </span>
          {product.brand && (
            <span className="product-brand-tag">{product.brand}</span>
          )}
        </div>

        <h3 className="product-title">
          <Link href={`/product-details/${product.id}`}>{product.name}</Link>
        </h3>

        {product.model && (
          <p className="product-model-number">Model: {product.model}</p>
        )}

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="stars text-gold">★★★★★</div>
          <span className="rating-num">5.0</span>
          <span className="stock-pill in-stock">
            {product.in_stock ? "Authentic Stock" : "Backorder"}
          </span>
        </div>

        <p className="product-short-desc">
          {product.short_desc || product.tagline || "Engineered for high-reliability commercial and residential deployments."}
        </p>

        {/* Pricing & CTA Buttons */}
        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="price-label">Pricing</span>
            <span className="product-price-val">{displayPrice}</span>
          </div>

          <div className="product-card-actions flex flex-wrap gap-2">
            <button 
              type="button" 
              className="btn btn-gold-outline btn-sm flex-1 text-xs px-2 py-2"
              onClick={() => addToCart(product, 1)}
              title="Add item to your shopping cart"
            >
              Add to Cart
            </button>
            <button 
              type="button" 
              className="btn btn-gold btn-sm flex-1 text-xs px-2 py-2 font-bold"
              onClick={handleBuyNow}
              title="Proceed directly to order checkout"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
