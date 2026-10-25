import { supabase } from '../lib/supabaseClient'
import { todayKey } from '../utils/dates'

/**
 * Fetch all habits and their recent logs, computing completion rates and streaks.
 */
export async function fetchUserHabits(userId) {
  if (!supabase || !userId) return []

  const today = todayKey()

  const [habitsResult, logsResult] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
    supabase
      .from('habit_logs')
      .select('habit_id, date, completed')
      .eq('user_id', userId),
  ])

  if (habitsResult.error) throw habitsResult.error
  if (logsResult.error) throw logsResult.error

  const habits = habitsResult.data || []
  const logs = logsResult.data || []

  // Group logs by habit_id
  const logsByHabit = new Map()
  logs.forEach((log) => {
    if (!logsByHabit.has(log.habit_id)) {
      logsByHabit.set(log.habit_id, new Map())
    }
    logsByHabit.get(log.habit_id).set(log.date, log.completed)
  })

  return habits.map((h) => {
    const habitMap = logsByHabit.get(h.id) || new Map()
    const completedToday = Boolean(habitMap.get(today))

    // Calculate completion rate over the last 30 days
    let completedCount = 0
    let currentStreak = 0

    // Look back up to 30 days
    for (let i = 0; i < 30; i += 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      if (habitMap.get(dateStr)) {
        completedCount += 1
      }
    }

    // Calculate current streak backwards from today (or yesterday if today not done yet)
    let checkDate = new Date()
    if (!completedToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }
    while (habitMap.get(checkDate.toISOString().slice(0, 10))) {
      currentStreak += 1
      checkDate.setDate(checkDate.getDate() - 1)
    }

    const completionRate = Math.round((completedCount / 30) * 100)
    const longestStreak = Math.max(currentStreak, h.longest_streak || currentStreak)

    // Persist longest_streak to the DB if we detected a new record
    if (longestStreak > (h.longest_streak || 0)) {
      supabase.from('habits').update({ longest_streak: longestStreak }).eq('id', h.id)
        .then(({ error: updateErr }) => {
          if (updateErr) console.error('Failed to update longest_streak:', updateErr)
        })
    }

    return {
      id: h.id,
      name: h.name,
      color: h.color || 'indigo',
      icon: h.icon || 'target',
      archived: Boolean(h.archived),
      completedToday,
      currentStreak,
      longestStreak,
      completionRate,
    }
  })
}

export async function createHabitInDb(userId, { name, color, icon }) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name,
      color: color || 'indigo',
      icon: icon || 'target',
      archived: false,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    color: data.color,
    icon: data.icon,
    archived: false,
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
  }
}

export async function updateHabitInDb(id, changes) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase
    .from('habits')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleHabitLog(userId, habitId, completed) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const today = todayKey()

  const { error } = await supabase.from('habit_logs').upsert(
    {
      habit_id: habitId,
      user_id: userId,
      date: today,
      completed,
    },
    { onConflict: 'habit_id,date' },
  )

  if (error) throw error
}

export async function fetchUserWorkouts(userId, { limit = 20, offset = 0 } = {}) {
  if (!supabase || !userId) return { data: [], hasMore: false, totalCount: 0 }

  const { data, error, count } = await supabase
    .from('workouts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  const items = (data || []).map((w) => ({
    id: w.id,
    name: w.name || `${w.type || 'Workout'} Session`,
    date: w.date,
    type: w.type || 'Strength',
    duration: Number(w.duration) || 0,
    volume: Number(w.volume) || 0,
    calories: Number(w.calories) || 0,
    notes: w.notes || '',
    exercises: Array.isArray(w.exercises) ? w.exercises : [],
  }))

  const total = count ?? items.length
  return {
    data: items,
    hasMore: offset + items.length < total,
    totalCount: total,
  }
}

export async function createWorkoutInDb(userId, workout) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const payload = {
    user_id: userId,
    date: workout.date,
    type: workout.type,
    duration: Number(workout.duration) || 0,
    volume: Number(workout.volume) || 0,
    calories: Number(workout.calories) || 0,
    notes: workout.notes || '',
  }
  if (workout.name) payload.name = workout.name
  if (Array.isArray(workout.exercises)) payload.exercises = workout.exercises

  let data
  try {
    const res = await supabase.from('workouts').insert(payload).select().single()
    if (res.error) throw res.error
    data = res.data
  } catch (err) {
    const isColErr = err?.code === '42703' || err?.message?.includes('column')
    if (isColErr) {
      if (err?.message?.includes('name')) delete payload.name
      if (err?.message?.includes('exercises')) delete payload.exercises
      const retryRes = await supabase.from('workouts').insert(payload).select().single()
      if (retryRes.error) throw retryRes.error
      data = retryRes.data
    } else {
      throw err
    }
  }

  return {
    id: data.id,
    name: data.name || workout.name || `${data.type} Session`,
    date: data.date,
    type: data.type,
    duration: Number(data.duration) || 0,
    volume: Number(data.volume) || 0,
    calories: Number(data.calories) || 0,
    notes: data.notes || '',
    exercises: data.exercises || workout.exercises || [],
  }
}

export async function fetchUserProfile(userId) {
  if (!supabase || !userId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Aggregate heatmap data: count workouts + completed habits per day over the last year.
 */
export async function fetchHeatmapData(userId) {
  if (!supabase || !userId) return []

  const yearAgo = new Date()
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)
  const startDate = yearAgo.toISOString().slice(0, 10)

  const [workoutsResult, habitsResult] = await Promise.all([
    supabase
      .from('workouts')
      .select('date')
      .eq('user_id', userId)
      .gte('date', startDate),
    supabase
      .from('habit_logs')
      .select('date')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('date', startDate),
  ])

  if (workoutsResult.error) throw workoutsResult.error
  if (habitsResult.error) throw habitsResult.error

  const counts = new Map()
  ;(workoutsResult.data || []).forEach(({ date }) => counts.set(date, (counts.get(date) || 0) + 1))
  ;(habitsResult.data || []).forEach(({ date }) => counts.set(date, (counts.get(date) || 0) + 1))

  const days = []
  for (let i = 364; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    days.push({ date: dateStr, count: counts.get(dateStr) || 0 })
  }
  return days
}

export async function deleteHabitFromDb(id) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw error
}

export async function deleteWorkoutFromDb(id) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('workouts').delete().eq('id', id)
  if (error) throw error
}

export async function updateWorkoutInDb(id, changes) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const payload = { ...changes }
  delete payload.id

  let data
  try {
    const res = await supabase
      .from('workouts')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (res.error) throw res.error
    data = res.data
  } catch (err) {
    const isColErr = err?.code === '42703' || err?.message?.includes('column')
    if (isColErr) {
      if (err?.message?.includes('name')) delete payload.name
      if (err?.message?.includes('exercises')) delete payload.exercises
      const retryRes = await supabase
        .from('workouts')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (retryRes.error) throw retryRes.error
      data = retryRes.data
    } else {
      throw err
    }
  }

  return {
    id: data.id,
    name: data.name || changes.name || `${data.type} Session`,
    date: data.date,
    type: data.type,
    duration: Number(data.duration) || 0,
    volume: Number(data.volume) || 0,
    calories: Number(data.calories) || 0,
    notes: data.notes || '',
    exercises: data.exercises || changes.exercises || [],
  }
}
