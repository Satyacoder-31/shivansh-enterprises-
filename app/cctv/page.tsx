import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function CCTVPage() {
  const cctvProducts = await getProducts({ category: "cctv", status: "published" });

  return (
    <div className="domain-page cctv-page">
      {/* Domain Hero Banner */}
      <section className="domain-hero-section relative">
        <div className="domain-hero-bg">
          <img 
            src="/assets/images/hero/hero-cctv.jpg" 
            alt="Enterprise CCTV Surveillance Architecture" 
            className="hero-bg-media" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold">Surveillance Architecture Division</div>
            <h1 className="serif-heading section-title text-4xl md:text-5xl mb-4">
              PERIMETER SECURITY, <br />
              <span className="text-gold-gradient">ENGINEERED FOR GUJARAT.</span>
            </h1>
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              Industrial-grade 4G solar linkage, BIS-ER & STQC certified IP cameras, and IK10 vandal-proof 
              dome infrastructures designed for residential villas, commercial showrooms, and remote agricultural acreage.
            </p>
            <div className="flex gap-4">
              <a href="#cctv-hardware" className="btn btn-gold">
                View CCTV Hardware ({cctvProducts.length})
              </a>
              <Link href="/contact" className="btn btn-gold-outline">
                Request Perimeter Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Pillars */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Core Capabilities</div>
            <h2 className="serif-heading section-title">ARCHITECTURAL SURVEILLANCE STANDARDS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">01 / Autonomous 4G Solar</span>
              <h3 className="text-xl font-serif mb-2">10-Day Battery Autonomy</h3>
              <p className="text-secondary text-sm">
                Complete wire-free surveillance with integrated solar regeneration. Operates 24/7 in remote agricultural farmland without grid electricity.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">02 / Heavy Vandal Impact</span>
              <h3 className="text-xl font-serif mb-2">IK10 & IP67 Standards</h3>
              <p className="text-secondary text-sm">
                Solid metal casings built to withstand physical impacts, extreme coastal humidity, torrential rains, and harsh temperature variations.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">03 / Low-Light Starlight</span>
              <h3 className="text-xl font-serif mb-2">True 120dB WDR</h3>
              <p className="text-secondary text-sm">
                Full-color nocturnal imagery eliminating headlight glare and shadows. AI human & vehicle classification reduces false alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <section className="section-pad" id="cctv-hardware">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Verified Hardware</div>
            <h2 className="serif-heading section-title">
              AUTHENTIC CCTV <span className="text-gold-gradient">SOLUTIONS.</span>
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
