export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, partner_id, couple_id, invite_code')
    .eq('id', user.id)
    .single()

  let partnerName = null
  if (profile?.partner_id) {
    const { data: partner } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', profile.partner_id)
      .single()
    partnerName = partner?.display_name
  }

  const name = profile?.display_name || user.email?.split('@')[0] || 'you'
  const isConnected = !!profile?.partner_id

  const quickLinks = [
    { href: '/app/chat',       icon: '💬', title: 'Chat',       desc: 'Message your love' },
    { href: '/app/memories',   icon: '📸', title: 'Memories',   desc: 'Your photo gallery' },
    { href: '/app/timeline',   icon: '📅', title: 'Timeline',   desc: 'Your story so far' },
    { href: '/app/journal',    icon: '📓', title: 'Journal',    desc: 'Your private diary' },
    { href: '/app/milestones', icon: '🎉', title: 'Milestones', desc: 'Celebrate moments' },
  ]

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Hey, {name} 🌹
        </h1>
        {isConnected && partnerName ? (
          <p className="text-muted-foreground text-sm mt-1">You and {partnerName} — your private universe 💕</p>
        ) : (
          <p className="text-muted-foreground text-sm mt-1">Your private universe is ready.</p>
        )}
      </div>

      {/* Connect banner — always show if not connected */}
      {!isConnected && (
        <div className="mb-6 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-0.5">💕 Connect with your partner</p>
            <p className="text-xs text-muted-foreground">Share your invite code to start your shared space</p>
            {profile?.invite_code && (
              <p className="text-xs font-mono font-bold text-primary mt-1 tracking-widest">{profile.invite_code}</p>
            )}
          </div>
          <a
            href="/app/connect"
            className="shrink-0 text-xs bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors font-medium"
          >
            Connect →
          </a>
        </div>
      )}

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
