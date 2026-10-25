import { useState } from 'react'
import { Check } from 'lucide-react'
import StreakBadge from './StreakBadge'
import HabitIcon from './HabitIcon'
import { HABIT_COLORS } from '../../data/mockData'

/** habit: habit object, onToggle(id): called immediately (optimistic). */
export default function HabitCheckInCard({ habit, onToggle }) {
  const [popping, setPopping] = useState(false)

  const palette = HABIT_COLORS[habit.color] ?? HABIT_COLORS.indigo
  const done = habit.completedToday

  const handleClick = () => {
    setPopping(true)
    onToggle(habit.id)
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-200 ${
        done ? `${palette.softBg} ${palette.borderSoft}` : 'border-base bg-surface hover:border-strong'
      }`}
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${palette.softBg} ${palette.text}`}>
        <HabitIcon icon={habit.icon} className="size-5" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium transition-colors ${
            done ? 'text-muted-color' : 'text-base-color'
          }`}
        >
          {habit.name}
        </p>
        <div className="mt-1.5">
          <StreakBadge streak={habit.currentStreak} longest={habit.longestStreak} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        onAnimationEnd={() => setPopping(false)}
        aria-pressed={done}
        aria-label={`${done ? 'Mark as not done' : 'Mark as done'}: ${habit.name}`}
        className={`group flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
          done ? palette.solid : palette.outline
        } ${popping ? 'animate-pop' : ''}`}
      >
        <Check
          aria-hidden="true"
          className={`size-6 transition-all duration-200 ${
            done ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:opacity-40'
          }`}
        />
      </button>
    </div>
  )
}
