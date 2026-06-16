import AppSidebar from "@/components/shared/AppSidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar user={{ email: "test@test.com" }} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
