import {
  Apple, BookOpen, Brain, Droplets, Dumbbell, Footprints, Heart, Moon, Target,
} from 'lucide-react'
import { daysAgoKey } from '../utils/dates'

/* ---------- Habit styling (full class names so Tailwind can detect them) ---------- */
export const HABIT_COLORS = {
  indigo: {
    label: 'Indigo', hex: '#6366f1', swatch: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400',
    softBg: 'bg-indigo-500/10', borderSoft: 'border-indigo-500/30',
    solid: 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30',
    outline: 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10',
  },
  emerald: {
    label: 'Emerald', hex: '#10b981', swatch: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400',
    softBg: 'bg-emerald-500/10', borderSoft: 'border-emerald-500/30',
    solid: 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    outline: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10',
  },
  amber: {
    label: 'Amber', hex: '#f59e0b', swatch: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400',
    softBg: 'bg-amber-500/10', borderSoft: 'border-amber-500/30',
    solid: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    outline: 'border-amber-500/40 text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-500/10',
  },
  rose: {
    label: 'Rose', hex: '#f43f5e', swatch: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400',
    softBg: 'bg-rose-500/10', borderSoft: 'border-rose-500/30',
    solid: 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    outline: 'border-rose-500/40 text-rose-600 dark:text-rose-400 hover:border-rose-500 hover:bg-rose-500/10',
  },
  sky: {
    label: 'Sky', hex: '#0ea5e9', swatch: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400',
    softBg: 'bg-sky-500/10', borderSoft: 'border-sky-500/30',
    solid: 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30',
    outline: 'border-sky-500/40 text-sky-600 dark:text-sky-400 hover:border-sky-500 hover:bg-sky-500/10',
  },
  violet: {
    label: 'Violet', hex: '#a855f7', swatch: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400',
    softBg: 'bg-violet-500/10', borderSoft: 'border-violet-500/30',
    solid: 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    outline: 'border-violet-500/40 text-violet-600 dark:text-violet-400 hover:border-violet-500 hover:bg-violet-500/10',
  },
}

export const HABIT_ICONS = {
  droplets: Droplets,
  footprints: Footprints,
  book: BookOpen,
  brain: Brain,
  dumbbell: Dumbbell,
  heart: Heart,
  moon: Moon,
  apple: Apple,
}

export function getHabitIcon(key) {
  return HABIT_ICONS[key] ?? Target
}

/* ---------- Habits ---------- */
export const initialHabits = [
  { id: 'h1', name: 'Drink 8 glasses of water', short: 'Water', color: 'sky', icon: 'droplets', currentStreak: 12, longestStreak: 21, completedToday: true, archived: false, completionRate: 87 },
  { id: 'h2', name: 'Morning run', short: 'Run', color: 'emerald', icon: 'footprints', currentStreak: 5, longestStreak: 14, completedToday: false, archived: false, completionRate: 63 },
  { id: 'h3', name: 'Read 30 mins', short: 'Read', color: 'amber', icon: 'book', currentStreak: 8, longestStreak: 30, completedToday: true, archived: false, completionRate: 93 },
  { id: 'h4', name: 'Meditate', short: 'Meditate', color: 'violet', icon: 'brain', currentStreak: 3, longestStreak: 9, completedToday: false, archived: false, completionRate: 50 },
  { id: 'h5', name: 'Gym', short: 'Gym', color: 'rose', icon: 'dumbbell', currentStreak: 4, longestStreak: 11, completedToday: false, archived: false, completionRate: 70 },
]

/* ---------- Workouts ---------- */
export const WORKOUT_TYPES = ['Strength', 'Cardio', 'Mobility']

const computeVolume = (exercises) =>
  exercises.reduce((sum, e) => sum + e.sets * e.reps * e.weight, 0)

const makeWorkout = (id, name, type, daysAgo, duration, calories, exercises = [], notes = '') => ({
  id, name, type, date: daysAgoKey(daysAgo), duration, calories, exercises, notes,
  volume: computeVolume(exercises),
})

