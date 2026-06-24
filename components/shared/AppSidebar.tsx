'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/app/dashboard',  icon: '🏠', label: 'Home' },
  { href: '/app/chat',       icon: '💬', label: 'Chat' },
  { href: '/app/memories',   icon: '📸', label: 'Memories' },
  { href: '/app/timeline',   icon: '📅', label: 'Timeline' },
  { href: '/app/journal',    icon: '📓', label: 'Journal' },
  { href: '/app/milestones', icon: '🎉', label: 'Milestones' },
]

export default function AppSidebar({ user }: { user: { email: string; name?: string } }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const displayName = user.name || user.email?.split('@')[0] || 'you'
  const initial = displayName[0]?.toUpperCase() ?? 'U'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <svg width="28" height="28" viewBox="0 0 56 56" fill="none" className="text-primary shrink-0">
            <path d="M28 48s-20-12.6-20-26a12 12 0 0 1 20-9 12 12 0 0 1 20 9c0 13.4-20 26-20 26z" fill="currentColor" opacity="0.15"/>
            <path d="M28 46s-18-11.6-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12.4-18 24-18 24z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <circle cx="21" cy="24" r="2.5" fill="currentColor" opacity="0.6"/>
            <circle cx="35" cy="24" r="2.5" fill="currentColor" opacity="0.6"/>
          </svg>
          <span className="font-semibold text-sm text-foreground tracking-tight">Loveshudaa</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-semibold shrink-0">
              {initial}
            </div>
            <span className="text-xs text-muted-foreground truncate">{displayName}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <span className="text-base">🚪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-border flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
