import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/40 blur-[100px]" />
      </div>

      {/* Logo mark */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          aria-label="Loveshudaa"
          className="text-primary"
        >
          <path
            d="M28 48s-20-12.6-20-26a12 12 0 0 1 20-9 12 12 0 0 1 20 9c0 13.4-20 26-20 26z"
            fill="currentColor"
            opacity="0.15"
          />
          <path
            d="M28 46s-18-11.6-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12.4-18 24-18 24z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="21" cy="24" r="2.5" fill="currentColor" opacity="0.6" />
          <circle cx="35" cy="24" r="2.5" fill="currentColor" opacity="0.6" />
        </svg>
        <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
          Loveshudaa
        </span>
      </div>

      {/* Hero */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-2xl">
        Made for Two.{" "}
        <span className="text-primary">Built with Love.</span>
      </h1>

      <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
        Your private universe — memories, messages, milestones, and moments.
        Just the two of you.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Enter our space →
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* Feature pills */}
      <div className="mt-14 flex flex-wrap justify-center gap-2 max-w-lg">
        {[
          "💬 Private Chat",
          "📸 Memories Gallery",
          "📅 Timeline",
          "📓 Shared Journal",
          "🎉 Milestones",
          "🔒 Just Us Two",
        ].map((f) => (
          <span
            key={f}
            className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Dedication */}
      <p className="mt-16 text-xs text-muted-foreground/60 tracking-wide">
        Inspired by Aditi Didi ❤️
      </p>
    </main>
  );
}
