import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { accessService } from '../lib/access'

interface AuthContextValue {
  user: User | null
  loading: boolean
  allowed: boolean | null
  accessError: string
  configured: boolean
  signInWithDiscord: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [accessError, setAccessError] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return }
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true
    if (!session) { setAllowed(false); setAccessError(''); return () => { active = false } }
    setAllowed(null)
    setAccessError('')
    void accessService.isCurrentUserAllowed().then((nextAllowed) => {
      if (active) setAllowed(nextAllowed)
    }).catch(() => {
      if (active) { setAllowed(false); setAccessError('アクセス許可を確認できませんでした。管理者に連絡してください。') }
    })
    return () => { active = false }
  }, [session])

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    loading,
    allowed,
    accessError,
    configured: supabaseConfigured,
    signInWithDiscord: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}login`,
          scopes: 'identify email',
        },
      })
      if (error) throw error
    },
    signOut: async () => { const { error } = await supabase.auth.signOut(); if (error) throw error },
  }), [accessError, allowed, loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
