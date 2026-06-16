"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  }

  if (success) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground">Confirmation sent to <span className="text-foreground font-medium">{email}</span></p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">Back to login →</Link>
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
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">Your name</label>
              <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bhavya" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"/>
            </div>
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
