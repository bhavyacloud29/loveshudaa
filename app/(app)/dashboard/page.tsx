export default function DashboardPage() {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Hey, welcome 🌹
      </h1>
      <p className="text-muted-foreground text-sm">
        Your private universe is ready.
      </p>
      <div className="grid grid-cols-2 gap-3 mt-8">
        {[
          { href: "/app/chat",      icon: "💬", title: "Chat",      desc: "Message your love" },
          { href: "/app/memories",  icon: "📸", title: "Memories",  desc: "Your photo gallery" },
          { href: "/app/timeline",  icon: "📅", title: "Timeline",  desc: "Your story so far" },
          { href: "/app/journal",   icon: "📓", title: "Journal",   desc: "Write your thoughts" },
        ].map((a) => (
          <a key={a.href} href={a.href}
            className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors group">
            <span className="text-2xl block mb-2">{a.icon}</span>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground/40 text-center mt-12">Inspired by Aditi Didi ❤️</p>
    </div>
  );
}
