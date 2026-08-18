"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";

type Method = "email" | "phone";

export default function SignupPage() {
  const [method, setMethod] = useState<Method>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  function readableError(error: unknown): string {
    if (error && typeof error === "object") {
      const anyError = error as { message?: string; msg?: string; error_description?: string };
      const message = anyError.message || anyError.msg || anyError.error_description;
      if (message) return message;
    }
    return "Something went wrong. Please try again.";
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (method === "email") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
        if (error) { setError(readableError(error)); setLoading(false); }
        else { setSuccess(true); setLoading(false); }
        return;
      }

      // Phone signup sends an SMS OTP; the account isn't confirmed until
      // the code is verified below.
      const { error } = await supabase.auth.signUp({ phone, password, options: { data: { display_name: name } } });
      if (error) { setError(readableError(error)); setLoading(false); }
      else { setAwaitingOtp(true); setLoading(false); }
    } catch (error) {
      setError(readableError(error));
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) { setError(readableError(error)); setLoading(false); }
      else { setSuccess(true); setLoading(false); }
    } catch (error) {
      setError(readableError(error));
      setLoading(false);
    }
  }

  if (success) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-xl font-semibold mb-2">
          {method === "email" ? "Check your email" : "You're all set"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {method === "email"
            ? <>Confirmation sent to <span className="text-foreground font-medium">{email}</span></>
            : <>Your account is ready.</>}
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">Back to login →</Link>
      </div>
    </main>
  );

  if (awaitingOtp) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold mb-1">Verify your phone</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter the code sent to <span className="text-foreground font-medium">{phone}</span></p>
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-sm font-medium">Verification code</label>
              <input id="otp" type="text" inputMode="numeric" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-center tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-ring transition"/>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-1">
              {loading ? "Verifying..." : "Verify →"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground/50 mt-8">Inspired by Aditi Didi ❤️</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-3">
          <svg width="44" height="44" viewBox="0 0 56 56" fill="none" className="text-primary">
            <path d="M28 48s-20-12.6-20-26a12 12 0 0 1 20-9 12 12 0 0 1 20 9c0 13.4-20 26-20 26z" fill="currentColor" opacity="0.15"/>
            <path d="M28 46s-18-11.6-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12.4-18 24-18 24z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <circle cx="21" cy="24" r="2.5" fill="currentColor" opacity="0.6"/>
            <circle cx="35" cy="24" r="2.5" fill="currentColor" opacity="0.6"/>
          </svg>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Loveshudaa</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start your private universe 🌹</p>

          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMethod("email"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                method === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setMethod("phone"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                method === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">Your name</label>
              <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bhavya" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
            </div>
            {method === "email" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium">Phone number</label>
                <input id="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+919876543210" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
                <p className="text-xs text-muted-foreground">Include your country code, e.g. +91 for India</p>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-1">
              {loading ? "Creating..." : "Create account →"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
        <p className="text-center text-xs text-muted-foreground/50 mt-8">Inspired by Aditi Didi ❤️</p>
      </div>
    </main>
  );
}
