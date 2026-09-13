"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal, totalCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay active" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="flex items-center gap-3">
            <h3 className="cart-title">Your Order Inquiry</h3>
            <span className="cart-count-badge">({totalCount} items)</span>
          </div>
          <button 
            type="button" 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-40 text-gold">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p className="empty-text">Your cart is currently empty.</p>
              <Link 
                href="/shop" 
                className="btn btn-gold btn-sm mt-4" 
                onClick={() => setIsCartOpen(false)}
              >
                Browse Shop Catalog
              </Link>
            </div>
          ) : (
            <ul className="cart-item-list">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="cart-item">
                  <img 
                    src={product.main_image} 
                    alt={product.name} 
                    className="cart-item-thumb" 
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <p className="cart-item-model">{product.model || product.brand}</p>
                    <p className="cart-item-price">
                      {product.price_value ? formatPrice(product.price_value) : product.price_display || "Contact for Price"}
                    </p>
                    <div className="cart-item-actions">
                      <div className="quantity-stepper">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        type="button" 
                        className="cart-remove-link"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {subtotal > 0 && (
              <div className="cart-subtotal-row">
                <span>Estimated Subtotal:</span>
                <span className="cart-subtotal-val">{formatPrice(subtotal)}</span>
              </div>
            )}
            <p className="cart-disclaimer">
              Tax & installation estimates finalized upon verification.
            </p>
            <div className="cart-btn-group">
              <Link 
                href="/checkout" 
                className="btn btn-gold w-full text-center" 
                onClick={() => setIsCartOpen(false)}
              >
                Proceed to Checkout
              </Link>
              <a 
                href={`https://wa.me/917533838538?text=${encodeURIComponent(
                  `Hello Sivansh Enterprise, I would like to inquire about the following items:\n` +
                  cart.map((i) => `• ${i.product.name} (Qty: ${i.quantity})`).join('\n')
                )}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-gold-outline w-full text-center"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
