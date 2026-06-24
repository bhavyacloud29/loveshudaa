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

    // Find partner by invite code
    const { data: partner, error: findError } = await supabase
      .from('profiles')
      .select('id, partner_id')
      .eq('invite_code', trimmed)
      .single()

    if (findError || !partner) {
      setError('Invalid invite code. Please check and try again.')
      setLoading(false)
      return
    }

    if (partner.id === userId) {
      setError("That's your own code! Share it with your partner.")
      setLoading(false)
      return
    }

    if (partner.partner_id) {
      setError('This user is already connected to someone.')
      setLoading(false)
      return
    }

    // Create couple record
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({ user1_id: partner.id, user2_id: userId })
      .select('id')
      .single()

    if (coupleError || !couple) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Link both profiles
    await supabase.from('profiles').update({ partner_id: partner.id, couple_id: couple.id }).eq('id', userId)
    await supabase.from('profiles').update({ partner_id: userId, couple_id: couple.id }).eq('id', partner.id)

    router.push('/app/dashboard')
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
