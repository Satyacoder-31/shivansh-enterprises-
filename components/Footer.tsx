"use client";

import React from "react";
import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import { 
  ShieldCheck, 
  Sun, 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp, 
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";

interface FooterProps {
  settings?: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.phone || "+91 7533838538";
  const whatsapp = settings?.whatsapp || "+91 7533838538";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");
  const email = settings?.email || "info@sivanshenterprise.com";
  const address = settings?.address || "First Floor, Shop No. 3, Agreed Pan Street, Patel Mail Road, Near BOI Bank, Keshod – 362220, Gujarat, India";
  const hours = settings?.business_hours || "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: Closed";
  const businessName = settings?.business_name || "Sivansh Enterprise";
  const gst = settings?.gst_number || "24AAECS1234F1Z5";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer bg-[#0c0c0c] border-t border-gold/20 text-neutral-300 relative overflow-hidden" id="site-footer">
      {/* Subtle background ambient gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none"></div>

      {/* 1. Trust & Engineering Accreditations Ribbon */}
      <div className="border-b border-gold/15 bg-carbon-900/90 py-6">
        <div className="container container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface/40 border border-gold/15 hover:border-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">BIS-ER & STQC Tested</div>
                <div className="text-[11px] text-muted">Laboratory-verified security hardware</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface/40 border border-gold/15 hover:border-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold shadow-sm">
                <Sun size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Tier-1 TOPCon Solar</div>
                <div className="text-[11px] text-muted">Turnkey DISCOM subsidy & net-metering</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface/40 border border-gold/15 hover:border-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold shadow-sm">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Museum-Grade CRI ≥ 95</div>
                <div className="text-[11px] text-muted">Zero-glare architectural luminescence</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface/40 border border-gold/15 hover:border-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 text-gold shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Keshod HQ Engineering</div>
                <div className="text-[11px] text-muted">Local Saurashtra installation & AMC team</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer 4-Column Grid */}
      <div className="container container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Credo (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Sivansh Enterprise">
              <img 
                src={settings?.logo_light_url || "/assets/images/logo-official-transparent.png"} 
                alt={businessName} 
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-widest text-white">SIVANSH</span>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-gold">ENTERPRISE</span>
              </div>
            </Link>

            <p className="text-secondary text-xs leading-relaxed max-w-sm">
              Saurashtra’s leading engineering authority for industrial-grade IP & 4G solar surveillance architectures, museum-grade architectural luminescence, and turnkey rooftop solar power installations.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-carbon-800 border border-gold/20 text-[11px] font-mono text-gold">
                <CheckCircle2 size={12} />
                <span>GSTIN: {gst}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface/50 border border-white/10 text-[11px] font-mono text-muted">
                <span>Gujarat Reg. Firm</span>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20Sivansh%20Enterprise,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WhatsApp Instant Inquiry</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Col 2: Engineering Disciplines (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-gold border-b border-gold/20 pb-2">
              Engineering Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cctv" className="text-secondary hover:text-gold transition-colors flex items-center justify-between group">
                  <span>4G Solar & IP Surveillance</span>
                  <span className="text-gold/40 group-hover:text-gold transition-colors text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/led" className="text-secondary hover:text-gold transition-colors flex items-center justify-between group">
                  <span>Architectural CRI 95+ LED</span>
                  <span className="text-gold/40 group-hover:text-gold transition-colors text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/solar" className="text-secondary hover:text-gold transition-colors flex items-center justify-between group">
                  <span>Rooftop Solar EPC Plants</span>
                  <span className="text-gold/40 group-hover:text-gold transition-colors text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-secondary hover:text-gold transition-colors flex items-center justify-between group">
                  <span>Turnkey Maintenance & AMC</span>
                  <span className="text-gold/40 group-hover:text-gold transition-colors text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-secondary hover:text-gold transition-colors flex items-center justify-between group">
                  <span>Hardware Catalog & Registry</span>
                  <span className="text-gold/40 group-hover:text-gold transition-colors text-[10px]">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Direct Access (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-gold border-b border-gold/20 pb-2">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="text-secondary hover:text-gold transition-colors">
                  About Sivansh
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-secondary hover:text-gold transition-colors">
                  Engineering Scope
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-secondary hover:text-gold transition-colors">
                  Project Showcase
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary hover:text-gold transition-colors">
                  Request Site Survey
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-secondary hover:text-gold transition-colors">
                  Direct Order Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-muted hover:text-gold transition-colors flex items-center gap-1">
                  <span>Staff Portal</span>
                  <ArrowUpRight size={11} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Headquarters & Live Hotline (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-gold border-b border-gold/20 pb-2">
              Keshod Headquarters
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-secondary">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-gold shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-white hover:text-gold transition-colors">
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-gold shrink-0" />
                <a href={`mailto:${email}`} className="text-secondary hover:text-gold transition-colors">
                  {email}
                </a>
              </div>

              <div className="flex items-start gap-2.5 text-secondary">
                <Clock size={15} className="text-gold shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            </div>

            <div className="pt-1">
              <Link 
                href="/contact"
                className="btn btn-gold-outline btn-sm w-full text-center text-xs flex items-center justify-center gap-2"
              >
                <span>Schedule Consultation</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Bottom Strip */}
      <div className="border-t border-gold/15 bg-black py-5">
        <div className="container container-wide flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {currentYear} <span className="text-white font-medium">{businessName}</span>. All Rights Reserved. Engineered with Pride in Keshod, Gujarat.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-gold transition-colors">Privacy</Link>
            <span className="text-white/20">•</span>
            <Link href="/about" className="hover:text-gold transition-colors">Quality Mandates</Link>
            <span className="text-white/20">•</span>
            <Link href="/contact" className="hover:text-gold transition-colors">Support Desk</Link>
            <span className="text-white/20">•</span>
            <button 
              type="button" 
              onClick={scrollToTop} 
              className="inline-flex items-center gap-1.5 text-gold hover:text-white transition-colors cursor-pointer bg-gold/10 hover:bg-gold/20 px-2.5 py-1 rounded border border-gold/20 text-[11px]"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
