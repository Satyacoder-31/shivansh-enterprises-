"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/types/database";
import { updateSiteSettings } from "@/lib/actions/admin";
import { Save, Check, Building2, Phone, Mail, Clock, MapPin, Globe, Share2, Code } from "lucide-react";

export default function GeneralSettingsClient({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<SiteSettings>>(initialSettings || {
    business_name: "Sivansh Enterprise",
    tagline: "CCTV Security, Architectural LED Lighting & Rooftop Solar",
    phone: "+91 7533838538",
    whatsapp: "+91 7533838538",
    email: "info@sivanshenterprise.com",
    address: "Station Road, Near Bus Stand, Keshod, Gujarat 362220",
    google_maps_url: "https://maps.google.com",
    business_hours: "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: Closed",
    currency: "INR",
    currency_symbol: "₹",
    gst_number: "24AAECS1234F1Z5",
    announcement_text: "CCTV SECURITY • ARCHITECTURAL LED LIGHTING • ROOFTOP SOLAR ENERGY • KESHOD, GUJARAT",
    social_links: { facebook: "#", instagram: "#", youtube: "#", linkedin: "#" }
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSiteSettings(settings);
      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">General Business Settings</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure business identity, contact channels, address, and live announcement banner</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn-luxury px-6 py-2.5 rounded-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Identity */}
        <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059] border-b border-white/5 pb-3">
            <Building2 className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider font-mono font-semibold text-white">Brand Identity</h2>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Business Name</label>
            <input
              type="text"
              value={settings.business_name || ""}
              onChange={e => setSettings({ ...settings, business_name: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Tagline / Motto</label>
            <input
              type="text"
              value={settings.tagline || ""}
              onChange={e => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">GST Number</label>
              <input
                type="text"
                value={settings.gst_number || ""}
                onChange={e => setSettings({ ...settings, gst_number: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Currency Code</label>
              <input
                type="text"
                value={settings.currency || "INR"}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Announcement Bar Text</label>
            <textarea
              rows={2}
              value={settings.announcement_text || ""}
              onChange={e => setSettings({ ...settings, announcement_text: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
            <p className="text-[11px] text-neutral-500 mt-1">Displays as a ticker tape bar at the very top of all website pages.</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059] border-b border-white/5 pb-3">
            <Phone className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider font-mono font-semibold text-white">Contact & Channels</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Primary Phone</label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">WhatsApp Hotline</label>
              <input
                type="text"
                value={settings.whatsapp || ""}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Official Email</label>
            <input
              type="email"
              value={settings.email || ""}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Physical Address</label>
            <textarea
              rows={2}
              value={settings.address || ""}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Business Hours</label>
            <input
              type="text"
              value={settings.business_hours || ""}
              onChange={e => setSettings({ ...settings, business_hours: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059] border-b border-white/5 pb-3">
            <Share2 className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider font-mono font-semibold text-white">Social Media Accounts</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={settings.social_links?.facebook || ""}
                onChange={e => setSettings({
                  ...settings,
                  social_links: { ...settings.social_links, facebook: e.target.value }
                })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={settings.social_links?.instagram || ""}
                onChange={e => setSettings({
                  ...settings,
                  social_links: { ...settings.social_links, instagram: e.target.value }
                })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">YouTube URL</label>
              <input
                type="text"
                value={settings.social_links?.youtube || ""}
                onChange={e => setSettings({
                  ...settings,
                  social_links: { ...settings.social_links, youtube: e.target.value }
                })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">LinkedIn URL</label>
              <input
                type="text"
                value={settings.social_links?.linkedin || ""}
                onChange={e => setSettings({
                  ...settings,
                  social_links: { ...settings.social_links, linkedin: e.target.value }
                })}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Branding Images */}
        <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059] border-b border-white/5 pb-3">
            <Globe className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-wider font-mono font-semibold text-white">Logo & Assets</h2>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Logo URL (Transparent PNG)</label>
            <input
              type="text"
              value={settings.logo_dark_url || ""}
              onChange={e => setSettings({ ...settings, logo_dark_url: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Favicon URL (.svg or .png)</label>
            <input
              type="text"
              value={settings.favicon_url || ""}
              onChange={e => setSettings({ ...settings, favicon_url: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Google Maps Embed URL</label>
            <input
              type="text"
              value={settings.google_maps_url || ""}
              onChange={e => setSettings({ ...settings, google_maps_url: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
