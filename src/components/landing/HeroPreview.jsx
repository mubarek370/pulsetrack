import { useState } from 'react'
import HabitCheckInCard from '../habits/HabitCheckInCard'
import ActivityHeatmap from '../charts/ActivityHeatmap'
import { heatmapData, initialHabits } from '../../data/mockData'

const PREVIEW_HABITS = initialHabits.slice(0, 3).map((h) => ({ ...h, completedToday: h.id === 'h1' }))
const PREVIEW_HEATMAP = heatmapData.slice(-133)

/** Interactive mini-dashboard. Uses its own local state, so the real app data is untouched. */
export default function HeroPreview() {
  const [habits, setHabits] = useState(PREVIEW_HABITS)
  const doneCount = habits.filter((h) => h.completedToday).length

  const handleToggle = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = !h.completedToday
        const currentStreak = done ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1)
        return {
          ...h,
          completedToday: done,
          currentStreak,
          longestStreak: Math.max(h.longestStreak, currentStreak),
        }
      }),
    )
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl shadow-indigo-500/10">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-100">Today</p>
            <p role="status" aria-live="polite" className="text-xs text-zinc-400">
              {doneCount} of {habits.length} done
            </p>
          </div>

          <ul aria-label="Try checking in a habit" className="space-y-3">
            {habits.map((habit) => (
              <li key={habit.id}>
                <HabitCheckInCard habit={habit} onToggle={handleToggle} />
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-3 text-xs font-medium text-zinc-400">Your last 19 weeks</p>
            <ActivityHeatmap data={PREVIEW_HEATMAP} />
          </div>
        </div>
      </div>
    </div>
  )
}
