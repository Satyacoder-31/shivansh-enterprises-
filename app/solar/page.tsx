import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/actions/admin";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function SolarPage() {
  const solarProducts = await getProducts({ category: "solar", status: "published" });

  return (
    <div className="domain-page solar-page">
      {/* Domain Hero Banner */}
      <section className="domain-hero-section relative">
        <div className="domain-hero-bg">
          <img 
            src="/assets/images/hero/hero-solar.jpg" 
            alt="Turnkey Rooftop Solar Engineering by Sivansh Enterprise" 
            className="hero-bg-media" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold">Clean Energy Engineering Division</div>
            <h1 className="serif-heading section-title text-4xl md:text-5xl mb-4">
              ENERGY. <br />
              <span className="text-gold-gradient">REIMAGINED.</span>
            </h1>
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              Tier-1 TopCon bifacial monocrystalline solar installations engineered for the Saurashtra climate. 
              Reduce residential and commercial power bills by up to 90% with turnkey government subsidy and DISCOM net-metering.
            </p>
            <div className="flex gap-4">
              <a href="#solar-hardware" className="btn btn-gold">
                View Solar Engineering ({solarProducts.length})
              </a>
              <Link href="/contact" className="btn btn-gold-outline">
                Calculate Solar ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Engineering Standards */}
      <section className="section-pad bg-surface">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Generation Standards</div>
            <h2 className="serif-heading section-title">TURNKEY ROOFTOP SOLAR ADVANTAGES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">01 / N-Type TOPCon Technology</span>
              <h3 className="text-xl font-serif mb-2">22.8% Conversion Yield</h3>
              <p className="text-secondary text-sm">
                Advanced half-cut cells with superior -0.30%/°C temperature coefficient, maintaining exceptional generation even through intense Gujarat summers.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">02 / Heavy Coastal Mounting</span>
              <h3 className="text-xl font-serif mb-2">Hot-Dip Galvanized Alloy</h3>
              <p className="text-secondary text-sm">
                Structural mounting frameworks engineered to withstand high wind velocities up to 150 km/h and saline coastal humidity without corrosion.
              </p>
            </div>

            <div className="p-6 bg-carbon-800 rounded border border-gold/20">
              <span className="text-gold text-2xl font-bold mb-3 block">03 / End-to-End Liaisoning</span>
              <h3 className="text-xl font-serif mb-2">Net-Metering & Subsidies</h3>
              <p className="text-secondary text-sm">
                Zero paperwork hassle for the client. We manage full DISCOM approvals, bi-directional meter synchronization, and government direct subsidies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <section className="section-pad" id="solar-hardware">
        <div className="container">
          <div className="section-header text-center mb-12">
            <div className="eyebrow text-gold">Solar Modules & Arrays</div>
            <h2 className="serif-heading section-title">
              MONOCRYSTALLINE <span className="text-gold-gradient">SOLAR SUITE.</span>
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
