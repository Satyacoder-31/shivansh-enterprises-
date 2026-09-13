"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { Menu, ExternalLink } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Do not show admin shell on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-carbon-900 text-white flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-carbon-800 border-b border-gold/15 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden text-secondary hover:text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div className="text-xs uppercase tracking-widest text-muted">
              Sivansh Enterprise • Administrative Portal
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gold/90 hover:text-gold px-3 py-1.5 rounded border border-gold/30 hover:bg-gold/10 transition-colors"
            >
              <ExternalLink size={12} />
              <span>Live Website</span>
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
