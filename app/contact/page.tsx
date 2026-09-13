import React from "react";
import { getSiteSettings } from "@/lib/actions/admin";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phone = settings?.phone || "+91 7533838538";
  const whatsapp = settings?.whatsapp || "+91 7533838538";
  const email = settings?.email || "info@sivanshenterprise.com";
  const address = settings?.address || "Station Road, Near Bus Stand, Keshod, Gujarat 362220";
  const hours = settings?.business_hours || "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: Closed";
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="contact-page-wrapper">
      {/* Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm text-center">
        <div className="container">
          <div className="eyebrow text-gold">Direct Consultation</div>
          <h1 className="serif-heading section-title">
            CONTACT <span className="text-gold-gradient">SIVANSH ENTERPRISE.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-secondary">
            Schedule an on-site survey or discuss technical specifications directly with our engineering staff in Keshod.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-pad">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Col: Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 bg-surface rounded border border-gold/20">
                <h3 className="serif-heading text-2xl mb-6 text-white">Keshod Office</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-gold font-bold">Location:</span>
                    <span className="text-secondary leading-relaxed">{address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold">Direct Phone:</span>
                    <a href={`tel:${phone}`} className="text-secondary hover:text-gold transition-colors">{phone}</a>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold">WhatsApp:</span>
                    <a 
                      href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Sivansh%20Enterprise,%20I%20would%20like%20to%20consult%20regarding%20my%20property.`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-secondary hover:text-gold transition-colors"
                    >
                      {whatsapp} (Instant Chat)
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gold font-bold">Email:</span>
                    <a href={`mailto:${email}`} className="text-secondary hover:text-gold transition-colors">{email}</a>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-gold/10">
                    <span className="text-gold font-bold">Hours:</span>
                    <span className="text-secondary">{hours}</span>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="p-8 bg-surface rounded border border-gold/20">
                <h3 className="serif-heading text-xl mb-3 text-gold">Operational Coverage</h3>
                <p className="text-secondary text-xs leading-relaxed">
                  We deploy certified technicians across Junagadh District, Keshod, Veraval, Somnath, Porbandar, 
                  and surrounding Saurashtra agricultural & industrial zones with rapid dispatch.
                </p>
              </div>
            </div>

            {/* Right Col: Consultation Form */}
            <div className="lg:col-span-7">
              <div className="p-8 bg-surface rounded border border-gold/30">
                <h3 className="serif-heading text-2xl mb-2 text-white">Request Quotation or Site Audit</h3>
                <p className="text-secondary text-sm mb-6">
                  Complete the technical brief below and our lead engineer will respond promptly.
                </p>
                <ContactForm sourcePage="contact_page" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="map-section section-pad-sm bg-surface">
        <div className="container">
          <div className="rounded overflow-hidden border border-gold/30 shadow-lg">
            <iframe
              title="Sivansh Enterprise Keshod Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59400!2d70.24!3d21.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bf54d2417777777%3A0x123456789abcdef!2sKeshod%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, filter: "grayscale(30%) invert(90%) contrast(85%)" }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
