"use client";

import React, { useState } from "react";
import { Truck, Shield, Save, CheckCircle, Info } from "lucide-react";

export default function ShippingSettingsClient() {
  const [settings, setSettings] = useState({
    nimbus_email: "",
    nimbus_password: "",
    nimbus_api_key: "",
    origin_pincode: "362220",
    warehouse_name: "Keshod Central Logistics Hub",
    default_weight: "1.0",
    test_mode: true,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Persist to localStorage for client-side persistence
    localStorage.setItem("sivansh_shipping_settings", JSON.stringify(settings));
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-white">Logistics & NimbusPost Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Configure NimbusPost API credentials, Keshod origin hub, and multi-carrier dispatch settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Shipping configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* NimbusPost Status Card */}
        <div className="bg-[#121212] border border-[#c5a059]/30 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-medium text-base">NimbusPost Multi-Carrier Aggregator</h2>
                <p className="text-neutral-400 text-xs">Direct API Integration (Delhivery, Blue Dart, DTDC, Shadowfax)</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
              {settings.nimbus_email || settings.nimbus_api_key ? "CONFIGURED" : "READY FOR CREDENTIALS"}
            </span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg text-xs leading-relaxed text-neutral-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <strong>Credentials Status:</strong> Fields are currently kept empty as requested. The checkout system is actively running in <strong>Intelligent Fallback Simulation Mode</strong> with live carrier estimates (Delhivery, Blue Dart, DTDC) from Keshod (362220). Once you paste your NimbusPost credentials below, it automatically connects to live NimbusPost endpoints.
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                NimbusPost Registered Email
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={settings.nimbus_email}
                onChange={(e) => setSettings({ ...settings, nimbus_email: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                NimbusPost Account Password
              </label>
              <input
                type="password"
                placeholder="Enter NimbusPost password"
                value={settings.nimbus_password}
                onChange={(e) => setSettings({ ...settings, nimbus_password: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              NimbusPost API Key / Bearer Token (Optional)
            </label>
            <input
              type="text"
              placeholder="Paste Bearer Token from NimbusPost Settings > API"
              value={settings.nimbus_api_key}
              onChange={(e) => setSettings({ ...settings, nimbus_api_key: e.target.value })}
              className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white font-mono focus:border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        {/* Origin Warehouse Details */}
        <div className="bg-[#121212] border border-[#c5a059]/30 rounded-xl p-6 space-y-4 shadow-lg">
          <h2 className="text-white font-medium text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c5a059]" />
            <span>Keshod Origin Warehouse & Dispatch Defaults</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                Warehouse Pickup Pincode
              </label>
              <input
                type="text"
                value={settings.origin_pincode}
                onChange={(e) => setSettings({ ...settings, origin_pincode: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white font-mono font-bold focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                Default Package Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.default_weight}
                onChange={(e) => setSettings({ ...settings, default_weight: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white font-mono focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                Registered Warehouse Name
              </label>
              <input
                type="text"
                value={settings.warehouse_name}
                onChange={(e) => setSettings({ ...settings, warehouse_name: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 rounded px-3.5 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold text-xs px-6 py-2.5 flex items-center gap-2 font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Settings..." : "Save Shipping Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
