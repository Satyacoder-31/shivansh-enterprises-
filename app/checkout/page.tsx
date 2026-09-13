"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "Keshod",
    state: "Gujarat",
    pincode: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [error, setError] = useState("");

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const orderNumber = `SE-${Date.now().toString().slice(-6)}`;

      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          shipping_address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            company: formData.company
          },
          subtotal: subtotal,
          tax: tax,
          discount: 0,
          total: total,
          order_status: "pending",
          payment_status: "pending",
          notes: formData.notes
        }])
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // 2. Insert order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        sku: item.product.model || item.product.sku,
        unit_price: item.product.price_value || 0,
        quantity: item.quantity,
        total: (item.product.price_value || 0) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw new Error(itemsError.message);

      // 3. Clear cart and set completed order
      clearCart();
      setOrderComplete(orderData);
    } catch (err: any) {
      setError(err.message || "Failed to process order. Please contact our team.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    const whatsappText = encodeURIComponent(
      `Hello Sivansh Enterprise, I have submitted Order #${orderComplete.order_number} for total ₹${orderComplete.total}. Please confirm deployment scheduling.`
    );

    return (
      <div className="checkout-success-container container section-pad text-center max-w-xl mx-auto">
        <div className="text-gold text-5xl mb-4">✓</div>
        <h1 className="serif-heading text-3xl mb-2">Order Inquiry Registered</h1>
        <p className="text-gold font-mono text-lg mb-4">Order ID: #{orderComplete.order_number}</p>
        <p className="text-secondary mb-6 leading-relaxed">
          Thank you, <strong>{orderComplete.customer_name}</strong>. Your equipment order has been registered 
          in our central system. Our engineering dispatch desk in Keshod will contact you at {orderComplete.customer_phone} 
          to verify technical parameters before dispatch.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href={`https://wa.me/917533838538?text=${whatsappText}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-gold"
          >
            Confirm on WhatsApp
          </a>
          <Link href="/shop" className="btn btn-gold-outline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container section-pad">
      <div className="max-w-4xl mx-auto">
        <h1 className="serif-heading text-3xl mb-8">
          ORDER <span className="text-gold-gradient">CHECKOUT.</span>
        </h1>

        {cart.length === 0 ? (
          <div className="p-12 text-center bg-surface rounded border border-gold/20">
            <p className="text-secondary text-lg mb-4">Your order list is currently empty.</p>
            <Link href="/shop" className="btn btn-gold">
              Browse Available Hardware
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmitOrder} className="p-6 bg-surface rounded border border-gold/20 space-y-4">
                <h3 className="serif-heading text-xl text-gold mb-2">Customer & Delivery Details</h3>

                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Bhai"
                      className="form-input text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="form-input text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      className="form-input text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Company / Farm Name</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      className="form-input text-sm"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs">Delivery / Installation Address *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Complete address, landmark..."
                    className="form-input form-textarea text-sm"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="form-label text-xs">City / Town</label>
                    <input
                      type="text"
                      required
                      className="form-input text-sm"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">State</label>
                    <input
                      type="text"
                      required
                      className="form-input text-sm"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="362220"
                      className="form-input text-sm"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-gold w-full mt-4"
                >
                  {loading ? "Processing Order..." : "Confirm Equipment Order"}
                </button>
              </form>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-surface rounded border border-gold/30">
                <h3 className="serif-heading text-lg text-gold mb-4">Equipment Summary</h3>
                <ul className="divide-y divide-gold/10 mb-4 max-h-80 overflow-y-auto">
                  {cart.map(({ product, quantity }) => (
                    <li key={product.id} className="py-3 flex justify-between items-center text-sm">
                      <div className="pr-2">
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-muted">Qty: {quantity}</div>
                      </div>
                      <div className="text-right text-gold font-mono">
                        {product.price_value ? formatPrice(product.price_value * quantity) : product.price_display}
                      </div>
                    </li>
                  ))}
                </ul>

                {subtotal > 0 && (
                  <div className="space-y-2 pt-3 border-t border-gold/20 text-sm">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal:</span>
                      <span className="font-mono">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Estimated GST (18%):</span>
                      <span className="font-mono">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-gold/20">
                      <span>Total:</span>
                      <span className="text-gold font-mono">{formatPrice(total)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
