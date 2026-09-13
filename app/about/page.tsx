import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm text-center">
        <div className="container">
          <div className="eyebrow text-gold">Engineering Heritage</div>
          <h1 className="serif-heading section-title">
            DEFINING RELIABILITY IN <span className="text-gold-gradient">SAURASHTRA.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary">
            Based in Keshod, Gujarat, Sivansh Enterprise was established with a singular conviction: 
            critical security, illumination, and clean energy infrastructures must be engineered without compromise.
          </p>
        </div>
      </section>

      {/* Main Philosophy Section */}
      <section className="section-pad">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="eyebrow text-gold">Our Foundation</div>
              <h2 className="serif-heading text-3xl mb-6">
                BUILT TO PROTECT, ILLUMINATE & EMPOWER.
              </h2>
              <p className="text-secondary leading-relaxed mb-4">
                In an industry frequently clouded by gray-market imports and inflated marketing claims, 
                Sivansh Enterprise operates strictly with authentic, BIS-ER and STQC certified hardware. 
                Every camera model number in our catalog reflects an official manufacturer datasheet.
              </p>
              <p className="text-secondary leading-relaxed mb-6">
                From luxury villas across Junagadh requiring spotless architectural cove lighting to 
                remote agricultural perimeters demanding 10-day autonomous solar 4G cameras, 
                we execute turnkey engineering from technical survey to final commissioning.
              </p>
              <div className="flex gap-4">
                <Link href="/services" className="btn btn-gold">
                  Explore Disciplines
                </Link>
                <Link href="/contact" className="btn btn-gold-outline">
                  Consult With Us
                </Link>
              </div>
            </div>

            <div className="relative rounded overflow-hidden border border-gold/30">
              <img 
                src="/assets/images/lifestyle/commercial-security.jpg" 
                alt="Sivansh Enterprise Technical Operations in Gujarat" 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>

          {/* Pillars: Mission, Vision, Standards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-surface rounded border border-gold/20">
              <h3 className="serif-heading text-xl text-gold mb-3">Our Mission</h3>
              <p className="text-secondary text-sm leading-relaxed">
                To engineer ultra-reliable, certified technological infrastructure for Gujarat’s leading residences, 
                commercial ventures, and agricultural enterprises with permanent local accountability.
              </p>
            </div>

            <div className="p-8 bg-surface rounded border border-gold/20">
              <h3 className="serif-heading text-xl text-gold mb-3">Our Vision</h3>
              <p className="text-secondary text-sm leading-relaxed">
                To be Saurashtra’s most trusted technical engineering firm, synonymous with genuine brand hardware, 
                aesthetic brilliance, and clean energy independence.
              </p>
            </div>

            <div className="p-8 bg-surface rounded border border-gold/20">
              <h3 className="serif-heading text-xl text-gold mb-3">Core Values</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Absolute technical integrity, zero fabricated pricing, certified on-ground technicians, and 
                rapid on-site maintenance response from our Keshod headquarters.
              </p>
            </div>
          </div>

          {/* Standards & Certifications */}
          <div className="p-8 bg-surface/40 rounded border border-gold/30 text-center">
            <div className="eyebrow text-gold mb-2">Quality Mandates</div>
            <h3 className="serif-heading text-2xl mb-4">VERIFIED ACCREDITATIONS</h3>
            <p className="text-secondary text-sm max-w-2xl mx-auto mb-6">
              Our products and installations comply with BIS-ER standards tested through accredited STQC laboratories, 
              CE, RoHS, and IEC 61215/61730 solar generation norms.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gold">
              <span>✓ BIS-ER Certified</span>
              <span>•</span>
              <span>✓ Accredited STQC Tested</span>
              <span>•</span>
              <span>✓ Tier-1 TopCon Solar</span>
              <span>•</span>
              <span>✓ CRI 95+ Optical Lab Verified</span>
              <span>•</span>
              <span>✓ DISCOM Net-Metering Approved</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
