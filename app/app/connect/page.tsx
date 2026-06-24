export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ConnectClient from './ConnectClient'

export default async function ConnectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('invite_code, partner_id, display_name')
    .eq('id', user.id)
    .single()

  // Already connected → go to dashboard
  if (profile?.partner_id) redirect('/app/dashboard')

  return <ConnectClient inviteCode={profile?.invite_code ?? ''} userId={user.id} />
}
