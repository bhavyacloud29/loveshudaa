import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: memoriesCount } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true });

  const { count: milestonesCount } = await supabase
    .from("milestones")
    .select("*", { count: "exact", head: true });

  const { count: journalCount } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true });

  const name = profile?.display_name ?? user.email?.split("@")[0] ?? "Love";

  const stats = [
    { label: "Memories", value: memoriesCount ?? 0, icon: "📸" },
    { label: "Milestones", value: milestonesCount ?? 0, icon: "🎉" },
    { label: "Journal entries", value: journalCount ?? 0, icon: "📓" },
  ];

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto pb-24 md:pb-8">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Hey, {name} 🌹
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to your private universe.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-2xl">{s.icon}</span>
            <span className="text-2xl font-semibold text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/app/chat",      icon: "💬", title: "Send a message",    desc: "Chat with your love" },
            { href: "/app/memories",  icon: "📸", title: "Add a memory",      desc: "Upload a photo or video" },
            { href: "/app/timeline",  icon: "📅", title: "Add to timeline",   desc: "Mark a special moment" },
            { href: "/app/journal",   icon: "📓", title: "Write in journal",  desc: "Share your thoughts" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Dedication */}
      <p className="text-xs text-muted-foreground/40 text-center mt-12">
        Inspired by Aditi Didi ❤️
      </p>
    </div>
  );
}
