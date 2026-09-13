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

      {/* Prominent Website Pages to Edit Directory */}
      <div className="bg-carbon-800 border border-gold/25 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-mono text-gold font-bold">
              Visual Page Selector
            </div>
            <h2 className="font-serif text-xl lg:text-2xl font-bold text-white tracking-wide mt-0.5">
              WEBSITE PAGES <span className="text-gold">TO EDIT</span>
            </h2>
            <p className="text-xs text-secondary mt-1">
              Click any page below to customize its text headlines, descriptions, photos, videos, and section visibility.
            </p>
          </div>
          <Link
            href="/admin/content"
            className="btn btn-gold-outline text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>All Pages Directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Homepage",
              route: "/",
              href: "/admin/content/homepage",
              badge: "7 Continuous Sections",
              desc: "Hero Carousel, About Preview, Core Services, Flagship Hardware, Sivansh Advantage, Testimonials, CTA Form.",
              color: "text-gold",
              bg: "bg-gold/10",
              border: "border-gold/30"
            },
            {
              title: "CCTV Surveillance",
              route: "/cctv",
              href: "/admin/content/cctv",
              badge: "Perimeter Security",
              desc: "Hero banner (photo/video), 3 architectural capability standards, and verified CCTV camera catalog.",
              color: "text-blue-400",
              bg: "bg-blue-400/10",
              border: "border-blue-400/25"
            },
            {
              title: "Architectural LED",
              route: "/led",
              href: "/admin/content/led",
              badge: "Optical Lighting",
              desc: "Hero banner, 3 optical capability standards (CRI 95+, honeycomb anti-glare), and luminaire catalog.",
              color: "text-amber-400",
              bg: "bg-amber-400/10",
              border: "border-amber-400/25"
            },
            {
              title: "Rooftop Solar",
              route: "/solar",
              href: "/admin/content/solar",
              badge: "Clean Energy",
              desc: "Hero banner, 3 rooftop generation advantages, net-metering liaisoning narrative, and solar modules.",
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              border: "border-emerald-400/25"
            },
            {
              title: "About & Heritage",
              route: "/about",
              href: "/admin/content/about",
              badge: "Corporate Story",
              desc: "Hero banner, Foundation story narrative & video, and 3 guiding pillars (Mission, Vision, Values).",
              color: "text-purple-400",
              bg: "bg-purple-400/10",
              border: "border-purple-400/25"
            },
            {
              title: "Engineering Services",
              route: "/services",
              href: "/admin/services",
              badge: "AMC & Divisions",
              desc: "Header banner, 3 specialized engineering disciplines, technical features, and survey consultation CTA.",
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
              border: "border-cyan-400/25"
            },
            {
              title: "Project Gallery",
              route: "/gallery",
              href: "/admin/gallery",
              badge: "Photos & Video",
              desc: "Header banner, project photos and video installations with in-modal playback and technical details.",
              color: "text-rose-400",
              bg: "bg-rose-400/10",
              border: "border-rose-400/25"
            },
            {
              title: "Contact & Headquarters",
              route: "/contact",
              href: "/admin/content/contact",
              badge: "Inquiry & Map",
              desc: "Header banner, regional coverage, consultation form titles, operational hours, and editable Google Map URL.",
              color: "text-emerald-300",
              bg: "bg-emerald-300/10",
              border: "border-emerald-300/25"
            },
            {
              title: "Page Banners Manager",
              route: "Services/Gallery/Shop",
              href: "/admin/content/banners",
              badge: "Header Banners",
              desc: "Centralized editor for page header banners, subtitles, headlines, and descriptions across subpages.",
              color: "text-gold-light",
              bg: "bg-gold/10",
              border: "border-gold/25"
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`p-4 rounded-xl bg-carbon-900 border ${item.border} hover:border-gold/60 transition-all group flex flex-col justify-between hover:bg-black/60`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase font-mono ${item.color}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-muted font-mono">
                    {item.route}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-secondary text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-gold/10 flex items-center justify-between text-xs text-gold font-medium">
                <span>Edit Page Content</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
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
