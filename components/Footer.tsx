import React from "react";
import Link from "next/link";
import type { SiteSettings } from "@/types/database";

interface FooterProps {
  settings?: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.phone || "+91 7533838538";
  const whatsapp = settings?.whatsapp || "+91 7533838538";
  const email = settings?.email || "info@sivanshenterprise.com";
  const address = settings?.address || "Station Road, Near Bus Stand, Keshod, Gujarat 362220";
  const hours = settings?.business_hours || "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: Closed";
  const businessName = settings?.business_name || "Sivansh Enterprise";

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container container-wide footer-container">
        {/* Col 1: Brand & Philosophy */}
        <div className="footer-col footer-brand-col">
          <Link href="/" className="brand-logo" aria-label="Sivansh Enterprise">
            <img 
              src={settings?.logo_light_url || "/assets/images/logo-official-transparent.png"} 
              alt={businessName} 
              className="brand-emblem-img emblem-light" 
            />
            <div className="brand-text-block">
              <span className="brand-name-main">SIVANSH</span>
              <span className="brand-name-sub">ENTERPRISE</span>
            </div>
          </Link>
          <p className="footer-desc">
            Saurashtra’s leading destination for enterprise-grade CCTV surveillance architecture, 
            high-CRI architectural LED illumination, and turnkey rooftop solar power engineering.
          </p>
          <div className="footer-gst-badge">
            <span>GSTIN: {settings?.gst_number || "24AAECS1234F1Z5"}</span>
          </div>
        </div>

        {/* Col 2: Solutions */}
        <div className="footer-col">
          <h4 className="footer-heading">Solutions</h4>
          <ul className="footer-links">
            <li><Link href="/cctv">4G Solar & IP CCTV</Link></li>
            <li><Link href="/led">Architectural LED Lighting</Link></li>
            <li><Link href="/solar">Rooftop Solar Systems</Link></li>
            <li><Link href="/services">AMC & Maintenance</Link></li>
            <li><Link href="/shop">Authentic Catalog</Link></li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><Link href="/about">About Sivansh</Link></li>
            <li><Link href="/services">Engineering Services</Link></li>
            <li><Link href="/gallery">Project Gallery</Link></li>
            <li><Link href="/contact">Consultation & Contact</Link></li>
            <li><Link href="/admin/login">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Operations */}
        <div className="footer-col footer-contact-col">
          <h4 className="footer-heading">Keshod Headquarters</h4>
          <p className="footer-address">
            <strong>Sivansh Enterprise</strong><br />
            {address}
          </p>
          <p className="footer-contact-item">
            <strong>Direct Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
          </p>
          <p className="footer-contact-item">
            <strong>WhatsApp:</strong> <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">{whatsapp}</a>
          </p>
          <p className="footer-contact-item">
            <strong>Inquiries:</strong> <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p className="footer-hours">
            <strong>Hours:</strong> {hours}
          </p>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="footer-bottom">
        <div className="container container-wide footer-bottom-inner">
          <p className="copyright-text">
            © {currentYear} {businessName}. All Rights Reserved. Engineered with pride in Keshod, Gujarat.
          </p>
          <div className="footer-bottom-links">
            <Link href="/about">Privacy</Link>
            <span className="dot">•</span>
            <Link href="/about">Terms</Link>
            <span className="dot">•</span>
            <Link href="/admin/login">Management</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
