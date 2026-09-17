"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";
import type { ShiprocketCourierOption } from "@/lib/shiprocket";

export default function CheckoutPage() {
  const router = useRouter();
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
    notes: "",
  });

  // Shiprocket Courier State
  const [couriers, setCouriers] = useState<ShiprocketCourierOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<ShiprocketCourierOption | null>(null);
  const [loadingCouriers, setLoadingCouriers] = useState(false);
  const [courierError, setCourierError] = useState("");

  // Payment Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showSimModal, setShowSimModal] = useState<any>(null);

  // Financial Breakdown
  const tax = Math.round(subtotal * 0.18);
  const shippingFee = selectedCourier ? selectedCourier.total_charge : 0;
  const finalTotal = subtotal + tax + shippingFee;

  // Total package weight calculated from individual product weight_kg (defaulting to 1.0kg if unset)
  const totalWeightKg = Math.max(
    0.5,
    Math.round(
      cart.reduce((acc, item) => {
        const itemWeight = Number(item.product.weight_kg) > 0 ? Number(item.product.weight_kg) : 1.0;
        return acc + itemWeight * item.quantity;
      }, 0) * 100
    ) / 100
  );

  // Auto-fetch Shiprocket couriers when pincode reaches 6 digits
  useEffect(() => {
    const cleanPin = formData.pincode.replace(/\D/g, "");
    if (cleanPin.length === 6) {
      fetchCouriers(cleanPin);
    } else {
      setCouriers([]);
      setSelectedCourier(null);
      setCourierError("");
    }
  }, [formData.pincode, totalWeightKg]);

  const fetchCouriers = async (pincode: string) => {
    setLoadingCouriers(true);
    setCourierError("");
    try {
      const res = await fetch("/api/shipping/shiprocket/serviceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_pincode: pincode,
          weight_kg: totalWeightKg,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.couriers || data.couriers.length === 0) {
        throw new Error(data.message || "No delivery partners serviceable for this pincode.");
      }

      setCouriers(data.couriers);
      // Auto-select the first (or best value) courier partner
      setSelectedCourier(data.couriers[0]);
    } catch (err: any) {
      setCourierError(err.message || "Failed to query Shiprocket delivery options.");
      setCouriers([]);
      setSelectedCourier(null);
    } finally {
      setLoadingCouriers(false);
    }
  };

  // Resilient loader for official Razorpay Checkout SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        setTimeout(() => resolve(Boolean((window as any).Razorpay)), 600);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setPaymentError("Please complete all required shipping address fields.");
      return;
    }

    if (!selectedCourier) {
      setPaymentError("Please select a delivery partner before proceeding to payment.");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      // 1. Create Razorpay order on server (Live or Sandbox based on Admin configuration)
      const createRes = await fetch("/api/checkout/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: formData,
          courier: selectedCourier,
          notes: formData.notes,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Could not initialize checkout payment.");
      }

      const { razorpay_order, order_id, order_number } = orderData;

      // 2. Real Razorpay Gateway Mode (Live or official Razorpay Test Mode)
      if (!razorpay_order.is_mock) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !(window as any).Razorpay) {
          throw new Error("Unable to load Razorpay payment window. Please check your internet connection or disable ad blockers.");
        }

        const options = {
          key: razorpay_order.key_id,
          amount: razorpay_order.amount,
          currency: razorpay_order.currency,
          name: "Sivansh Enterprise",
          description: `Order #${order_number} - Authentic Engineering Hardware`,
          image: "/assets/images/logo-emblem-dark.png",
          order_id: razorpay_order.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#D4A63A",
          },
          handler: async function (response: any) {
            // 3. Verify Payment Signature & Confirm Order
            await completePaymentVerification({
              order_id,
              order_number,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setPaymentError(response.error?.description || "Payment was declined by your bank or UPI app.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // 3. Interactive Sandbox Simulator Mode (When Admin selects Test Mode without test keys)
        setShowSimModal({
          order_id,
          order_number,
          amount: finalTotal,
          razorpay_order_id: razorpay_order.id,
        });
        setIsProcessing(false);
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to process payment. Please try again or reach out on WhatsApp.");
      setIsProcessing(false);
    }
  };

  const completePaymentVerification = async (payload: {
    order_id: string;
    order_number: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setIsProcessing(true);
    try {
      const verifyRes = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || "Payment verification failed.");
      }

      // Success: Clear cart and redirect to order success page
      clearCart();
      router.push(`/checkout/success?order_id=${payload.order_id}&order_number=${payload.order_number}`);
    } catch (err: any) {
      setPaymentError(err.message || "Payment verified with bank, but could not update order record. Contact support.");
      setIsProcessing(false);
    }
  };

  const handleConfirmSimulatedPayment = async () => {
    if (!showSimModal) return;
    const simPaymentId = `pay_sim_${Date.now()}`;
    const simSignature = `sig_sim_${Date.now()}`;

    await completePaymentVerification({
      order_id: showSimModal.order_id,
      order_number: showSimModal.order_number,
      razorpay_order_id: showSimModal.razorpay_order_id,
      razorpay_payment_id: simPaymentId,
      razorpay_signature: simSignature,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty-container container section-pad text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 text-gold text-2xl flex items-center justify-center mx-auto mb-4">
          🛒
        </div>
        <h1 className="serif-heading text-3xl mb-3">Your Cart is Empty</h1>
        <p className="text-secondary mb-6 leading-relaxed">
          Select certified CCTV surveillance cameras, architectural LED lighting, or solar power components to proceed to checkout.
        </p>
        <Link href="/shop" className="btn btn-gold">
          Explore Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container section-pad">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <div className="eyebrow text-gold mb-1">Encrypted 256-Bit SSL Checkout</div>
          <h1 className="serif-heading text-3xl md:text-4xl">
            CONFIRM ORDER & <span className="text-gold-gradient">PAYMENT.</span>
          </h1>
        </div>

        {paymentError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm flex items-start gap-3">
            <span className="text-lg">⚠</span>
            <div>
              <strong>Payment Notice:</strong> {paymentError}
            </div>
          </div>
        )}

        <form onSubmit={handleProceedToPayment}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Details & Courier Selection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact & Shipping Address */}
              <div className="p-6 md:p-8 bg-surface rounded-xl border border-gold/20 shadow-md space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center border border-gold/40">
                    1
                  </span>
                  <h2 className="serif-heading text-xl">Shipping & Delivery Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajeshbhai Patel"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Email Address (For Invoice)</label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@patelenterprise.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Villa / Farm Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Patel Agro Farms / Shivalik Heights"
                      className="form-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Complete Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Plot/Survey No., Street Name, Near Landmark..."
                    className="form-input form-textarea"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Delivery Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 362001"
                      className="form-input font-mono font-bold"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Junagadh"
                      className="form-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Gujarat"
                      className="form-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shiprocket Multi-Carrier Delivery Selection */}
              <div className="p-6 md:p-8 bg-surface rounded-xl border border-gold/20 shadow-md space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center border border-gold/40">
                      2
                    </span>
                    <h2 className="serif-heading text-xl">Select Delivery Partner</h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-mono">
                    Shiprocket Logistics
                  </span>
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  Consignments are dispatched from our <strong>Keshod Central Hub (362220)</strong>. Enter your 6-digit pincode above to check available carriers.
                </p>

                {loadingCouriers && (
                  <div className="p-6 text-center border border-gold/20 rounded-lg bg-carbon-900/40">
                    <div className="inline-block animate-spin text-gold text-2xl mb-2">⟳</div>
                    <p className="text-xs text-secondary">
                      Connecting to Shiprocket network... Calculating live carrier rates for pincode {formData.pincode}...
                    </p>
                  </div>
                )}

                {courierError && !loadingCouriers && (
                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded text-amber-200 text-xs">
                    {courierError}
                  </div>
                )}

                {!loadingCouriers && couriers.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {couriers.map((courier) => {
                      const isSelected = selectedCourier?.courier_id === courier.courier_id;
                      return (
                        <div
                          key={courier.courier_id}
                          onClick={() => setSelectedCourier(courier)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-gold/10 border-gold shadow-md"
                              : "bg-carbon-900/40 border-gold/20 hover:border-gold/50"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <input
                              type="radio"
                              name="courier_partner"
                              checked={isSelected}
                              onChange={() => setSelectedCourier(courier)}
                              className="accent-gold w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{courier.courier_name}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-carbon-800 text-gold border border-gold/20">
                                  {courier.courier_type === "air" ? "✈ Express Air" : "🚚 Surface Transit"}
                                </span>
                              </div>
                              <span className="text-xs text-muted block mt-0.5">
                                Est. Delivery: <strong className="text-secondary">{courier.estimated_delivery_days}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-gold block">
                              {courier.total_charge === 0 ? "FREE" : formatPrice(courier.total_charge)}
                            </span>
                            <span className="text-[10px] text-muted">Doorstep Delivery</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!loadingCouriers && couriers.length === 0 && !courierError && (
                  <div className="p-6 text-center border border-gold/15 rounded-lg text-xs text-muted">
                    Enter a valid 6-digit delivery pincode above to view available Blue Dart, Delhivery & DTDC options.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Razorpay Trigger */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 md:p-8 bg-surface rounded-xl border border-gold/30 shadow-lg sticky top-28">
                <h3 className="serif-heading text-xl mb-4 pb-3 border-b border-gold/20 flex justify-between items-center">
                  <span>Order Summary</span>
                  <span className="text-xs text-gold font-mono font-normal">
                    {cart.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 text-xs items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded border border-gold/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[170px]">{product.name}</p>
                          <p className="text-[10px] text-muted">
                            Qty: {quantity} • {Number(product.weight_kg) > 0 ? product.weight_kg : 1.0} kg each
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-secondary shrink-0">
                        {formatPrice((product.price_value || 0) * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-gold/15 text-sm">
                  <div className="flex justify-between text-secondary">
                    <span>Hardware Subtotal:</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-secondary text-xs">
                    <span>Shipment Weight:</span>
                    <span className="font-mono text-neutral-300 font-medium">{totalWeightKg.toFixed(2)} kg</span>
                  </div>

                  <div className="flex justify-between text-secondary">
                    <span>Estimated GST (18%):</span>
                    <span className="font-mono">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between items-center text-secondary">
                    <span>Delivery via Shiprocket:</span>
                    <span className="font-mono font-medium text-gold">
                      {selectedCourier ? formatPrice(selectedCourier.total_charge) : "Select Courier"}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold pt-3 border-t border-gold/30 text-white">
                    <span>Total Amount:</span>
                    <span className="text-gold font-mono text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Razorpay Action Button */}
                <div className="mt-8 space-y-3">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-gold w-full text-center font-bold py-3.5 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <span className="inline-block animate-spin">⟳</span>
                        <span>Connecting to Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {formatPrice(finalTotal)} via Razorpay</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-muted">
                      🔒 Secure Checkout powered by <strong>Razorpay India</strong>
                    </p>
                    <p className="text-[10px] text-secondary/70 mt-1">
                      Supports UPI (GPay, PhonePe, Paytm), Debit/Credit Cards & NetBanking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Simulation Modal for Instant End-to-End Testing while Keys are Empty */}
        {showSimModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-carbon-800 border border-gold/40 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gold/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-serif text-sm font-bold">
                    R
                  </div>
                  <h3 className="serif-heading text-lg">Razorpay Checkout Simulation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSimModal(null)}
                  className="text-muted hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg text-xs leading-relaxed text-secondary">
                <strong className="text-gold block mb-1">Sandbox Testing Environment</strong>
                Test mode is currently selected in store administration. This sandbox simulator allows you to experience the complete payment success, automated database record, and Shiprocket courier booking flow without charging real cards or UPI. Switch to &quot;Live Production&quot; in Admin Settings for real transactions.
              </div>

              <div className="bg-carbon-900 p-4 rounded border border-gold/15 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Order ID:</span>
                  <span className="font-mono text-white">#{showSimModal.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payable Amount:</span>
                  <span className="font-mono text-gold font-bold">{formatPrice(showSimModal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Selected Courier:</span>
                  <span className="text-white">{selectedCourier?.courier_name}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmSimulatedPayment}
                  disabled={isProcessing}
                  className="btn btn-gold flex-1 text-center text-xs font-bold py-2.5"
                >
                  {isProcessing ? "Verifying..." : "Simulate Successful Payment"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSimModal(null)}
                  className="btn btn-gold-outline text-xs py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
