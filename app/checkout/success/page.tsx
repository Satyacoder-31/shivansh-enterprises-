"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const orderNumberParam = searchParams.get("order_number");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId && !orderNumberParam) {
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        let query = supabase.from("orders").select("*, order_items(*)");
        if (orderId) {
          query = query.eq("id", orderId);
        } else if (orderNumberParam) {
          query = query.eq("order_number", orderNumberParam);
        }

        const { data, error } = await query.single();
        if (!error && data) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, orderNumberParam]);

  const displayOrderNum = order?.order_number || orderNumberParam || "SE-ORD";
  const customerName = order?.customer_name || "Valued Client";
  const customerPhone = order?.customer_phone || "";
  const totalAmount = order?.total ? formatPrice(order.total) : "Verified";
  const shippingAddress = order?.shipping_address || {};
  const items = order?.order_items || [];

  const whatsappText = encodeURIComponent(
    `Hello Sivansh Enterprise, I have completed payment for Order #${displayOrderNum} (Total: ${totalAmount}). Please share the courier dispatch schedule.`
  );

  return (
    <div className="checkout-success-page container section-pad">
      <div className="max-w-2xl mx-auto bg-surface border border-gold/30 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-gradient" />

        {/* Success Icon & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4">
            ✓
          </div>
          <span className="eyebrow text-gold">Razorpay Payment Verified</span>
          <h1 className="serif-heading text-3xl mt-1 mb-2">Order Confirmed & Booked</h1>
          <p className="text-secondary text-sm">
            Thank you, <strong className="text-white">{customerName}</strong>. Your payment was successfully processed and your equipment order has been registered for Keshod engineering dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-carbon-900/60 border border-gold/20 rounded-lg p-6 mb-6 space-y-4 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-gold/10">
            <span className="text-muted">Order Reference:</span>
            <span className="font-mono text-gold font-bold text-base">#{displayOrderNum}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gold/10">
            <span className="text-muted">Payment Gateway:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>●</span> Razorpay Confirmed (Paid)
            </span>
          </div>

          <div className="flex justify-between items-start pb-3 border-b border-gold/10">
            <span className="text-muted">Logistics Dispatch:</span>
            <div className="text-right">
              <span className="font-bold text-white block">NimbusPost Multi-Carrier Hub</span>
              <span className="text-xs text-secondary">
                {order?.notes?.includes("Blue Dart") 
                  ? "Blue Dart Express Air" 
                  : order?.notes?.includes("DTDC") 
                  ? "DTDC Premium" 
                  : "Delhivery Surface Delivery"}
              </span>
            </div>
          </div>

          {shippingAddress.pincode && (
            <div className="flex justify-between items-start pb-3 border-b border-gold/10">
              <span className="text-muted">Shipping Destination:</span>
              <div className="text-right text-secondary text-xs max-w-xs">
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-1 font-bold text-base">
            <span className="text-white">Amount Paid:</span>
            <span className="text-gold">{totalAmount}</span>
          </div>
        </div>

        {/* Items Summary (if loaded) */}
        {items.length > 0 && (
          <div className="mb-6 border border-gold/15 rounded-lg p-4 bg-carbon-900/30">
            <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-3">
              Hardware Reserved ({items.length} item{items.length > 1 ? "s" : ""})
            </h3>
            <div className="space-y-2 text-xs">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-secondary">
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  <span className="font-mono">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps Notification */}
        <div className="p-4 bg-gold/5 border border-gold/20 rounded-lg text-xs leading-relaxed text-secondary mb-8">
          <strong className="text-gold block mb-1">What Happens Next?</strong>
          Our technical fulfillment team in Keshod will perform final sensor/lens calibration and quality checks. You will receive an SMS and WhatsApp notification with your live <strong>NimbusPost AWB tracking link</strong> the moment the parcel is dispatched.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/917533838538?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold flex-1 text-center"
          >
            Direct WhatsApp Support Desk
          </a>

          <Link href="/shop" className="btn btn-gold-outline flex-1 text-center">
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-gold-outline sm:w-auto px-4"
            title="Print this order confirmation"
          >
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container section-pad text-center text-gold">Loading Order Confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
