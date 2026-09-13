"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/database";
import { updateOrderStatus } from "@/lib/actions/admin";
import { 
  ShoppingBag, 
  Search, 
  Download, 
  Phone, 
  MapPin, 
  Printer, 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  XCircle,
  CreditCard
} from "lucide-react";

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleNimbusDispatch = async (orderId: string) => {
    setIsDispatching(true);
    try {
      const res = await fetch("/api/admin/orders/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to book shipment on NimbusPost.");
      }
      alert(`Consignment Approved! NimbusPost AWB Generated: ${data.shipment.awb_number}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: "shipped" as any, notes: data.order.notes } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: "shipped" as any, notes: data.order.notes });
      }
      router.refresh();
    } catch (err: any) {
      alert("NimbusPost Dispatch Error: " + err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const statuses = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "paid", label: "Paid" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filtered = orders.filter(ord => {
    const matchesStatus = selectedStatus === "all" || ord.order_status === selectedStatus;
    const matchesSearch = 
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_phone.includes(searchQuery) ||
      (ord.customer_email && ord.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, order_status: newStatus as any } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus as any } : null);
      }
      router.refresh();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const exportCSV = () => {
    const headers = ["Order Number", "Date", "Customer Name", "Phone", "Email", "Items Count", "Subtotal", "Tax", "Total", "Payment Status", "Order Status"];
    const rows = filtered.map(o => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString(),
      `"${o.customer_name.replace(/"/g, '""')}"`,
      `"${o.customer_phone}"`,
      `"${o.customer_email || ""}"`,
      o.order_items?.length || 0,
      o.subtotal,
      o.tax,
      o.total,
      o.payment_status,
      o.order_status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sivansh_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PAID</span>;
      case "processing":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">PROCESSING</span>;
      case "shipped":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">SHIPPED</span>;
      case "delivered":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-green-500/20 text-green-300 border border-green-500/30">DELIVERED</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-red-500/20 text-red-300 border border-red-500/30">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">PENDING</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Order Management</h1>
          <p className="text-neutral-400 text-sm mt-1">Track store purchases, payment records, and dispatch statuses</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-mono border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {statuses.map(st => {
            const count = st.id === "all" ? orders.length : orders.filter(o => o.order_status === st.id).length;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-[#c5a059] text-black font-semibold"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/50 text-neutral-400 uppercase font-mono tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(order => (
                <tr 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-semibold text-[#c5a059]">
                    {order.order_number}
                  </td>
                  <td className="py-4 px-4 font-medium text-white">
                    <div>{order.customer_name}</div>
                    <div className="text-neutral-400 font-mono text-[11px] mt-0.5">{order.customer_phone}</div>
                  </td>
                  <td className="py-4 px-4 text-neutral-300">
                    {order.order_items?.length || 0} item(s)
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-white">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider ${
                      order.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-mono">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                    <select
                      value={order.order_status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 rounded text-xs cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-neutral-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#c5a059]" />
                    <p className="font-serif text-white text-base">No orders found</p>
                    <p className="text-xs mt-1">Customer checkouts and purchases will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#c5a059]">Order Invoice</span>
                <h2 className="text-xl font-serif text-white">{selectedOrder.order_number}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded border border-white/5 text-xs">
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px] mb-1">Customer Info</span>
                <p className="text-white font-medium text-sm">{selectedOrder.customer_name}</p>
                <p className="text-neutral-300 font-mono mt-0.5">{selectedOrder.customer_phone}</p>
                {selectedOrder.customer_email && (
                  <p className="text-neutral-400 mt-0.5">{selectedOrder.customer_email}</p>
                )}
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px] mb-1">Shipping Address</span>
                <div className="text-neutral-300 space-y-0.5">
                  <p>{selectedOrder.shipping_address?.street || selectedOrder.shipping_address?.address || "Address on file"}</p>
                  <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.postal_code || selectedOrder.shipping_address?.pincode}</p>
                </div>
              </div>
            </div>

            {/* Items Breakdown */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">Purchased Items</h3>
              <div className="bg-black/50 rounded border border-white/10 divide-y divide-white/5">
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-white font-medium">{item.product_name}</p>
                      {item.sku && <p className="text-neutral-500 font-mono text-[10px]">SKU: {item.sku}</p>}
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-white">₹{Number(item.unit_price).toLocaleString("en-IN")} × {item.quantity}</p>
                      <p className="text-[#c5a059] font-semibold">₹{Number(item.total).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}

                {(!selectedOrder.order_items || selectedOrder.order_items.length === 0) && (
                  <div className="p-4 text-center text-neutral-500 text-xs">
                    No line items recorded for this order.
                  </div>
                )}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="bg-white/[0.02] p-4 rounded border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal).toLocaleString("en-IN")}</span>
              </div>
              {Number(selectedOrder.discount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{Number(selectedOrder.discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {Number(selectedOrder.tax) > 0 && (
                <div className="flex justify-between text-neutral-400">
                  <span>GST / Taxes</span>
                  <span>+₹{Number(selectedOrder.tax).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#c5a059]">₹{Number(selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* NimbusPost Logistics Fulfillment Block */}
            <div className="bg-[#181818] p-4 rounded-lg border border-[#c5a059]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    NimbusPost Logistics Fulfillment
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/20">
                  Origin: Keshod Hub (362220)
                </span>
              </div>

              <div className="text-xs text-neutral-300">
                {selectedOrder.notes || "Standard multi-carrier surface consignment"}
              </div>

              {selectedOrder.order_status === "shipped" || selectedOrder.notes?.includes("AWB:") ? (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Consignment Booked & AWB Active
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`/api/admin/orders/label-preview?order=${selectedOrder.order_number}&awb=${
                        selectedOrder.notes?.match(/AWB:\s*([^\s|)]+)/)?.[1] || "DEL-9812457812"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#c5a059] text-black font-bold rounded text-xs hover:bg-[#d4af66] flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" /> Print Label (PDF)
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <p className="text-[11px] text-neutral-400">
                    Verify hardware in Keshod warehouse, then click to generate courier AWB.
                  </p>
                  <button
                    type="button"
                    disabled={isDispatching}
                    onClick={() => handleNimbusDispatch(selectedOrder.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#c5a059] to-[#b38e47] hover:from-[#d4af66] hover:to-[#c5a059] text-black font-bold rounded text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{isDispatching ? "Booking NimbusPost..." : "Approve & Ship with NimbusPost"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Status Selector & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Update Status:</span>
                <select
                  value={selectedOrder.order_status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="bg-[#1c1c1c] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn-luxury px-5 py-1.5 text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
