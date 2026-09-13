import React from "react";
import Link from "next/link";
import { getServices, getPageSections } from "@/lib/actions/admin";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function ServicesPage() {
  const [services, sections] = await Promise.all([
    getServices(),
    getPageSections("services"),
  ]);

  const bannerSec = sections.find((s) => s.section_key === "hero_banner");
  const ctaSec = sections.find((s) => s.section_key === "cta");

  const bannerEyebrow = bannerSec?.subtitle || "Engineering Capabilities";
  const bannerTitle = bannerSec?.title || "SPECIALIZED DISCIPLINES.";
  const bannerDesc = bannerSec?.description || 
    "End-to-end design, deployment, liaisoning, and maintenance across CCTV security, architectural LED illumination, and turnkey rooftop solar power.";
  const bannerMediaUrl = bannerSec?.content?.media_url || "/assets/images/hero/hero-services.jpg";

  const ctaTitle = ctaSec?.title || "DISCUSS YOUR SITE REQUIREMENTS";
  const ctaDesc = ctaSec?.description || 
    "Our engineering leads provide complimentary on-ground site audits and technical project briefs across Saurashtra.";

  return (
    <div className="services-page-wrapper">
      {/* Header Hero Section with Background Image */}
      <section className="domain-hero-section relative overflow-hidden min-h-[440px] flex items-center">
        <div className="domain-hero-bg absolute inset-0 z-0">
          <img 
            src={bannerMediaUrl} 
            alt="Sivansh Enterprise Specialized Engineering Capabilities" 
            className="hero-bg-media w-full h-full object-cover" 
          />
          <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/20"></div>
        </div>

        <div className="container relative z-10 pt-36 pb-20 text-center">
          <div className="eyebrow text-gold mb-2">{bannerEyebrow}</div>
          <h1 className="hero-title serif-heading text-3xl md:text-5xl mb-4 text-white">
            {bannerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base leading-relaxed">
            {bannerDesc}
          </p>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="section-pad">
        <div className="container space-y-16">
          {services.map((service, idx) => (
            <div 
              key={service.id} 
              id={service.slug}
              className={`service-detail-row grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 bg-surface rounded border border-gold/20 ${
                idx % 2 === 1 ? "md:grid-flow-dense" : ""
              }`}
            >
              <div className={idx % 2 === 1 ? "md:col-start-2" : ""}>
                <div className="service-index text-gold font-bold text-sm uppercase tracking-widest mb-2 font-mono">
                  Division 0{idx + 1}
                </div>
                <h2 className="serif-heading text-2xl md:text-3xl mb-4 text-white">{service.name}</h2>
                <p className="text-secondary leading-relaxed mb-6">
                  {service.full_desc || service.short_desc}
                </p>

                {/* Features & Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {service.features && service.features.length > 0 && (
                    <div>
                      <h4 className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">Core Features</h4>
                      <ul className="text-xs text-secondary space-y-1">
                        {service.features.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <span className="text-gold">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {service.benefits && service.benefits.length > 0 && (
                    <div>
                      <h4 className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">Client Benefits</h4>
                      <ul className="text-xs text-secondary space-y-1">
                        {service.benefits.map((b: string, bIdx: number) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <span className="text-gold">✓</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link href={service.cta_url || "/contact"} className="btn btn-gold btn-sm">
                  {service.cta_text || "Request Consultation"}
                </Link>
              </div>

              <div className={idx % 2 === 1 ? "md:col-start-1" : ""}>
                <div className="rounded overflow-hidden border border-gold/30 bg-black/40">
                  <img 
                    src={service.main_image || "/assets/images/hero/hero-cctv.jpg"} 
                    alt={service.name} 
                    className="w-full h-auto object-cover max-h-96" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="section-pad-sm bg-surface">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="eyebrow text-gold">Tailored Proposals</div>
          <h2 className="serif-heading text-3xl mb-4">{ctaTitle}</h2>
          <p className="text-secondary text-sm mb-8">
            {ctaDesc}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="btn btn-gold">
              Schedule On-Site Audit
            </Link>
            <a 
              href="https://wa.me/917533838538" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold-outline"
            >
              WhatsApp Lead Engineer
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
