import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function LEDPage() {
  const ledProducts = await getProducts({ category: "led", status: "published" });

  return (
    <div className="domain-page led-page">
      {/* Domain Hero Banner */}
      <section className="domain-hero-section relative">
        <div className="domain-hero-bg">
          <img 
            src="/assets/images/hero/hero-led.jpg" 
            alt="Architectural LED Lighting by Sivansh Enterprise" 
            className="hero-bg-media" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold">Architectural Luminescence Division</div>
            <h1 className="serif-heading section-title text-4xl md:text-5xl mb-4">
              LIGHT THAT <br />
              <span className="text-gold-gradient">DEFINES SPACE.</span>
            </h1>
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              Museum-grade CRI 95+ optical downlights, zero-glare honeycomb baffles, and spotless 
              continuous linear cove illumination engineered for luxury residences and prestigious showrooms.
            </p>
            <div className="flex gap-4">
              <a href="#led-hardware" className="btn btn-gold">
                Explore LED Fixtures ({ledProducts.length})
              </a>
              <Link href="/contact" className="btn btn-gold-outline">
                Request Lighting Simulation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Optical Benchmarks */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Optical Engineering</div>
            <h2 className="serif-heading section-title">ARCHITECTURAL LIGHTING STANDARDS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">01 / True Color Fidelity</span>
              <h3 className="text-xl font-serif mb-2">CRI ≥ 95 Rendering</h3>
              <p className="text-secondary text-sm">
                Reveals the true rich grain of Italian marble, teakwood, and textiles. Colors look natural and vibrant rather than washed out.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">02 / Zero Optical Strain</span>
              <h3 className="text-xl font-serif mb-2">Deep Honeycomb UGR &lt; 13</h3>
              <p className="text-secondary text-sm">
                Deep recessed honeycomb baffles conceal the light source from sightlines, providing soothing illumination without eye fatigue.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">03 / Continuous Linear Cove</span>
              <h3 className="text-xl font-serif mb-2">240 LEDs Per Metre</h3>
              <p className="text-secondary text-sm">
                100% spotless diffused linear ribbons for false ceilings, floating stairs, and wall-wash treatments with seamless dimming.
              </p>
            </div>
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
