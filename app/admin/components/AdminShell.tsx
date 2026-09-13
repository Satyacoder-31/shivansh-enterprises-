"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { Menu, ExternalLink } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageMenuOpen, setPageMenuOpen] = useState(false);

  const pageMap: Record<string, { title: string; publicUrl: string }> = {
    "/admin/content/homepage": { title: "1. Homepage", publicUrl: "/" },
    "/admin/content/cctv": { title: "2. CCTV Surveillance", publicUrl: "/cctv" },
    "/admin/content/led": { title: "3. Architectural LED", publicUrl: "/led" },
    "/admin/content/solar": { title: "4. Rooftop Solar", publicUrl: "/solar" },
    "/admin/content/about": { title: "5. About Heritage", publicUrl: "/about" },
    "/admin/services": { title: "6. Engineering Services", publicUrl: "/services" },
    "/admin/gallery": { title: "7. Project Gallery", publicUrl: "/gallery" },
    "/admin/content/contact": { title: "8. Contact & Map", publicUrl: "/contact" },
    "/admin/content/banners": { title: "9. Page Banners", publicUrl: "/shop" },
    "/admin/content": { title: "Pages Directory", publicUrl: "/" },
    "/admin/products": { title: "Hardware Catalog", publicUrl: "/shop" },
    "/admin": { title: "Executive Dashboard", publicUrl: "/" },
  };

  const currentPage = pathname ? pageMap[pathname] || { title: "Admin Portal", publicUrl: "/" } : null;

  // Do not show admin shell on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-carbon-900 text-white flex admin-shell">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-carbon-800 border-b border-gold/15 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-secondary hover:text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>
            
            {/* Active Editing Page Indicator & Quick Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPageMenuOpen(!pageMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-carbon-900 border border-gold/25 hover:border-gold/60 text-xs text-white transition-all cursor-pointer"
              >
                <span className="text-[10px] uppercase font-mono text-gold font-bold">
                  Editing Page:
                </span>
                <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                  {currentPage?.title || "Dashboard"}
                </span>
                <span className="text-[10px] text-gold">▾</span>
              </button>

              {/* Quick Switch Dropdown */}
              {pageMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-carbon-800 border border-gold/40 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in"
                  onClick={() => setPageMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-muted border-b border-gold/10">
                    Switch Page To Edit
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gold/5">
                    {[
                      { label: "1. Homepage", href: "/admin/content/homepage", route: "/" },
                      { label: "2. CCTV Surveillance", href: "/admin/content/cctv", route: "/cctv" },
                      { label: "3. Architectural LED", href: "/admin/content/led", route: "/led" },
                      { label: "4. Rooftop Solar", href: "/admin/content/solar", route: "/solar" },
                      { label: "5. About Heritage", href: "/admin/content/about", route: "/about" },
                      { label: "6. Engineering Services", href: "/admin/services", route: "/services" },
                      { label: "7. Project Gallery", href: "/admin/gallery", route: "/gallery" },
                      { label: "8. Contact & Map", href: "/admin/content/contact", route: "/contact" },
                      { label: "9. Page Banners", href: "/admin/content/banners", route: "/shop" },
                      { label: "📑 All Pages Directory", href: "/admin/content", route: "" },
                    ].map((p, idx) => (
                      <a
                        key={idx}
                        href={p.href}
                        className={`px-3 py-2 text-xs flex items-center justify-between hover:bg-gold/15 transition-colors ${
                          pathname === p.href ? "text-gold font-bold bg-gold/10" : "text-secondary hover:text-white"
                        }`}
                      >
                        <span>{p.label}</span>
                        {p.route && <span className="text-[10px] font-mono text-muted">{p.route}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={currentPage?.publicUrl || "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gold/90 hover:text-gold px-3 py-1.5 rounded border border-gold/30 hover:bg-gold/10 transition-colors"
              title={`View live public page (${currentPage?.publicUrl || "/"})`}
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">View Live Page</span>
              <span className="sm:hidden">Live</span>
            </a>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold">
                SA
              </div>
              <span className="text-xs text-secondary hidden md:inline">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
