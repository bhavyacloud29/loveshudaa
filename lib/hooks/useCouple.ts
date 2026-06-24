'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CoupleContext {
  coupleId: string | null
  partnerId: string | null
  partnerName: string | null
  partnerAvatar: string | null
  loading: boolean
}

export function useCouple(): CoupleContext {
  const supabase = createClient()
  const [ctx, setCtx] = useState<CoupleContext>({
    coupleId: null,
    partnerId: null,
    partnerName: null,
    partnerAvatar: null,
    loading: true,
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setCtx(c => ({ ...c, loading: false }))

      const { data: profile } = await supabase
        .from('profiles')
        .select('couple_id, partner_id')
        .eq('id', user.id)
        .single()

      if (!profile?.partner_id) return setCtx(c => ({ ...c, loading: false }))

      const { data: partner } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', profile.partner_id)
        .single()

      setCtx({
        coupleId: profile.couple_id,
        partnerId: profile.partner_id,
        partnerName: partner?.display_name ?? null,
        partnerAvatar: partner?.avatar_url ?? null,
        loading: false,
      })
    }
    load()
  }, [])

  return ctx
}
