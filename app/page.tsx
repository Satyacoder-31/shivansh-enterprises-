import React from "react";
import Link from "next/link";
import { getHeroSlides, getProducts, getServices, getTestimonials } from "@/lib/actions/admin";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0; // Always serve fresh data

export default async function HomePage() {
  const [slides, products, services, testimonials] = await Promise.all([
    getHeroSlides(),
    getProducts({ status: 'published' }),
    getServices(),
    getTestimonials(),
  ]);

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);

  return (
    <>
      {/* 1. Full-Screen Cinematic Hero Carousel */}
      <HeroSlider slides={slides} />

      {/* 2. About Preview & Engineering Heritage */}
      <section className="about-preview-section section-pad" id="about-preview">
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-text-col">
              <div className="eyebrow text-gold">Sivansh Enterprise</div>
              <h2 className="serif-heading section-title">
                ENGINEERING PERFECTION FOR <span className="text-gold-gradient">SAURASHTRA.</span>
              </h2>
              <p className="lead-text">
                Headquartered in Keshod, Gujarat, Sivansh Enterprise is the premier technology partner 
                for estate owners, commercial enterprises, and modern agricultural setups who demand 
                uncompromising reliability in surveillance, illumination, and clean energy.
              </p>
              <p className="body-text">
                We bridge the gap between authentic global certifications (STQC, BIS-ER, Tier-1 Solar) and 
                local on-ground execution. Whether securing remote agricultural boundaries with autonomous 
                4G solar optics or sculpting luxury residences with zero-glare honeycomb LED lighting, 
                our work defines benchmarks.
              </p>
              <div className="about-actions">
                <Link href="/about" className="btn btn-gold">
                  Our Engineering Philosophy
                </Link>
                <Link href="/contact" className="btn btn-gold-outline">
                  Schedule Site Survey
                </Link>
              </div>
            </div>

            <div className="about-stats-col">
              <div className="stats-card-grid">
                <div className="stat-card">
                  <span className="stat-num text-gold">100%</span>
                  <span className="stat-label">Authentic Brand Hardware</span>
                  <p className="stat-sub">Strict adherence to official manufacturer specifications.</p>
                </div>
                <div className="stat-card">
                  <span className="stat-num text-gold">10-Day</span>
                  <span className="stat-label">Solar Battery Autonomy</span>
                  <p className="stat-sub">Wire-free perimeter security even through monsoon overcast.</p>
                </div>
                <div className="stat-card">
                  <span className="stat-num text-gold">CRI 95+</span>
                  <span className="stat-label">Architectural LED Optics</span>
                  <p className="stat-sub">Museum-grade color fidelity for marble, wood, and gold leaf.</p>
                </div>
                <div className="stat-card">
                  <span className="stat-num text-gold">25-Year</span>
                  <span className="stat-label">Solar Output Warranty</span>
                  <p className="stat-sub">N-Type TopCon bifacial generation designed for Gujarat heat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Disciplines / Services */}
      <section className="services-overview-section section-pad bg-surface" id="services">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow text-gold">Technical Disciplines</div>
            <h2 className="serif-heading section-title">
              BESPOKE SOLUTIONS. <span className="text-gold-gradient">ZERO COMPROMISE.</span>
            </h2>
            <p className="section-desc">
              Three synchronized engineering divisions addressing the critical pillars of modern properties.
            </p>
          </div>

          <div className="services-card-grid">
            {services.slice(0, 3).map((service, idx) => (
              <div key={service.id} className="service-feature-card">
                <div className="service-card-num text-gold">0{idx + 1}</div>
                <h3 className="service-card-title">{service.name}</h3>
                <p className="service-card-desc">{service.short_desc}</p>
                {service.features && (
                  <ul className="service-feature-bullets">
                    {service.features.slice(0, 3).map((f: string, fIdx: number) => (
                      <li key={fIdx}>
                        <span className="bullet-dot text-gold">•</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="service-card-footer">
                  <Link href={`/services#${service.slug}`} className="service-learn-more text-gold">
                    View Specifications →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curated Flagship Hardware (Featured Products) */}
      <section className="featured-products-section section-pad" id="featured-products">
        <div className="container">
          <div className="section-header flex-between items-end">
            <div>
              <div className="eyebrow text-gold">Authentic Catalog</div>
              <h2 className="serif-heading section-title">
                CURATED <span className="text-gold-gradient">FLAGSHIP HARDWARE.</span>
              </h2>
              <p className="section-desc">
                Genuine brochures, authentic test certifications, and verified parameters.
              </p>
            </div>
            <div className="section-actions desktop-only">
              <Link href="/shop" className="btn btn-gold-outline">
                Explore Complete Catalog ({products.length})
              </Link>
            </div>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 mobile-only">
            <Link href="/shop" className="btn btn-gold w-full">
              Explore Complete Catalog ({products.length})
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Sivansh Enterprise */}
      <section className="why-choose-section section-pad bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow text-gold">Our Standards</div>
            <h2 className="serif-heading section-title">
              THE SIVANSH <span className="text-gold-gradient">ADVANTAGE.</span>
            </h2>
            <p className="section-desc">
              Why prominent families and commercial operators throughout Junagadh & Saurashtra choose our firm.
            </p>
          </div>

          <div className="standards-grid">
            <div className="standard-box">
              <div className="standard-icon text-gold">◈</div>
              <h3 className="standard-title">Accredited STQC & BIS Certification</h3>
              <p className="standard-desc">
                Surveillance cameras verified through accredited testing laboratories with genuine serial tracking.
              </p>
            </div>

            <div className="standard-box">
              <div className="standard-icon text-gold">◈</div>
              <h3 className="standard-title">Zero-Glare Honeycomb Optics</h3>
              <p className="standard-desc">
                Architectural downlights engineered with deep UGR &lt; 13 baffles preventing optical fatigue in luxury spaces.
              </p>
            </div>

            <div className="standard-box">
              <div className="standard-icon text-gold">◈</div>
              <h3 className="standard-title">End-to-End Solar Liaisoning</h3>
              <p className="standard-desc">
                From shadow modeling to DISCOM bi-directional net-metering synchronization and government subsidy approvals.
              </p>
            </div>

            <div className="standard-box">
              <div className="standard-icon text-gold">◈</div>
              <h3 className="standard-title">Rapid On-Ground Technical Support</h3>
              <p className="standard-desc">
                Dedicated local field engineers stationed in Keshod, delivering rapid emergency breakdown response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      {testimonials.length > 0 && (
        <section className="testimonials-section section-pad">
          <div className="container">
            <div className="section-header text-center">
              <div className="eyebrow text-gold">Client Testimonials</div>
              <h2 className="serif-heading section-title">
                TRUSTED BY <span className="text-gold-gradient">ESTATE & BUSINESS LEADERS.</span>
              </h2>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <div className="stars text-gold mb-3">★★★★★</div>
                  <p className="testimonial-quote">"{t.content}"</p>
                  <div className="testimonial-author">
                    <strong className="author-name">{t.customer_name}</strong>
                    <span className="author-role">{t.position}, {t.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Consultation & Contact Form CTA */}
      <section className="cta-consultation-section section-pad bg-surface" id="consultation">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-text-col">
              <div className="eyebrow text-gold">Direct Consultation</div>
              <h2 className="serif-heading section-title">
                READY TO ELEVATE <br />
                <span className="text-gold-gradient">YOUR PROPERTY?</span>
              </h2>
              <p className="cta-desc">
                Consult with our lead technical specialists in Keshod. We conduct on-site perimeter audits, 
                lux-level simulations, and solar generation feasibility reports.
              </p>
              <div className="cta-quick-contacts">
                <div className="quick-contact-row">
                  <span className="qc-label">Direct Hotline:</span>
                  <a href="tel:+917533838538" className="qc-value text-gold">+91 7533838538</a>
                </div>
                <div className="quick-contact-row">
                  <span className="qc-label">Headquarters:</span>
                  <span className="qc-value">Station Road, Near Bus Stand, Keshod, Gujarat</span>
                </div>
                <div className="quick-contact-row">
                  <span className="qc-label">Operational Hours:</span>
                  <span className="qc-value">Mon - Sat: 9:00 AM - 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="cta-form-col">
              <div className="cta-form-card">
                <h3 className="form-card-title">Request Professional Survey</h3>
                <p className="form-card-sub">Receive a comprehensive technical proposal within 24 hours.</p>
                <ContactForm sourcePage="homepage_cta" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