export const initialWorkouts = [
  makeWorkout('w1', 'Upper Body Push', 'Strength', 1, 62, 410, [
    { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
    { name: 'Overhead Press', sets: 3, reps: 10, weight: 45 },
    { name: 'Incline DB Press', sets: 3, reps: 12, weight: 26 },
  ]),
  makeWorkout('w2', 'Morning 5K Run', 'Cardio', 2, 28, 320, [], '5.0 km at a 5:36/km pace'),
  makeWorkout('w3', 'Mobility Flow', 'Mobility', 3, 25, 90, [], 'Hips, thoracic spine, and hamstrings'),
  makeWorkout('w4', 'Leg Day', 'Strength', 4, 70, 480, [
    { name: 'Squat', sets: 5, reps: 5, weight: 100 },
    { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 90 },
    { name: 'Leg Press', sets: 3, reps: 12, weight: 160 },
  ]),
  makeWorkout('w5', 'Interval Run', 'Cardio', 6, 35, 410, [], '8 x 400m repeats with 90s rest'),
  makeWorkout('w6', 'Pull Day', 'Strength', 8, 65, 430, [
    { name: 'Deadlift', sets: 3, reps: 5, weight: 120 },
    { name: 'Barbell Row', sets: 4, reps: 8, weight: 70 },
    { name: 'Lat Pulldown', sets: 3, reps: 10, weight: 55 },
  ]),
  makeWorkout('w7', 'Hip & Spine Mobility', 'Mobility', 9, 20, 70, [], 'Slow flow and deep holds'),
  makeWorkout('w8', 'Upper Body Push', 'Strength', 11, 58, 390, [
    { name: 'Bench Press', sets: 4, reps: 8, weight: 77.5 },
    { name: 'Overhead Press', sets: 3, reps: 10, weight: 42.5 },
    { name: 'Triceps Pushdown', sets: 3, reps: 12, weight: 30 },
  ]),
  makeWorkout('w9', 'Long Run', 'Cardio', 14, 52, 580, [], '8.2 km easy pace'),
  makeWorkout('w10', 'Leg Day', 'Strength', 18, 68, 460, [
    { name: 'Squat', sets: 5, reps: 5, weight: 95 },
    { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 85 },
    { name: 'Walking Lunges', sets: 3, reps: 12, weight: 20 },
  ]),
]

/* ---------- Exercise progress (kg) ---------- */
export const EXERCISE_SERIES = [
  { key: 'bench', label: 'Bench Press', color: '#6366f1' },
  { key: 'squat', label: 'Squat', color: '#a855f7' },
  { key: 'deadlift', label: 'Deadlift', color: '#22d3ee' },
]

export const exerciseProgress = [
  { week: 'Wk 1', bench: 60, squat: 80, deadlift: 100 },
  { week: 'Wk 2', bench: 62.5, squat: 85, deadlift: 105 },
  { week: 'Wk 3', bench: 65, squat: 87.5, deadlift: 110 },
  { week: 'Wk 4', bench: 67.5, squat: 90, deadlift: 112.5 },
  { week: 'Wk 5', bench: 70, squat: 95, deadlift: 120 },
  { week: 'Wk 6', bench: 72.5, squat: 100, deadlift: 125 },
  { week: 'Wk 7', bench: 75, squat: 102.5, deadlift: 130 },
  { week: 'Wk 8', bench: 80, squat: 105, deadlift: 135 },
]

/* ---------- Weekly volume (kg) ---------- */
export const weeklyVolume = [
  { week: 'Wk 1', volume: 8200 },
  { week: 'Wk 2', volume: 9400 },
  { week: 'Wk 3', volume: 8800 },
  { week: 'Wk 4', volume: 10500 },
  { week: 'Wk 5', volume: 11200 },
  { week: 'Wk 6', volume: 9800 },
  { week: 'Wk 7', volume: 12100 },
  { week: 'Wk 8', volume: 13400 },
]

/* ---------- Heatmap: 365 days, seeded so it is stable between reloads ---------- */
function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateHeatmapData() {
  const rng = mulberry32(42)
  const days = []
  for (let i = 364; i >= 0; i -= 1) {
    days.push({ date: daysAgoKey(i), count: Math.floor(rng() * 5) })
  }
  return days
}

export const heatmapData = generateHeatmapData()

/* ---------- Profile & settings ---------- */
export const defaultProfile = { name: 'Alex Morgan', email: 'alex@pulsetrack.app' }

export const TIMEZONES = [
  'UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
  'America/Sao_Paulo', 'Europe/London', 'Europe/Berlin', 'Africa/Addis_Ababa',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
]
