"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentSettings } from "@/types/database";
import { updatePaymentSettings } from "@/lib/actions/admin";
import { Save, Check, CreditCard, ShieldCheck, Key, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function PaymentSettingsClient({ initialSettings }: { initialSettings: PaymentSettings | null }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<PaymentSettings>>(initialSettings || {
    gateway: "razorpay",
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
    is_test_mode: true,
    is_enabled: true
  });

  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updatePaymentSettings(settings);
      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save payment settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Payment Gateway Configuration</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure Razorpay credentials, test vs live mode, and webhook settings</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Gateway Saved</span>
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

      <div className="bg-[#141414] border border-white/5 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0c2340] border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-medium text-base">Razorpay India Gateway</h2>
              <p className="text-neutral-400 text-xs mt-0.5">Supports UPI (GPay, PhonePe, Paytm), Netbanking, Credit & Debit Cards</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!settings.is_enabled}
              onChange={e => setSettings({ ...settings, is_enabled: e.target.checked })}
              className="accent-[#c5a059] w-4 h-4 rounded"
            />
            <span className="text-xs uppercase font-mono tracking-wider text-white">
              {settings.is_enabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        {/* Test Mode Warning */}
        <div className={`p-4 rounded border text-xs flex items-start gap-3 ${
          settings.is_test_mode 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        }`}>
          {settings.is_test_mode ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">
              {settings.is_test_mode ? "Test Mode (Sandbox) Enabled" : "Production Live Gateway Enabled"}
            </p>
            <p className="opacity-90 mt-0.5">
              {settings.is_test_mode 
                ? "Transactions will run against Razorpay test environment with fake payment simulation. Switch to Live mode for real customer transactions."
                : "Real money transactions are enabled. Ensure your Live Key ID and Live Secret are properly set."}
            </p>
          </div>
        </div>

        {/* Environment Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">Environment:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="environment"
              checked={!!settings.is_test_mode}
              onChange={() => setSettings({ ...settings, is_test_mode: true })}
              className="accent-[#c5a059]"
            />
            <span className="text-xs text-white">Test (Sandbox)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="environment"
              checked={!settings.is_test_mode}
              onChange={() => setSettings({ ...settings, is_test_mode: false })}
              className="accent-[#c5a059]"
            />
            <span className="text-xs text-white">Live Production</span>
          </label>
        </div>

        {/* Keys */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3 h-3 text-[#c5a059]" />
              <span>Razorpay Key ID</span>
            </label>
            <input
              type="text"
              value={settings.razorpay_key_id || ""}
              onChange={e => setSettings({ ...settings, razorpay_key_id: e.target.value })}
              placeholder="rzp_test_... or rzp_live_..."
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#c5a059]" />
                <span>Razorpay Key Secret</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? "Hide" : "Reveal"}</span>
              </button>
            </label>
            <input
              type={showSecret ? "text" : "password"}
              value={settings.razorpay_key_secret || ""}
              onChange={e => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
              placeholder="Enter Razorpay Secret Key"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Webhook Secret (Optional)</label>
            <input
              type="text"
              value={settings.razorpay_webhook_secret || ""}
              onChange={e => setSettings({ ...settings, razorpay_webhook_secret: e.target.value })}
              placeholder="Secret configured in your Razorpay Webhook Dashboard"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
