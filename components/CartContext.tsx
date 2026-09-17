"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/types/database";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncCart: (itemsToSync?: CartItem[]) => Promise<void>;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart items with latest server database prices, weights, and stock
  const syncCart = async (itemsToSync?: CartItem[]) => {
    const currentItems = itemsToSync || cart;
    if (!currentItems || currentItems.length === 0) return;
    const ids = currentItems.map((i) => i.product.id).filter(Boolean);
    if (ids.length === 0) return;

    try {
      const res = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const prodMap = new Map<string, Product>(data.products.map((p: Product) => [p.id, p]));
        setCart((prev) =>
          prev.map((item) => {
            const fresh = prodMap.get(item.product.id);
            if (fresh) {
              return {
                ...item,
                product: {
                  ...item.product,
                  ...fresh,
                  weight_kg: Number(fresh.weight_kg) > 0 ? fresh.weight_kg : item.product.weight_kg || 1.0,
                  price_value: fresh.price_value !== undefined ? fresh.price_value : item.product.price_value,
                  price_display: fresh.price_display || item.product.price_display,
                },
              };
            }
            return item;
          })
        );
      }
    } catch {
      // Gracefully handle offline or network hiccups
    }
  };

  // Load from localStorage on mount & immediately trigger live database sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sivansh_cart");
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
          syncCart(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save to localStorage whenever cart state changes
  useEffect(() => {
    try {
      localStorage.setItem("sivansh_cart", JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.product.price_value) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
