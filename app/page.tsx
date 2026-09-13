import React from "react";
import Link from "next/link";
import { 
  getHeroSlides, 
  getProducts, 
  getServices, 
  getTestimonials, 
  getPageSections 
} from "@/lib/actions/admin";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function HomePage() {
  const [slides, products, services, testimonials, homeSections] = await Promise.all([
    getHeroSlides(),
    getProducts({ status: "published" }),
    getServices(),
    getTestimonials(),
    getPageSections("home"),
  ]);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  // Helper to find dynamic section by key
  const getSection = (key: string) => homeSections.find((s) => s.section_key === key);

  // 1. About Preview Section
  const aboutSec = getSection("about_preview");
  const showAbout = aboutSec?.is_active !== false;
  const aboutEyebrow = aboutSec?.subtitle || "Sivansh Enterprise";
  const aboutTitle = aboutSec?.title || "ENGINEERING PERFECTION FOR SAURASHTRA.";
  const aboutLeadText = aboutSec?.content?.lead_text || aboutSec?.description || 
    "Headquartered in Keshod, Gujarat, Sivansh Enterprise is the premier technology partner for estate owners, commercial enterprises, and modern agricultural setups who demand uncompromising reliability in surveillance, illumination, and clean energy.";
  const aboutBodyText = aboutSec?.content?.body_text || 
    "We bridge the gap between authentic global certifications (STQC, BIS-ER, Tier-1 Solar) and local on-ground execution. Whether securing remote agricultural boundaries with autonomous 4G solar optics or sculpting luxury residences with zero-glare honeycomb LED lighting, our work defines benchmarks.";
  const aboutPrimaryBtnText = aboutSec?.content?.primary_btn_text || "Our Engineering Philosophy";
  const aboutPrimaryBtnUrl = aboutSec?.content?.primary_btn_url || "/about";
  const aboutSecondaryBtnText = aboutSec?.content?.secondary_btn_text || "Schedule Site Survey";
  const aboutSecondaryBtnUrl = aboutSec?.content?.secondary_btn_url || "/contact";
  const aboutStats = aboutSec?.content?.stats || [
    { num: "100%", label: "Authentic Brand Hardware", sub: "Strict adherence to official manufacturer specifications." },
    { num: "10-Day", label: "Solar Battery Autonomy", sub: "Wire-free perimeter security even through monsoon overcast." },
    { num: "CRI 95+", label: "Architectural LED Optics", sub: "Museum-grade color fidelity for marble, wood, and gold leaf." },
    { num: "25-Year", label: "Solar Output Warranty", sub: "N-Type TopCon bifacial generation designed for Gujarat heat." }
  ];

  // 2. Services Header Section
  const servicesSec = getSection("services_header") || getSection("services");
  const showServices = servicesSec?.is_active !== false;
  const servicesEyebrow = servicesSec?.subtitle || "Technical Disciplines";
  const servicesTitle = servicesSec?.title || "BESPOKE SOLUTIONS. ZERO COMPROMISE.";
  const servicesDesc = servicesSec?.description || 
    "Three synchronized engineering divisions addressing the critical pillars of modern properties.";

  // 3. Flagship Products Section
  const featuredSec = getSection("featured_products");
  const showFeatured = featuredSec?.is_active !== false;
  const featuredEyebrow = featuredSec?.subtitle || "Authentic Catalog";
  const featuredTitle = featuredSec?.title || "CURATED FLAGSHIP HARDWARE.";
  const featuredDesc = featuredSec?.description || 
    "Genuine brochures, authentic test certifications, and verified parameters.";

  // 4. Why Choose Us / Advantage Section
  const advSec = getSection("why_choose_us");
  const showAdvantage = advSec?.is_active !== false;
  const advEyebrow = advSec?.subtitle || "Our Standards";
  const advTitle = advSec?.title || "THE SIVANSH ADVANTAGE.";
  const advDesc = advSec?.description || 
    "Why prominent families and commercial operators throughout Junagadh & Saurashtra choose our firm.";
  const advPillars = advSec?.content?.pillars || [
    {
      title: "Accredited STQC & BIS Certification",
      desc: "Surveillance cameras verified through accredited testing laboratories with genuine serial tracking."
    },
    {
      title: "Zero-Glare Honeycomb Optics",
      desc: "Architectural downlights engineered with deep UGR < 13 baffles preventing optical fatigue in luxury spaces."
    },
    {
      title: "End-to-End Solar Liaisoning",
      desc: "From shadow modeling to DISCOM bi-directional net-metering synchronization and government subsidy approvals."
    },
    {
      title: "Rapid On-Ground Technical Support",
      desc: "Dedicated local field engineers stationed in Keshod, delivering rapid emergency breakdown response."
    }
  ];

  // 5. Testimonials Section
  const testimonialsSec = getSection("testimonials");
  const showTestimonials = testimonialsSec?.is_active !== false && testimonials.length > 0;

  // 6. Consultation CTA Section
  const ctaSec = getSection("cta");
  const showCta = ctaSec?.is_active !== false;
  const ctaEyebrow = ctaSec?.subtitle || "Direct Consultation";
  const ctaTitle = ctaSec?.title || "READY TO ELEVATE YOUR PROPERTY?";
  const ctaDesc = ctaSec?.description || 
    "Consult with our lead technical specialists in Keshod. We conduct on-site perimeter audits, lux-level simulations, and solar generation feasibility reports.";
  const ctaHotline = ctaSec?.content?.hotline || "+91 7533838538";
  const ctaAddress = ctaSec?.content?.address || "Station Road, Near Bus Stand, Keshod, Gujarat";
  const ctaHours = ctaSec?.content?.hours || "Mon - Sat: 9:00 AM - 8:30 PM";
  const ctaFormTitle = ctaSec?.content?.form_title || "Request Professional Survey";
  const ctaFormSub = ctaSec?.content?.form_subtitle || "Receive a comprehensive technical proposal within 24 hours.";

  return (
    <>
      {/* 1. Full-Screen Cinematic Hero Carousel */}
      <HeroSlider slides={slides} />

      {/* 2. About Preview & Engineering Heritage */}
      {showAbout && (
        <section className="about-preview-section section-pad" id="about-preview">
          <div className="container">
            <div className="about-preview-grid">
              <div className="about-text-col">
                <div className="eyebrow text-gold">{aboutEyebrow}</div>
                <h2 className="serif-heading section-title">
                  {aboutTitle}
                </h2>
                <p className="lead-text">
                  {aboutLeadText}
                </p>
                <p className="body-text">
                  {aboutBodyText}
                </p>
                <div className="about-actions">
                  <Link href={aboutPrimaryBtnUrl} className="btn btn-gold">
                    {aboutPrimaryBtnText}
                  </Link>
                  <Link href={aboutSecondaryBtnUrl} className="btn btn-gold-outline">
                    {aboutSecondaryBtnText}
                  </Link>
                </div>
              </div>

              <div className="about-stats-col">
                <div className="stats-card-grid">
                  {aboutStats.map((stat: any, idx: number) => (
                    <div key={idx} className="stat-card">
                      <span className="stat-num text-gold">{stat.num}</span>
                      <span className="stat-label">{stat.label}</span>
                      <p className="stat-sub">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Core Disciplines / Services */}
      {showServices && (
        <section className="services-overview-section section-pad bg-surface" id="services">
          <div className="container">
            <div className="section-header text-center">
              <div className="eyebrow text-gold">{servicesEyebrow}</div>
              <h2 className="serif-heading section-title">
                {servicesTitle}
              </h2>
              <p className="section-desc">
                {servicesDesc}
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
      )}

      {/* 4. Curated Flagship Hardware (Featured Products) */}
      {showFeatured && featuredProducts.length > 0 && (
        <section className="featured-products-section section-pad" id="featured-products">
          <div className="container">
            <div className="section-header flex-between items-end">
              <div>
                <div className="eyebrow text-gold">{featuredEyebrow}</div>
                <h2 className="serif-heading section-title">
                  {featuredTitle}
                </h2>
                <p className="section-desc">
                  {featuredDesc}
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
      )}

      {/* 5. Why Choose Sivansh Enterprise / Advantage */}
      {showAdvantage && (
        <section className="why-choose-section section-pad bg-surface">
          <div className="container">
            <div className="section-header text-center">
              <div className="eyebrow text-gold">{advEyebrow}</div>
              <h2 className="serif-heading section-title">
                {advTitle}
              </h2>
              <p className="section-desc">
                {advDesc}
              </p>
            </div>

            <div className="standards-grid">
              {advPillars.map((pillar: any, idx: number) => (
                <div key={idx} className="standard-box">
                  <div className="standard-icon text-gold">◈</div>
                  <h3 className="standard-title">{pillar.title}</h3>
                  <p className="standard-desc">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials */}
      {showTestimonials && (
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
      {showCta && (
        <section className="cta-consultation-section section-pad bg-surface" id="consultation">
          <div className="container">
            <div className="cta-grid">
              <div className="cta-text-col">
                <div className="eyebrow text-gold">{ctaEyebrow}</div>
                <h2 className="serif-heading section-title">
                  {ctaTitle}
                </h2>
                <p className="cta-desc">
                  {ctaDesc}
                </p>
                <div className="cta-quick-contacts">
                  <div className="quick-contact-row">
                    <span className="qc-label">Direct Hotline:</span>
                    <a href={`tel:${ctaHotline.replace(/\s+/g, "")}`} className="qc-value text-gold">
                      {ctaHotline}
                    </a>
                  </div>
                  <div className="quick-contact-row">
                    <span className="qc-label">Headquarters:</span>
                    <span className="qc-value">{ctaAddress}</span>
                  </div>
                  <div className="quick-contact-row">
                    <span className="qc-label">Operational Hours:</span>
                    <span className="qc-value">{ctaHours}</span>
                  </div>
                </div>
              </div>

              <div className="cta-form-col">
                <div className="cta-form-card">
                  <h3 className="form-card-title">{ctaFormTitle}</h3>
                  <p className="form-card-sub">{ctaFormSub}</p>
                  <ContactForm sourcePage="homepage_cta" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
