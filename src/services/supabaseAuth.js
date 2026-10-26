import { supabase } from '../lib/supabaseClient'

export async function supabaseSignUp({ name, email, password }) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) throw error

  const user = data.user
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || name,
    createdAt: user.created_at,
    hasSession: Boolean(data.session),
  }
}

export async function supabaseSignIn({ email, password }) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  const user = data.user
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0],
    createdAt: user.created_at,
  }
}

export async function supabaseSignOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function supabaseGetSessionUser() {
  if (!supabase) return null
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const user = session.user
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0],
    createdAt: user.created_at,
  }
}

export async function supabaseUpdateProfile(userId, { name, email, units, timezone, theme, avatar_url }) {
  if (!supabase) throw new Error('Supabase is not configured.')

  // Update auth metadata or email if changed
  const authUpdates = {}
  if (name) authUpdates.data = { name }
  if (email) authUpdates.email = email
  if (Object.keys(authUpdates).length > 0) {
    await supabase.auth.updateUser(authUpdates)
  }

  // Update profile table
  const updates = { updated_at: new Date().toISOString() }
  if (name !== undefined) updates.name = name
  if (units !== undefined) updates.units = units
  if (timezone !== undefined) updates.timezone = timezone
  if (theme !== undefined) updates.theme = theme
  if (avatar_url !== undefined) updates.avatar_url = avatar_url

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function supabaseResetPassword(email) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function supabaseUpdatePassword(newPassword) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
