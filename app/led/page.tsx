import React from "react";
import Link from "next/link";
import { getProducts, getPageSections } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function LEDPage() {
  const [ledProducts, sections] = await Promise.all([
    getProducts({ category: "led", status: "published" }),
    getPageSections("led"),
  ]);

  const heroSec = sections.find((s) => s.section_key === "hero_banner");
  const standardsSec = sections.find((s) => s.section_key === "standards");

  // Hero Banner Values
  const heroEyebrow = heroSec?.subtitle || "Architectural Luminescence Division";
  const heroTitle = heroSec?.title || "LIGHT THAT DEFINES SPACE.";
  const heroDesc = heroSec?.description || 
    "Museum-grade CRI 95+ optical downlights, zero-glare honeycomb baffles, and spotless continuous linear cove illumination engineered for luxury residences and prestigious showrooms.";
  const heroMediaUrl = heroSec?.content?.media_url || "/assets/images/hero/hero-led.jpg";
  const heroMediaType = heroSec?.content?.media_type || (heroMediaUrl.endsWith(".mp4") ? "video" : "image");
  const heroPrimaryBtnText = heroSec?.content?.primary_btn_text || `Explore LED Fixtures (${ledProducts.length})`;
  const heroPrimaryBtnUrl = heroSec?.content?.primary_btn_url || "#led-hardware";
  const heroSecondaryBtnText = heroSec?.content?.secondary_btn_text || "Request Lighting Simulation";
  const heroSecondaryBtnUrl = heroSec?.content?.secondary_btn_url || "/contact";

  // Standards Values
  const standardsEyebrow = standardsSec?.subtitle || "Optical Engineering";
  const standardsTitle = standardsSec?.title || "ARCHITECTURAL LIGHTING STANDARDS";
  const pillars = standardsSec?.content?.pillars || [
    {
      num: "01 / True Color Fidelity",
      title: "CRI ≥ 95 Rendering",
      desc: "Reveals the true rich grain of Italian marble, teakwood, and textiles. Colors look natural and vibrant rather than washed out."
    },
    {
      num: "02 / Zero Optical Strain",
      title: "Deep Honeycomb UGR < 13",
      desc: "Deep recessed honeycomb baffles conceal the light source from sightlines, providing soothing illumination without eye fatigue."
    },
    {
      num: "03 / Continuous Linear Cove",
      title: "240 LEDs Per Metre",
      desc: "100% spotless diffused linear ribbons for false ceilings, floating stairs, and wall-wash treatments with seamless dimming."
    }
  ];

  return (
    <div className="domain-page led-page">
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
              alt="Architectural LED Lighting by Sivansh Enterprise" 
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

      {/* Optical Benchmarks */}
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
      <section className="section-pad" id="led-hardware">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Verified Fixtures</div>
            <h2 className="serif-heading section-title">
              ARCHITECTURAL <span className="text-gold-gradient">LED SUITE.</span>
            </h2>
          </div>

          <div className="products-grid">
            {ledProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
