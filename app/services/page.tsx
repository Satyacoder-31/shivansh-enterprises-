import React from "react";
import Link from "next/link";
import { getServices } from "@/lib/actions/admin";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="services-page-wrapper">
      {/* Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm text-center">
        <div className="container">
          <div className="eyebrow text-gold">Engineering Capabilities</div>
          <h1 className="serif-heading section-title">
            SPECIALIZED <span className="text-gold-gradient">DISCIPLINES.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary">
            End-to-end design, deployment, liaisoning, and maintenance across CCTV security, 
            architectural LED illumination, and turnkey rooftop solar power.
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
                <div className="service-index text-gold font-bold text-sm uppercase tracking-widest mb-2">
                  Division 0{idx + 1}
                </div>
                <h2 className="serif-heading text-2xl md:text-3xl mb-4">{service.name}</h2>
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

                <Link href="/contact" className="btn btn-gold btn-sm">
                  {service.cta_text || "Request Consultation"}
                </Link>
              </div>

              <div className={idx % 2 === 1 ? "md:col-start-1" : ""}>
                <div className="rounded overflow-hidden border border-gold/30">
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
          <h2 className="serif-heading text-3xl mb-4">DISCUSS YOUR SITE REQUIREMENTS</h2>
          <p className="text-secondary text-sm mb-8">
            Our certified lead technicians conduct thorough perimeter audits and electrical load modeling.
          </p>
          <ContactForm sourcePage="services_page" />
        </div>
      </section>
    </div>
  );
}
