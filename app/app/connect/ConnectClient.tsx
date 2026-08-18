'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConnectClient({ inviteCode, userId }: { inviteCode: string; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'share' | 'join'>('share')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleJoin() {
    setLoading(true)
    setError('')
    const trimmed = code.trim().toUpperCase()

    // Runs the whole find-partner + create-couple + link-both-profiles
    // sequence atomically in the database (see migration 003), so two
    // people can't both connect to the same code at once and a user who
    // already has a partner can't join a second one.
    const { data, error: rpcError } = await supabase
      .rpc('connect_partner', { p_invite_code: trimmed })
      .single()

    if (rpcError || !data) {
      setError(rpcError?.message || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const partnerName = data.partner_display_name || 'your partner'
    router.push(`/app/dashboard?connected=${encodeURIComponent(partnerName)}`)
    router.refresh()
  }

  function copyCode() {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <span className="text-2xl">🌹</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Connect with your partner</h1>
          <p className="text-sm text-muted-foreground mt-1">Share your invite code or enter theirs</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('share')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'share' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Share my code
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'join' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Enter partner's code
          </button>
        </div>

        {tab === 'share' ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">Send this code to your partner</p>
            <div className="bg-muted rounded-xl px-6 py-4 mb-4">
              <p className="text-3xl font-bold tracking-[0.2em] text-foreground font-mono">{inviteCode}</p>
            </div>
            <button
              onClick={copyCode}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? '✅ Copied!' : 'Copy invite code'}
            </button>
            <p className="text-xs text-muted-foreground mt-4">Ask them to enter this code on their end</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-4">Enter your partner's invite code</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB12CD34"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-center text-xl font-mono tracking-[0.2em] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            {error && <p className="text-sm text-destructive mb-3 text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading || code.length < 6}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect 💕'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
