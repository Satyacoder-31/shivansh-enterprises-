"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);

      if (data.session) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-carbon-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gold Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-carbon-800 border border-gold/30 rounded-xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <span className="text-gold text-2xl font-serif">S</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            SIVANSH <span className="text-gold">MANAGEMENT</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted mt-1">
            Executive CMS & Administration Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-500/40 text-red-300 rounded text-sm flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
              Administrator Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@sivanshenterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-carbon-900 border border-gold/25 rounded px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-gold transition-colors text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-muted font-medium">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-gold/80 hover:text-gold"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-carbon-900 border border-gold/25 rounded px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-gold transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-gold py-3 font-semibold tracking-wide text-sm mt-2"
          >
            {loading ? "Authenticating Session..." : "Sign In to Admin Portal"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold/10 text-center">
          <a
            href="/"
            className="text-xs text-muted hover:text-gold transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
