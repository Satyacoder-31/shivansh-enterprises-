import React from "react";
import Link from "next/link";
import { getProducts, getPageSections } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function SolarPage() {
  const [solarProducts, sections] = await Promise.all([
    getProducts({ category: "solar", status: "published" }),
    getPageSections("solar"),
  ]);

  const heroSec = sections.find((s) => s.section_key === "hero_banner");
  const standardsSec = sections.find((s) => s.section_key === "standards");
  const productsSec = sections.find((s) => s.section_key === "products_header");

  // Hero Banner Values
  const heroEyebrow = heroSec?.subtitle || "Clean Energy Engineering Division";
  const heroTitle = heroSec?.title || "ENERGY. REIMAGINED.";
  const heroDesc = heroSec?.description || 
    "Tier-1 TopCon bifacial monocrystalline solar installations engineered for the Saurashtra climate. Reduce residential and commercial power bills by up to 90% with turnkey government subsidy and DISCOM net-metering.";
  const heroMediaUrl = heroSec?.content?.media_url || "/assets/images/hero/hero-solar.jpg";
  const heroMediaType = heroSec?.content?.media_type || (heroMediaUrl.endsWith(".mp4") ? "video" : "image");
  const heroPrimaryBtnText = heroSec?.content?.primary_btn_text || `View Solar Engineering (${solarProducts.length})`;
  const heroPrimaryBtnUrl = heroSec?.content?.primary_btn_url || "#solar-hardware";
  const heroSecondaryBtnText = heroSec?.content?.secondary_btn_text || "Calculate Solar ROI";
  const heroSecondaryBtnUrl = heroSec?.content?.secondary_btn_url || "/contact";

  // Standards Values
  const standardsEyebrow = standardsSec?.subtitle || "Generation Standards";
  const standardsTitle = standardsSec?.title || "TURNKEY ROOFTOP SOLAR ADVANTAGES";
  const pillars = standardsSec?.content?.pillars || [
    {
      num: "01 / N-Type TOPCon Technology",
      title: "22.8% Conversion Yield",
      desc: "Advanced half-cut cells with superior -0.30%/°C temperature coefficient, maintaining exceptional generation even through intense Gujarat summers."
    },
    {
      num: "02 / Heavy Coastal Mounting",
      title: "Hot-Dip Galvanized Alloy",
      desc: "Structural mounting frameworks engineered to withstand high wind velocities up to 150 km/h and saline coastal humidity without corrosion."
    },
    {
      num: "03 / End-to-End Liaisoning",
      title: "Net-Metering & Subsidies",
      desc: "Zero paperwork hassle for the client. We manage full DISCOM approvals, bi-directional meter synchronization, and government direct subsidies."
    }
  ];

  // Products Showcase Header Values
  const productsEyebrow = productsSec?.subtitle || "Solar Modules & Arrays";
  const productsTitle = productsSec?.title || "MONOCRYSTALLINE";
  const productsHighlight = productsSec?.content?.highlighted_text || "SOLAR SUITE.";

  return (
    <div className="domain-page solar-page">
      {/* Domain Hero Banner */}
      <section className="domain-hero-section relative overflow-hidden min-h-[500px] flex items-center">
        <div className="domain-hero-bg absolute inset-0 z-0">
          {heroMediaType === "video" ? (
            <video 
              src={heroMediaUrl} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="hero-bg-media w-full h-full object-cover" 
            />
          ) : (
            <img 
              src={heroMediaUrl} 
              alt="Turnkey Rooftop Solar Engineering by Sivansh Enterprise" 
              className="hero-bg-media w-full h-full object-cover" 
            />
          )}
          <div className="hero-overlay absolute inset-0 bg-black/65"></div>
        </div>

        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold mb-2">{heroEyebrow}</div>
            <h1 className="serif-heading section-title text-4xl md:text-5xl mb-4 text-white">
              {heroTitle}
            </h1>
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              {heroDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={heroPrimaryBtnUrl} className="btn btn-gold">
                {heroPrimaryBtnText}
              </a>
              <Link href={heroSecondaryBtnUrl} className="btn btn-gold-outline">
                {heroSecondaryBtnText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Engineering Standards */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">{standardsEyebrow}</div>
            <h2 className="serif-heading section-title">{standardsTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p: any, idx: number) => (
              <div key={idx} className="p-6 bg-carbon-800 rounded border border-gold/20 flex flex-col justify-between">
                <div>
                  <span className="text-gold text-sm font-mono font-bold mb-3 block">
                    {p.num || `0${idx + 1}`}
                  </span>
                  <h3 className="text-xl font-serif mb-2 text-white">{p.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <section className="section-pad" id="solar-hardware">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">{productsEyebrow}</div>
            <h2 className="serif-heading section-title">
              {productsTitle} <span className="text-gold-gradient">{productsHighlight}</span>
            </h2>
          </div>

          <div className="products-grid">
            {solarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
