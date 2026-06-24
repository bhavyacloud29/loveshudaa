export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const name = profile?.display_name || user.email?.split('@')[0] || 'you'

  const quickLinks = [
    { href: '/app/chat',       icon: '💬', title: 'Chat',      desc: 'Message your love' },
    { href: '/app/memories',   icon: '📸', title: 'Memories',  desc: 'Your photo gallery' },
    { href: '/app/timeline',   icon: '📅', title: 'Timeline',  desc: 'Your story so far' },
    { href: '/app/journal',    icon: '📓', title: 'Journal',   desc: 'Write your thoughts' },
    { href: '/app/milestones', icon: '🎉', title: 'Milestones',desc: 'Celebrate moments' },
  ]

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Hey, {name} 🌹
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome to your private universe.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickLinks.map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
          >
            <span className="text-2xl block mb-3">{a.icon}</span>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/40 text-center mt-12">Inspired by Aditi Didi ❤️</p>
    </div>
  )
}
