export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppSidebar from '@/components/shared/AppSidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar user={{ email: user.email ?? '', name: profile?.display_name ?? '' }} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
