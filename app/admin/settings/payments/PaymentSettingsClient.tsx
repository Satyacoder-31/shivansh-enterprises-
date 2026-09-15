"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentSettings } from "@/types/database";
import { updatePaymentSettings } from "@/lib/actions/admin";
import { 
  Save, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Key, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Zap, 
  RefreshCw,
  HelpCircle
} from "lucide-react";

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

  // Connection testing state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/payments/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key_id: settings.razorpay_key_id,
          key_secret: settings.razorpay_key_secret,
          is_test_mode: settings.is_test_mode,
        }),
      });

      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: "Failed to connect: " + err.message,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const currentKey = settings.razorpay_key_id?.trim() || "";
  const isKeyLive = currentKey.startsWith("rzp_live_");
  const isKeyTest = currentKey.startsWith("rzp_test_");

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Payment Gateway Configuration</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure Razorpay credentials, switch between Sandbox and Live mode, and test your connection</p>
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
        {/* Gateway Title & Master Switch */}
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
            <span className={`text-xs uppercase font-mono tracking-wider font-semibold ${settings.is_enabled ? "text-emerald-400" : "text-neutral-500"}`}>
              {settings.is_enabled ? "Gateway Active" : "Disabled"}
            </span>
          </label>
        </div>

        {/* Environment Selection Toggle */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-semibold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Target Gateway Environment</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
              settings.is_test_mode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {settings.is_test_mode ? "Sandbox Mode" : "Live Production"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Test Option */}
            <label className={`flex items-start gap-3 p-3.5 rounded-md border cursor-pointer transition-all ${
              settings.is_test_mode 
                ? "bg-amber-500/10 border-amber-500/50 shadow-sm" 
                : "bg-[#141414] border-white/5 hover:border-white/15 opacity-70"
            }`}>
              <input
                type="radio"
                name="environment"
                checked={!!settings.is_test_mode}
                onChange={() => setSettings({ ...settings, is_test_mode: true })}
                className="accent-[#c5a059] mt-0.5"
              />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span>Test (Sandbox)</span>
                  {settings.is_test_mode && <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">SELECTED</span>}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Allows safe end-to-end checkout simulation or testing with official Razorpay test cards & UPI without charging real money.
                </p>
              </div>
            </label>

            {/* Live Option */}
            <label className={`flex items-start gap-3 p-3.5 rounded-md border cursor-pointer transition-all ${
              !settings.is_test_mode 
                ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm" 
                : "bg-[#141414] border-white/5 hover:border-white/15 opacity-70"
            }`}>
              <input
                type="radio"
                name="environment"
                checked={!settings.is_test_mode}
                onChange={() => setSettings({ ...settings, is_test_mode: false })}
                className="accent-[#c5a059] mt-0.5"
              />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span>Live Production</span>
                  {!settings.is_test_mode && <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">SELECTED</span>}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Real customer transactions are charged. Requires your authentic Razorpay Live Key ID (<code className="text-emerald-300">rzp_live_...</code>) and Live Secret.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Dynamic Contextual Alert */}
        <div className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
          settings.is_test_mode 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        }`}>
          {settings.is_test_mode ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold text-sm">
              {settings.is_test_mode ? "Sandbox Testing Environment Active" : "Production Live Gateway Active"}
            </p>
            <p className="opacity-90 leading-relaxed">
              {settings.is_test_mode 
                ? "When customers or testers purchase products, no real bank charge occurs. If you enter an 'rzp_test_...' key, the official Razorpay test popup will launch. Otherwise, orders safely proceed via the built-in Sandbox Simulator."
                : "Real money transactions are enabled. Customers will be charged through authentic Razorpay UPI, Netbanking, or Debit/Credit card rails."}
            </p>

            {/* Validation warning if keys mismatch mode */}
            {!settings.is_test_mode && isKeyTest && (
              <p className="text-red-400 font-semibold pt-1 border-t border-amber-500/20 mt-2">
                ⚠️ Warning: Live Production is selected, but your Key ID starts with &apos;rzp_test_&apos;. You must enter your Live Key (&apos;rzp_live_...&apos;) and Live Secret from your Razorpay Dashboard.
              </p>
            )}

            {settings.is_test_mode && isKeyLive && (
              <p className="text-amber-300/90 pt-1 border-t border-amber-500/20 mt-2">
                ℹ️ Notice: You have saved a live key (&apos;rzp_live_...&apos;), but Sandbox Mode is selected. To protect against accidental charges, customer purchases will safely run in Sandbox Simulator mode until you select Live Production above.
              </p>
            )}
          </div>
        </div>

        {/* Key Inputs */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <Key className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Razorpay Key ID</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {isKeyLive ? "● LIVE KEY DETECTED" : isKeyTest ? "● TEST KEY DETECTED" : "e.g. rzp_live_... or rzp_test_..."}
              </span>
            </label>
            <input
              type="text"
              value={settings.razorpay_key_id || ""}
              onChange={e => {
                setSettings({ ...settings, razorpay_key_id: e.target.value });
                setTestResult(null);
              }}
              placeholder="rzp_live_... or rzp_test_..."
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Razorpay Key Secret</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? "Hide Secret" : "Reveal Secret"}</span>
              </button>
            </label>
            <input
              type={showSecret ? "text" : "password"}
              value={settings.razorpay_key_secret || ""}
              onChange={e => {
                setSettings({ ...settings, razorpay_key_secret: e.target.value });
                setTestResult(null);
              }}
              placeholder="Enter your Razorpay API Secret Key"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Webhook Secret (Optional)</span>
              <span className="text-[11px] text-neutral-500">For automated server webhook verification</span>
            </label>
            <input
              type="text"
              value={settings.razorpay_webhook_secret || ""}
              onChange={e => setSettings({ ...settings, razorpay_webhook_secret: e.target.value })}
              placeholder="Webhook secret configured in your Razorpay Dashboard"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#c5a059] focus:outline-none font-mono"
            />
          </div>

          {/* Test Connection Probe Button */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection || !settings.razorpay_key_id || !settings.razorpay_key_secret}
                className="px-4 py-2 rounded border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {testingConnection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
                    <span>Verifying with Razorpay API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Test Razorpay Connection</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-neutral-500">
                Pings Razorpay directly to test whether your Key ID & Secret are authentic.
              </span>
            </div>

            {testResult && (
              <div className={`mt-3 p-3 rounded text-xs flex items-start gap-2.5 animate-in fade-in ${
                testResult.success 
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300" 
                  : "bg-red-500/15 border border-red-500/40 text-red-300"
              }`}>
                {testResult.success ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
