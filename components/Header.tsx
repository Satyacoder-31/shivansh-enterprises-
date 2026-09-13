"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import type { SiteSettings } from "@/types/database";

interface HeaderProps {
  settings?: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { totalCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Phone and whatsapp
  const phone = settings?.phone || "+91 7533838538";
  const whatsappNumber = (settings?.whatsapp || "+91 7533838538").replace(/[^0-9]/g, "");
  const announcement = settings?.announcement_text || "CCTV SECURITY • ARCHITECTURAL LED LIGHTING • ROOFTOP SOLAR ENERGY • KESHOD, GUJARAT";

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme detection
  useEffect(() => {
    const saved = localStorage.getItem("sivansh_theme");
    if (saved === "light") {
      setIsLightMode(true);
      document.body.classList.add("theme-light");
    } else {
      setIsLightMode(false);
      document.body.classList.remove("theme-light");
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.body.classList.remove("theme-light");
      localStorage.setItem("sivansh_theme", "dark");
      setIsLightMode(false);
    } else {
      document.body.classList.add("theme-light");
      localStorage.setItem("sivansh_theme", "light");
      setIsLightMode(true);
    }
  };

  // Close mobile menu on route change & handle body scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-locked");
    } else {
      document.body.classList.remove("mobile-menu-locked");
    }
    return () => {
      document.body.classList.remove("mobile-menu-locked");
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "CCTV", href: "/cctv" },
    { label: "LED", href: "/led" },
    { label: "Solar", href: "/solar" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`} id="site-header">
        <div className="container container-wide header-container">
          <Link href="/" className="brand-logo" aria-label="Sivansh Enterprise Home">
            {/* Transparent Header Emblem (Gold Diamond with White E for dark hero media) */}
            <img 
              src="/assets/images/logo-emblem-dark.png" 
              alt={settings?.business_name || "Sivansh Enterprise"} 
              className="brand-emblem-img emblem-transparent" 
            />
            {/* Scrolled White Header Emblem (Gold Diamond with Black E for white header) */}
            <img 
              src="/assets/images/logo-emblem-light.png" 
              alt={settings?.business_name || "Sivansh Enterprise"} 
              className="brand-emblem-img emblem-scrolled-white" 
            />
            <div className="brand-text-block">
              <span className="brand-name-main">SIVANSH</span>
              <span className="brand-name-sub">ENTERPRISE</span>
            </div>
          </Link>

          {/* Navigation & Mobile Drawer */}
          <nav>
            <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`} id="nav-menu">
              <li className="mobile-menu-header">
                <span className="mobile-menu-title">Navigation</span>
                <button 
                  type="button" 
                  className="mobile-menu-close-btn" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Navigation"
                >
                  ✕
                </button>
              </li>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className={`nav-link ${isActive ? "active" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Header Action Icons */}
          <div className="header-actions">
            {/* Theme Switcher */}
            <button 
              type="button" 
              className="header-icon-btn theme-toggle-btn" 
              onClick={toggleTheme}
              aria-label={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Luxury Light Mode"}
            >
              {isLightMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button 
              type="button" 
              className="header-icon-btn" 
              onClick={() => setIsCartOpen(true)} 
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalCount > 0 && (
                <span className="cart-badge" id="cart-badge-count">{totalCount}</span>
              )}
            </button>

            {/* Direct WhatsApp Chat */}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hello%20Sivansh%20Enterprise,%20I%20would%20like%20to%20inquire%20about%20your%20services.`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="header-icon-btn" 
              style={{ color: "#25D366" }}
              aria-label="Chat on WhatsApp" 
              title="Chat on WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              type="button" 
              className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Backdrop Overlay */}
        {mobileMenuOpen && (
          <div 
            className="mobile-nav-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true" 
          />
        )}
      </header>
  );
}
