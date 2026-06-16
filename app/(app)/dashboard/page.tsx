import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🌹</div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Logged in as <span className="text-foreground font-medium">{user.email}</span>
        </p>
        <p className="text-muted-foreground/50 text-xs mt-8">Dashboard coming soon...</p>
      </div>
    </main>
  );
}
