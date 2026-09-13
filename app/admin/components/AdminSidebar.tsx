"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Image as ImageIcon, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink,
  LogOut,
  Wrench,
  Camera,
  Zap,
  Sun,
  Building2,
  PhoneCall,
  Sliders
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navGroups = [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "Content CMS",
      items: [
        { label: "Homepage CMS", href: "/admin/content/homepage", icon: Layers },
        { label: "CCTV Surveillance", href: "/admin/content/cctv", icon: Camera },
        { label: "Architectural LED", href: "/admin/content/led", icon: Zap },
        { label: "Rooftop Solar", href: "/admin/content/solar", icon: Sun },
        { label: "About Heritage", href: "/admin/content/about", icon: Building2 },
        { label: "Contact & Map", href: "/admin/content/contact", icon: PhoneCall },
        { label: "Page Banners", href: "/admin/content/banners", icon: Sliders },
        { label: "Services & Disciplines", href: "/admin/services", icon: Wrench },
        { label: "Gallery Portfolio", href: "/admin/gallery", icon: ImageIcon },
      ],
    },
    {
      group: "Commerce",
      items: [
        { label: "Products Catalog", href: "/admin/products", icon: Package },
        { label: "Categories", href: "/admin/categories", icon: FolderTree },
        { label: "Orders & Quotes", href: "/admin/orders", icon: ShoppingBag },
        { label: "Customers", href: "/admin/customers", icon: Users },
      ],
    },
    {
      group: "Communications",
      items: [
        { label: "Inquiries Inbox", href: "/admin/enquiries", icon: MessageSquare },
        { label: "Testimonials", href: "/admin/testimonials", icon: Sparkles },
      ],
    },
    {
      group: "Assets & Media",
      items: [
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      group: "System & Settings",
      items: [
        { label: "General Settings", href: "/admin/settings/general", icon: Settings },
        { label: "Payment Gateway", href: "/admin/settings/payments", icon: CreditCard },
        { label: "Admin Users", href: "/admin/settings/users", icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-carbon-800 border-r border-gold/20 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-gold/15 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-sm">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm tracking-wide block">
                SIVANSH <span className="text-gold">CMS</span>
              </span>
              <span className="text-[10px] text-muted tracking-widest uppercase">Admin Suite</span>
            </div>
          </Link>
          <button 
            type="button" 
            className="lg:hidden text-muted hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted/70 px-3 mb-2">
                {grp.group}
              </div>
              <ul className="space-y-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors
                          ${isActive 
                            ? "bg-gold/15 text-gold border border-gold/30 font-semibold" 
                            : "text-secondary hover:bg-surface hover:text-white"}
                        `}
                      >
                        <Icon size={16} className={isActive ? "text-gold" : "text-muted"} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gold/15 space-y-2 bg-carbon-900/50">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 text-xs text-secondary hover:text-gold rounded hover:bg-surface transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              View Public Website
            </span>
            <span className="text-[10px] text-muted">↗</span>
          </a>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
