import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultProfile, heatmapData as mockHeatmapData } from '../data/mockData'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { todayKey } from '../utils/dates'
import { supabaseUpdateProfile } from '../services/supabaseAuth'
import {
  createHabitInDb,
  createWorkoutInDb,
  deleteHabitFromDb,
  deleteWorkoutFromDb,
  fetchHeatmapData,
  fetchUserHabits,
  fetchUserProfile,
  fetchUserWorkouts,
  toggleHabitLog,
  updateHabitInDb,
  updateWorkoutInDb,
} from '../services/supabaseData'
import { removeAvatar, uploadAvatar } from '../services/supabaseStorage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()
  const { addToast } = useToast()

  // Cloud-backed application state (no localStorage)
  const [habits, setHabits] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [units, setUnitsState] = useState('kg')
  const [timezone, setTimezoneState] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  )
  const [theme, setThemeState] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )

  const [avatarUrl, setAvatarUrl] = useState(null)
  const [workoutsHasMore, setWorkoutsHasMore] = useState(false)
  const [workoutsLoadingMore, setWorkoutsLoadingMore] = useState(false)
  const [heatmap, setHeatmap] = useState(mockHeatmapData)
  const [dataLoading, setDataLoading] = useState(false)

  // Fetch from Supabase when user is signed in
  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) {
      return undefined
    }

    let isMounted = true

    async function loadRemoteData() {
      setDataLoading(true)
      try {
        const [h, wResult, prof, hm] = await Promise.all([
          fetchUserHabits(user.id),
          fetchUserWorkouts(user.id, { limit: 20, offset: 0 }),
          fetchUserProfile(user.id),
          fetchHeatmapData(user.id),
        ])

        if (!isMounted) return

        setHabits(h || [])
        const workoutList = Array.isArray(wResult) ? wResult : wResult.data
        setWorkouts(workoutList || [])
        setWorkoutsHasMore(Boolean(wResult?.hasMore))

        if (hm && hm.length > 0) setHeatmap(hm)
        if (prof?.units) setUnitsState(prof.units)
        if (prof?.timezone) setTimezoneState(prof.timezone)
        if (prof?.theme) setThemeState(prof.theme)
        if (prof?.avatar_url) setAvatarUrl(prof.avatar_url)
      } catch (err) {
        console.error('Failed to load data from Supabase:', err)
        addToast('Failed to load your data.', 'error')
      } finally {
        if (isMounted) setDataLoading(false)
      }
    }

    loadRemoteData()
    return () => { isMounted = false }
  }, [user?.id, addToast])

  // Sync theme to <html> class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // ── Settings sync: write to Supabase when changed ──────────────────

  const setUnits = useCallback(async (value) => {
    setUnitsState(value)
    if (isSupabaseConfigured && user?.id) {
      try {
        await supabaseUpdateProfile(user.id, { units: value })
      } catch (err) {
        console.error('Failed to sync units:', err)
        addToast('Failed to save unit preference.', 'error')
      }
    }
  }, [user, addToast])

  const setTimezone = useCallback(async (value) => {
    setTimezoneState(value)
    if (isSupabaseConfigured && user?.id) {
      try {
        await supabaseUpdateProfile(user.id, { timezone: value })
      } catch (err) {
        console.error('Failed to sync timezone:', err)
        addToast('Failed to save timezone preference.', 'error')
      }
    }
  }, [user, addToast])

  const setTheme = useCallback(async (value) => {
    setThemeState(value)
    if (isSupabaseConfigured && user?.id) {
      try {
        await supabaseUpdateProfile(user.id, { theme: value })
      } catch (err) {
        console.error('Failed to sync theme:', err)
        addToast('Failed to save theme preference.', 'error')
      }
    }
  }, [user, addToast])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [theme, setTheme])

  const profile = useMemo(
    () => ({
      name: user?.name ?? defaultProfile.name,
      email: user?.email ?? defaultProfile.email,
      avatarUrl,
    }),
    [user, avatarUrl],
  )

  const handleUploadAvatar = useCallback(
    async (file) => {
      if (!isSupabaseConfigured || !user?.id) {
        throw new Error('You must be signed in to upload a photo.')
      }
      try {
        const publicUrl = await uploadAvatar(user.id, file)
        setAvatarUrl(publicUrl)
        addToast('Profile photo updated!', 'success')
        return publicUrl
      } catch (err) {
        console.error('Failed to upload avatar:', err)
        addToast(err?.message || 'Failed to upload photo.', 'error')
        throw err
      }
    },
    [user, addToast],
  )

  const handleRemoveAvatar = useCallback(async () => {
    if (!isSupabaseConfigured || !user?.id) return
    try {
      await removeAvatar(user.id)
      setAvatarUrl(null)
      addToast('Profile photo removed.', 'info')
    } catch (err) {
      console.error('Failed to remove avatar:', err)
      addToast('Failed to remove photo.', 'error')
    }
  }, [user, addToast])

  // Optimistic habit toggle
  const toggleHabit = useCallback(async (id) => {
    let targetHabit
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        targetHabit = h
        const done = !h.completedToday
        const currentStreak = done ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1)
        const baseCount = h.completedCount ?? Math.round(((h.completionRate || 0) / 100) * 30)
        const newCompletedCount = Math.max(0, Math.min(30, baseCount + (done ? 1 : -1)))
        const newCompletionRate = Math.round((newCompletedCount / 30) * 100)
        return {
          ...h,
          completedToday: done,
          completedCount: newCompletedCount,
          completionRate: newCompletionRate,
          currentStreak,
          longestStreak: Math.max(h.longestStreak, currentStreak),
        }
      }),
    )

    const today = todayKey()
    setHeatmap((prev) => {
      const idx = prev.findIndex((d) => d.date === today)
      if (idx === -1) return prev
      const next = [...prev]
      const delta = !targetHabit?.completedToday ? 1 : -1
      next[idx] = {
        ...next[idx],
        count: Math.max(0, next[idx].count + delta),
      }
      return next
    })

    if (isSupabaseConfigured && user?.id && targetHabit) {
      try {
        await toggleHabitLog(user.id, id, !targetHabit.completedToday)
      } catch (err) {
        console.error('Failed to sync habit toggle with Supabase:', err)
        // Rollback state on error
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? targetHabit : h))
        )
        setHeatmap((prev) => {
          const idx = prev.findIndex((d) => d.date === today)
          if (idx === -1) return prev
          const next = [...prev]
          const delta = !targetHabit.completedToday ? -1 : 1
          next[idx] = {
            ...next[idx],
            count: Math.max(0, next[idx].count + delta),
          }
          return next
        })
        addToast('Failed to save habit check-in. Please try again.', 'error')
      }
    }
  }, [user, addToast])

  // Add habit
  const addHabit = useCallback(async ({ name, color, icon }) => {
    if (isSupabaseConfigured && user?.id) {
      try {
        const created = await createHabitInDb(user.id, { name, color, icon })
        setHabits((prev) => [...prev, created])
        addToast('Habit created!', 'success')
      } catch (err) {
        console.error('Failed to create habit in Supabase:', err)
        addToast('Failed to create habit. Please try again.', 'error')
      }
    }
  }, [user, addToast])

  // Update habit
  const updateHabit = useCallback(async (id, changes) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...changes } : h)))

    if (isSupabaseConfigured && user?.id) {
      try {
        await updateHabitInDb(id, changes)
      } catch (err) {
        console.error('Failed to update habit in Supabase:', err)
        addToast('Failed to update habit.', 'error')
      }
    }
  }, [user, addToast])

  // Archive / unarchive habit
  const setHabitArchived = useCallback(async (id, archived) => {
    updateHabit(id, { archived })
  }, [updateHabit])

  // Delete habit
  const deleteHabit = useCallback(async (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))

    if (isSupabaseConfigured && user?.id) {
      try {
        await deleteHabitFromDb(id)
        addToast('Habit deleted.', 'info')
      } catch (err) {
        console.error('Failed to delete habit:', err)
        addToast('Failed to delete habit.', 'error')
      }
    }
  }, [user, addToast])

  // Add workout
  const addWorkout = useCallback(async (workout) => {
    if (isSupabaseConfigured && user?.id) {
      try {
        const created = await createWorkoutInDb(user.id, workout)
        setWorkouts((prev) =>
          [created, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
        )
        addToast('Workout logged!', 'success')
      } catch (err) {
        console.error('Failed to create workout in Supabase:', err)
        addToast('Failed to log workout. Please try again.', 'error')
      }
    }
  }, [user, addToast])

  // Update workout
  const updateWorkout = useCallback(async (id, changes) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...changes } : w))
        .sort((a, b) => b.date.localeCompare(a.date)),
    )

    if (isSupabaseConfigured && user?.id) {
      try {
        await updateWorkoutInDb(id, changes)
      } catch (err) {
        console.error('Failed to update workout in Supabase:', err)
        addToast('Failed to update workout.', 'error')
      }
    }
  }, [user, addToast])

  // Delete workout
  const deleteWorkout = useCallback(async (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))

    if (isSupabaseConfigured && user?.id) {
      try {
        await deleteWorkoutFromDb(id)
        addToast('Workout deleted.', 'info')
      } catch (err) {
        console.error('Failed to delete workout:', err)
        addToast('Failed to delete workout.', 'error')
      }
    }
  }, [user, addToast])

  // Load more workouts (pagination)
  const loadMoreWorkouts = useCallback(async () => {
    if (!isSupabaseConfigured || !user?.id || workoutsLoadingMore || !workoutsHasMore) return
    setWorkoutsLoadingMore(true)
    try {
      const currentOffset = workouts.length
      const res = await fetchUserWorkouts(user.id, { limit: 20, offset: currentOffset })
      setWorkouts((prev) => [...prev, ...res.data])
      setWorkoutsHasMore(Boolean(res.hasMore))
    } catch (err) {
      console.error('Failed to load more workouts:', err)
      addToast('Failed to load more workouts.', 'error')
    } finally {
      setWorkoutsLoadingMore(false)
    }
  }, [user, workoutsLoadingMore, workoutsHasMore, workouts.length, addToast])

  const value = useMemo(
    () => ({
      habits, workouts, heatmap, profile, units, timezone, theme, dataLoading,
      workoutsHasMore, workoutsLoadingMore, loadMoreWorkouts,
      toggleHabit, addHabit, updateHabit, setHabitArchived, deleteHabit,
      addWorkout, updateWorkout, deleteWorkout,
      setUnits, setTimezone, setTheme, toggleTheme,
      uploadAvatar: handleUploadAvatar, removeAvatar: handleRemoveAvatar,
    }),
    [habits, workouts, heatmap, profile, units, timezone, theme, dataLoading,
     workoutsHasMore, workoutsLoadingMore, loadMoreWorkouts,
     toggleHabit, addHabit, updateHabit, setHabitArchived, deleteHabit,
     addWorkout, updateWorkout, deleteWorkout,
     setUnits, setTimezone, setTheme, toggleTheme,
     handleUploadAvatar, handleRemoveAvatar],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
