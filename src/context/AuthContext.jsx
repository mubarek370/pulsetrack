import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import {
  supabaseSignIn,
  supabaseSignOut,
  supabaseSignUp,
  supabaseUpdateProfile,
} from '../services/supabaseAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(isSupabaseConfigured && supabase))

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined
    }

    // 1. Initial session check directly from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.email?.split('@')[0],
          createdAt: u.created_at,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // 2. Real-time auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.email?.split('@')[0],
          createdAt: u.created_at,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    const created = await supabaseSignUp({ name, email, password })
    if (created.hasSession) {
      setUser(created)
    }
    return created
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const found = await supabaseSignIn({ email, password })
    setUser(found)
    return found
  }, [])

  const logout = useCallback(async () => {
    await supabaseSignOut()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async ({ name, email }) => {
      if (user) {
        await supabaseUpdateProfile(user.id, { name, email })
        setUser((prev) => ({ ...prev, name, email }))
        return { ...user, name, email }
      }
      return null
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, loading, isSupabaseConfigured, signup, login, logout, updateProfile }),
    [user, loading, signup, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
