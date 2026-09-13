import React from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/admin";
import { 
  Package, 
  Wrench, 
  Image as ImageIcon, 
  MessageSquare, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Total Hardware Catalog",
      value: stats.totalProducts,
      sub: `${stats.activeProducts} active in stock`,
      icon: Package,
      href: "/admin/products",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20"
    },
    {
      title: "Inquiries & Quotes",
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} awaiting review`,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Equipment Orders",
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} pending verification`,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      title: "Engineering Services",
      value: stats.totalServices,
      sub: "Active technical divisions",
      icon: Wrench,
      href: "/admin/services",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      title: "Gallery Installations",
      value: stats.galleryImages,
      sub: "Published project media",
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/20"
    },
    {
      title: "Processed Revenue",
      value: formatPrice(stats.totalRevenue),
      sub: "Verified order payments",
      icon: TrendingUp,
      href: "/admin/orders",
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/20"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-wide">
            EXECUTIVE <span className="text-gold">DASHBOARD</span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Real-time telemetry, CMS content management, and order monitoring.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/products/new"
            className="btn btn-gold btn-sm flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/content/homepage"
            className="btn btn-gold-outline btn-sm"
          >
            Manage Hero & Home
          </Link>
          <Link
            href="/admin/enquiries"
            className="btn btn-gold-outline btn-sm"
          >
            Inquiries Inbox
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className={`p-5 rounded-xl bg-carbon-800 border ${c.border} hover:border-gold/50 transition-all group block`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                  {c.title}
                </span>
                <div className={`p-2 rounded-lg ${c.bg} ${c.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-gold transition-colors">
                {c.value}
              </div>
              <div className="text-xs text-secondary flex items-center gap-1">
                <span>{c.sub}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Enquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-carbon-800 border border-gold/15 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold/10">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gold" />
              <h3 className="font-serif font-bold text-base text-white">Recent Customer Inquiries</h3>
            </div>
            <Link href="/admin/enquiries" className="text-xs text-gold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {stats.recentEnquiries.length === 0 ? (
            <p className="text-muted text-xs py-8 text-center">No inquiries received yet.</p>
          ) : (
            <div className="divide-y divide-gold/10">
              {stats.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-white">{enq.name}</div>
                    <div className="text-secondary">{enq.phone} • {enq.product_service || "General"}</div>
                    <p className="text-muted line-clamp-1 mt-0.5">{enq.message}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    enq.status === 'new' ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40' :
                    enq.status === 'converted' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' :
                    'bg-carbon-900 text-muted'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-carbon-800 border border-gold/15 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold/10">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-gold" />
              <h3 className="font-serif font-bold text-base text-white">Recent Equipment Orders</h3>
            </div>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-muted text-xs py-8 text-center">No orders registered yet.</p>
          ) : (
            <div className="divide-y divide-gold/10">
              {stats.recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Order #{ord.order_number}</div>
                    <div className="text-secondary">{ord.customer_name} • {ord.customer_phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-mono font-bold">{formatPrice(ord.total)}</div>
                    <span className="text-[10px] text-muted capitalize">{ord.order_status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
