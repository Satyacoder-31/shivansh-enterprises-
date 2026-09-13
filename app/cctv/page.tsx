import React from "react";
import Link from "next/link";
import { getProducts, getPageSections } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function CCTVPage() {
  const [cctvProducts, sections] = await Promise.all([
    getProducts({ category: "cctv", status: "published" }),
    getPageSections("cctv"),
  ]);

  const heroSec = sections.find((s) => s.section_key === "hero_banner");
  const standardsSec = sections.find((s) => s.section_key === "standards");
  const productsSec = sections.find((s) => s.section_key === "products_header");

  // Hero Banner Values
  const heroEyebrow = heroSec?.subtitle || "Surveillance Architecture Division";
  const heroTitle = heroSec?.title || "PERIMETER SECURITY, ENGINEERED FOR GUJARAT.";
  const heroDesc = heroSec?.description || 
    "Industrial-grade 4G solar linkage, BIS-ER & STQC certified IP cameras, and IK10 vandal-proof dome infrastructures designed for residential villas, commercial showrooms, and remote agricultural acreage.";
  const heroMediaUrl = heroSec?.content?.media_url || "/assets/images/hero/hero-cctv.jpg";
  const heroMediaType = heroSec?.content?.media_type || (heroMediaUrl.endsWith(".mp4") ? "video" : "image");
  const heroPrimaryBtnText = heroSec?.content?.primary_btn_text || `View CCTV Hardware (${cctvProducts.length})`;
  const heroPrimaryBtnUrl = heroSec?.content?.primary_btn_url || "#cctv-hardware";
  const heroSecondaryBtnText = heroSec?.content?.secondary_btn_text || "Request Perimeter Audit";
  const heroSecondaryBtnUrl = heroSec?.content?.secondary_btn_url || "/contact";

  // Standards Values
  const standardsEyebrow = standardsSec?.subtitle || "Core Capabilities";
  const standardsTitle = standardsSec?.title || "ARCHITECTURAL SURVEILLANCE STANDARDS";
  const pillars = standardsSec?.content?.pillars || [
    {
      num: "01 / Autonomous 4G Solar",
      title: "10-Day Battery Autonomy",
      desc: "Complete wire-free surveillance with integrated solar regeneration. Operates 24/7 in remote agricultural farmland without grid electricity."
    },
    {
      num: "02 / Heavy Vandal Impact",
      title: "IK10 & IP67 Standards",
      desc: "Solid metal casings built to withstand physical impacts, extreme coastal humidity, torrential rains, and harsh temperature variations."
    },
    {
      num: "03 / Low-Light Starlight",
      title: "True 120dB WDR",
      desc: "Full-color nocturnal imagery eliminating headlight glare and shadows. AI human & vehicle classification reduces false alerts."
    }
  ];

  // Products Showcase Header Values
  const productsEyebrow = productsSec?.subtitle || "Verified Hardware";
  const productsTitle = productsSec?.title || "AUTHENTIC CCTV";
  const productsHighlight = productsSec?.content?.highlighted_text || "SOLUTIONS.";

  return (
    <div className="domain-page cctv-page">
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
              alt="Enterprise CCTV Surveillance Architecture" 
              className="hero-bg-media w-full h-full object-cover" 
            />
          )}
          <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/20"></div>
        </div>

        <div className="container relative z-10 pt-36 pb-20">
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

      {/* Engineering Pillars */}
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
      <section className="section-pad" id="cctv-hardware">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">{productsEyebrow}</div>
            <h2 className="serif-heading section-title">
              {productsTitle} <span className="text-gold-gradient">{productsHighlight}</span>
            </h2>
          </div>

          <div className="products-grid">
            {cctvProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
