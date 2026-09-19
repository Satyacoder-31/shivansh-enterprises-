"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/database";
import { useCart } from "./CartContext";
import { formatPrice, getProductDisplayPrice } from "@/lib/utils";
import { getProductStockStatus } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const stockInfo = getProductStockStatus(product);

  const isBuyOnline = Boolean(product.price_value) || product.purchase_mode === 'buy_online';
  const displayPrice = getProductDisplayPrice(product);

  const hasDiscount = Boolean(
    product.mrp &&
    product.price_value &&
    Number(product.mrp) > Number(product.price_value)
  );
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.mrp) - Number(product.price_value)) / Number(product.mrp)) * 100)
    : 0;

  const restockWhatsAppMessage = encodeURIComponent(
    `Hello Sivansh Enterprise, I am interested in ${product.name} (Model: ${product.model || 'N/A'}), but noticed it is currently Out of Stock. When will new inventory arrive or can I pre-order?`
  );

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!stockInfo.isAvailable) return;
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className={`product-card ${!stockInfo.isAvailable ? "product-card-out-of-stock opacity-90" : ""}`} id={`product-${product.id}`}>
      {/* Product Image Container */}
      <div className="product-img-wrapper relative">
        {/* Out of stock or low stock badge banner */}
        {!stockInfo.isAvailable ? (
          <span className="product-badge bg-red-600 text-white font-bold tracking-wider">Out of Stock</span>
        ) : stockInfo.isLowStock ? (
          <span className="product-badge bg-amber-600 text-white font-bold animate-pulse">Only {stockInfo.quantity} Left</span>
        ) : product.badge ? (
          <span className="product-badge">{product.badge}</span>
        ) : hasDiscount ? (
          <span className="product-badge bg-emerald-600 text-white font-bold tracking-wide">{discountPercent}% OFF</span>
        ) : null}

        <Link href={`/product-details/${product.id}`} className="product-img-link">
          <img 
            src={product.main_image} 
            alt={product.name} 
            className={`product-img ${!stockInfo.isAvailable ? "grayscale-[30%]" : ""}`} 
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

        {/* Rating & Stock Pill Row */}
        <div className="product-rating-row">
          <div className="stars text-gold">★★★★★</div>
          <span className="rating-num">5.0</span>
          <span className={`stock-pill ${stockInfo.status.replace(/_/g, '-')}`}>
            {stockInfo.badgeLabel}
          </span>
        </div>

        <p className="product-short-desc">
          {product.short_desc || product.tagline || "Engineered for high-reliability commercial and residential deployments."}
        </p>

        {/* Pricing & CTA Buttons */}
        <div className="product-card-footer flex-col items-stretch gap-2.5">
          <div className="flex items-center justify-between w-full">
            <div className="product-price-block">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="price-label">Price</span>
                {hasDiscount && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline flex-wrap gap-1.5">
                {hasDiscount && (
                  <span 
                    className="line-through text-xs text-neutral-400 font-mono" 
                    title={`Maximum Retail Price (MRP): ${formatPrice(product.mrp!)}`}
                  >
                    {formatPrice(product.mrp!)}
                  </span>
                )}
                <span className="product-price-val">{displayPrice}</span>
              </div>
            </div>
            {stockInfo.isLowStock && (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Low Stock
              </span>
            )}
            {!stockInfo.isAvailable && (
              <span className="text-[11px] font-semibold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Sold Out
              </span>
            )}
          </div>

          <div className="product-card-actions flex flex-wrap gap-2 w-full">
            {stockInfo.isAvailable ? (
              <>
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
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  disabled
                  className="btn btn-sm flex-1 text-xs px-2 py-2 bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed font-medium"
                  title="This item is currently out of stock"
                >
                  Out of Stock
                </button>
                <a 
                  href={`https://wa.me/917533838538?text=${restockWhatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold-outline btn-sm flex-1 text-xs px-2 py-2 text-center flex items-center justify-center font-medium"
                  title="Inquire restock timeline via WhatsApp"
                >
                  Inquire Restock
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
