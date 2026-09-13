"use client";

import React, { useState } from "react";
import { submitPublicEnquiry } from "@/lib/actions/admin";

interface ContactFormProps {
  sourcePage?: string;
  defaultService?: string;
}

export default function ContactForm({ sourcePage = "contact", defaultService = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product_service: defaultService || "CCTV Surveillance Architecture",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.phone || !formData.message) {
        throw new Error("Please complete your name, phone number, and project details.");
      }

      await submitPublicEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        product_service: formData.product_service,
        message: formData.message,
        source_page: sourcePage,
      });

      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        product_service: "CCTV Surveillance Architecture",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Unable to submit your inquiry. Please contact us via phone or WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <div className="success-icon text-gold">✓</div>
        <h3 className="serif-heading text-2xl mb-2">Inquiry Transmitted</h3>
        <p className="text-secondary mb-6">
          Thank you for reaching out to Sivansh Enterprise. Our engineering specialists in Keshod have received your project requirements and will contact you directly within 2 hours.
        </p>
        <button 
          type="button" 
          className="btn btn-gold-outline btn-sm"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {error && (
        <div className="form-error-alert mb-4 p-3 bg-red-900/30 border border-red-500/40 text-red-300 rounded text-sm">
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            id="name"
            required
            placeholder="e.g. Rajeshbhai Patel"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            required
            placeholder="e.g. +91 98765 43210"
            className="form-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address (Optional)</label>
          <input
            type="email"
            id="email"
            placeholder="e.g. contact@domain.com"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="service" className="form-label">Area of Interest *</label>
          <select
            id="service"
            className="form-input form-select"
            value={formData.product_service}
            onChange={(e) => setFormData({ ...formData, product_service: e.target.value })}
          >
            <option value="CCTV Surveillance Architecture">CCTV Surveillance Architecture</option>
            <option value="Architectural LED Illumination">Architectural LED Illumination</option>
            <option value="Turnkey Rooftop Solar Systems">Turnkey Rooftop Solar Systems</option>
            <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
            <option value="Other Hardware Inquiry">Other Hardware Inquiry</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">Project Details or Site Requirements *</label>
        <textarea
          id="message"
          required
          rows={4}
          placeholder="Please describe your villa, agricultural land, factory, or showroom requirements..."
          className="form-input form-textarea"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-gold w-full"
        disabled={loading}
      >
        {loading ? "Transmitting Requirements..." : "Request Professional Consultation"}
      </button>
    </form>
  );
}
