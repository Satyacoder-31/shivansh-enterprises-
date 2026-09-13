import React from "react";
import Link from "next/link";
import { 
  Home, 
  Camera, 
  Zap, 
  Sun, 
  Building2, 
  Wrench, 
  Image as ImageIcon, 
  PhoneCall, 
  Sliders, 
  ExternalLink,
  ArrowRight,
  Layers,
  Sparkles,
  ShoppingBag
} from "lucide-react";

export const metadata = {
  title: "Website Pages Directory | Admin Panel",
};

export default function ContentDirectoryPage() {
  const pages = [
    {
      title: "Homepage",
      route: "/",
      adminHref: "/admin/content/homepage",
      icon: Home,
      badge: "7 Continuous Sections",
      description: "Hero Carousel Slides, About Preview, Core Disciplines, Flagship Hardware, Sivansh Advantage, Testimonials, and Consultation CTA.",
      sections: ["Hero Slider", "About Preview", "Disciplines Header", "Flagship Products", "Sivansh Advantage", "Testimonials", "Consultation CTA"],
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/25"
    },
    {
      title: "CCTV Surveillance",
      route: "/cctv",
      adminHref: "/admin/content/cctv",
      icon: Camera,
      badge: "Surveillance Division",
      description: "Hero media banner (photo or video), 3 architectural capability standards, headline, narrative, and catalog hardware.",
      sections: ["Hero Media Banner", "3 Capability Standards", "CCTV Product Catalog"],
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/25"
    },
    {
      title: "Architectural LED Lighting",
      route: "/led",
      adminHref: "/admin/content/led",
      icon: Zap,
      badge: "Optical Division",
      description: "Hero media banner, 3 optical capability standards (CRI 95+, honeycomb anti-glare), headline, narrative, and luminaires.",
      sections: ["Hero Media Banner", "3 Optical Standards", "LED Fixtures Catalog"],
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/25"
    },
    {
      title: "Rooftop Solar Energy",
      route: "/solar",
      adminHref: "/admin/content/solar",
      icon: Sun,
      badge: "Solar Division",
      description: "Hero media banner, 3 rooftop generation advantages, net-metering liaisoning narrative, and solar module arrays.",
      sections: ["Hero Media Banner", "3 Solar Advantages", "Solar Arrays Catalog"],
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/25"
    },
    {
      title: "About & Heritage",
      route: "/about",
      adminHref: "/admin/content/about",
      icon: Building2,
      badge: "Corporate Identity",
      description: "Hero banner, Foundation story narrative with media showcase (photo/video), and 3 guiding pillars (Mission, Vision, Values).",
      sections: ["Hero Banner", "Foundation Story & Media", "3 Guiding Pillars"],
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/25"
    },
    {
      title: "Engineering Services",
      route: "/services",
      adminHref: "/admin/services",
      icon: Wrench,
      badge: "Capabilities & AMC",
      description: "Header banner, comprehensive list of technical engineering divisions, specifications, features, and survey consultation CTA.",
      sections: ["Header Banner", "Engineering Divisions", "Consultation CTA"],
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/25"
    },
    {
      title: "Project Gallery & Portfolio",
      route: "/gallery",
      adminHref: "/admin/gallery",
      icon: ImageIcon,
      badge: "Visual Installations",
      description: "Header banner, photographic showcase, and video installations with in-modal playback and technical descriptions.",
      sections: ["Header Banner", "Photos & Video Showcase", "Category Filter"],
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/25"
    },
    {
      title: "Contact & Headquarters",
      route: "/contact",
      adminHref: "/admin/content/contact",
      icon: PhoneCall,
      badge: "Inquiry & Map",
      description: "Header banner, regional coverage brief, consultation form titles, operational hours, and editable Google Map embed URL.",
      sections: ["Header Banner", "Regional Coverage", "Consultation Brief", "Google Map URL"],
      color: "text-emerald-300",
      bg: "bg-emerald-300/10",
      border: "border-emerald-300/25"
    },
    {
      title: "Hardware Catalog / Shop",
      route: "/shop",
      adminHref: "/admin/content/banners",
      icon: ShoppingBag,
      badge: "Catalog Banner",
      description: "Header banner, headline, eyebrow, and introductory description for the official hardware registry and shop.",
      sections: ["Catalog Header Banner", "Verified Hardware Registry"],
      color: "text-gold-light",
      bg: "bg-gold/10",
      border: "border-gold/25"
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold font-mono mb-1">
            Sivansh Enterprise • Content Management
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-wide">
            WEBSITE PAGES <span className="text-gold">DIRECTORY</span>
          </h1>
          <p className="text-secondary text-xs mt-1 max-w-2xl">
            Select any page below to customize its text, images, videos, and section visibility. Changes are reflected live on the public website immediately.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold-outline text-xs flex items-center gap-2 px-4 py-2"
          >
            <ExternalLink size={14} />
            <span>Open Live Website</span>
          </a>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, idx) => {
          const Icon = page.icon;
          return (
            <div
              key={idx}
              className="bg-carbon-800 border border-gold/15 hover:border-gold/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-gold/5 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${page.bg} ${page.border} border flex items-center justify-center ${page.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-black/40 border border-gold/10 text-secondary">
                    {page.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors">
                      {page.title}
                    </h2>
                  </div>
                  <div className="text-[11px] font-mono text-gold/80 mt-0.5">
                    Live Route: {page.route}
                  </div>
                  <p className="text-secondary text-xs mt-2 leading-relaxed">
                    {page.description}
                  </p>
                </div>

                {/* Contained Sections Pills */}
                <div className="pt-2 border-t border-gold/10">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted mb-2">
                    Sections Contained:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {page.sections.map((sec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-black/50 border border-gold/10 text-secondary"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-5 mt-5 border-t border-gold/10 flex items-center justify-between gap-3">
                <a
                  href={page.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-secondary hover:text-gold flex items-center gap-1 transition-colors"
                  title="View live public page"
                >
                  <ExternalLink size={12} />
                  <span>View Live</span>
                </a>

                <Link
                  href={page.adminHref}
                  className="btn btn-gold text-xs px-4 py-2 flex items-center gap-1.5 group-hover:shadow-md transition-all"
                >
                  <span>Edit Page Content</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
