import React from "react";
import Link from "next/link";
import { getPageSections } from "@/lib/actions/admin";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function AboutPage() {
  const sections = await getPageSections("about");

  const bannerSec = sections.find((s) => s.section_key === "hero_banner");
  const foundSec = sections.find((s) => s.section_key === "foundation");
  const pillarsSec = sections.find((s) => s.section_key === "pillars");

  // Banner values
  const bannerEyebrow = bannerSec?.subtitle || "Engineering Heritage";
  const bannerTitle = bannerSec?.title || "DEFINING RELIABILITY IN SAURASHTRA.";
  const bannerDesc = bannerSec?.description || 
    "Based in Keshod, Gujarat, Sivansh Enterprise was established with a singular conviction: critical security, illumination, and clean energy infrastructures must be engineered without compromise.";
  const bannerMediaUrl = bannerSec?.content?.media_url || "/assets/images/hero/hero-about.jpg";

  // Foundation values
  const foundEyebrow = foundSec?.subtitle || "Our Foundation";
  const foundTitle = foundSec?.title || "BUILT TO PROTECT, ILLUMINATE & EMPOWER.";
  const para1 = foundSec?.content?.body_paragraph_1 || 
    "In an industry frequently clouded by gray-market imports and inflated marketing claims, Sivansh Enterprise operates strictly with authentic, BIS-ER and STQC certified hardware. Every camera model number in our catalog reflects an official manufacturer datasheet.";
  const para2 = foundSec?.content?.body_paragraph_2 || 
    "From luxury villas across Junagadh requiring spotless architectural cove lighting to remote agricultural perimeters demanding 10-day autonomous solar 4G cameras, we execute turnkey engineering from technical survey to final commissioning.";
  const foundMediaUrl = foundSec?.content?.media_url || "/assets/images/lifestyle/commercial-security.jpg";
  const foundMediaType = foundSec?.content?.media_type || (foundMediaUrl.endsWith(".mp4") ? "video" : "image");
  const btn1Text = foundSec?.content?.primary_btn_text || "Explore Disciplines";
  const btn1Url = foundSec?.content?.primary_btn_url || "/services";
  const btn2Text = foundSec?.content?.secondary_btn_text || "Consult With Us";
  const btn2Url = foundSec?.content?.secondary_btn_url || "/contact";

  // Pillars values
  const pillarsTitle = pillarsSec?.title || "OUR GUIDING PILLARS";
  const pillarsCards = pillarsSec?.content?.cards || [
    {
      num: "01 / Mission",
      title: "Our Mission",
      desc: "To engineer ultra-reliable, certified technological infrastructure for Gujarat’s leading residences, commercial ventures, and agricultural enterprises with permanent local accountability."
    },
    {
      num: "02 / Vision",
      title: "Our Vision",
      desc: "To be Saurashtra’s most trusted technical engineering firm, synonymous with genuine brand hardware, aesthetic brilliance, and clean energy independence."
    },
    {
      num: "03 / Values",
      title: "Core Values",
      desc: "Absolute technical integrity, zero fabricated pricing, certified on-ground technicians, and rapid on-site maintenance response from our Keshod headquarters."
    }
  ];

  // Quality Mandates & Certifications values
  const qmSec = sections.find((s) => s.section_key === "quality_mandates");
  const qmEyebrow = qmSec?.subtitle || "Quality Mandates";
  const qmTitle = qmSec?.title || "VERIFIED ACCREDITATIONS";
  const qmDesc = qmSec?.description || 
    "Our products and installations comply with BIS-ER standards tested through accredited STQC laboratories, CE, RoHS, and IEC 61215/61730 solar generation norms.";
  const qmBadges: string[] = qmSec?.content?.badges || [
    "BIS-ER Certified",
    "Accredited STQC Tested",
    "Tier-1 TopCon Solar",
    "IK10 Vandal-Proof",
    "CRI 95+ Photometric"
  ];

  return (
    <div className="about-page-wrapper">
      {/* Header Hero Section with Background Image */}
      <section className="domain-hero-section relative overflow-hidden min-h-[440px] flex items-center">
        <div className="domain-hero-bg absolute inset-0 z-0">
          <img 
            src={bannerMediaUrl} 
            alt="Sivansh Enterprise Engineering Heritage" 
            className="hero-bg-media w-full h-full object-cover" 
          />
          <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/20"></div>
        </div>

        <div className="container relative z-10 pt-36 pb-20 text-center">
          <div className="eyebrow text-gold mb-2">{bannerEyebrow}</div>
          <h1 className="serif-heading section-title text-3xl md:text-5xl mb-4 text-white">
            {bannerTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-secondary text-sm md:text-base leading-relaxed">
            {bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Philosophy / Foundation Section */}
      <section className="section-pad">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="eyebrow text-gold">{foundEyebrow}</div>
              <h2 className="serif-heading text-3xl mb-6">
                {foundTitle}
              </h2>
              <p className="text-secondary leading-relaxed mb-4">
                {para1}
              </p>
              <p className="text-secondary leading-relaxed mb-6">
                {para2}
              </p>
              <div className="flex gap-4">
                <Link href={btn1Url} className="btn btn-gold">
                  {btn1Text}
                </Link>
                <Link href={btn2Url} className="btn btn-gold-outline">
                  {btn2Text}
                </Link>
              </div>
            </div>

            <div className="relative rounded overflow-hidden border border-gold/30 bg-black/40">
              {foundMediaType === "video" ? (
                <video 
                  src={foundMediaUrl} 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-auto object-cover max-h-[450px]" 
                />
              ) : (
                <img 
                  src={foundMediaUrl} 
                  alt={foundTitle} 
                  className="w-full h-auto object-cover max-h-[450px]" 
                />
              )}
            </div>
          </div>

          {/* Pillars: Mission, Vision, Standards */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="eyebrow text-gold">Guiding Philosophy</div>
              <h2 className="serif-heading text-3xl">{pillarsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillarsCards.map((card: any, idx: number) => (
                <div key={idx} className="p-8 bg-surface rounded border border-gold/20 flex flex-col justify-between">
                  <div>
                    <span className="text-gold font-mono text-xs font-bold block mb-2">{card.num || `0${idx + 1}`}</span>
                    <h3 className="serif-heading text-xl text-gold mb-3">{card.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standards & Certifications (Quality Mandates) */}
          <div className="p-8 bg-surface/40 rounded border border-gold/30 text-center">
            <div className="eyebrow text-gold mb-2">{qmEyebrow}</div>
            <h3 className="serif-heading text-2xl mb-4">{qmTitle}</h3>
            <p className="text-secondary text-sm max-w-2xl mx-auto mb-6">
              {qmDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gold">
              {qmBadges.map((badge, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-gold/40">•</span>}
                  <span>✓ {badge}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
