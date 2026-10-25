import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import StreakBadge from './StreakBadge'
import HabitIcon from './HabitIcon'
import Button from '../ui/Button'
import { HABIT_COLORS } from '../../data/mockData'

export default function HabitManageCard({ habit, onEdit, onArchive, onRestore, onDelete }) {
  const palette = HABIT_COLORS[habit.color] ?? HABIT_COLORS.indigo
  const filled = Math.round(habit.completionRate / 10)

  return (
    <article
      aria-label={habit.name}
      className={`overflow-hidden rounded-2xl border border-base bg-surface transition-colors duration-200 hover:border-strong ${
        habit.archived ? 'opacity-70' : ''
      }`}
    >
      <div className={`h-1.5 ${palette.swatch}`} aria-hidden="true" />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${palette.softBg} ${palette.text}`}>
            <HabitIcon icon={habit.icon} className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-base-color">{habit.name}</h3>
            <div className="mt-1.5">
              <StreakBadge streak={habit.currentStreak} longest={habit.longestStreak} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-color">
            <span>30-day completion</span>
            <span>{habit.completionRate}%</span>
          </div>
          <div
            role="progressbar"
            aria-label={`${habit.name} 30-day completion`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={habit.completionRate}
            className="flex gap-1"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < filled ? palette.swatch : 'bg-surface-2'}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {habit.archived ? (
            <>
              <Button variant="secondary" onClick={() => onRestore(habit.id)} aria-label={`Restore ${habit.name}`} className="flex-1">
                <ArchiveRestore className="size-4" aria-hidden="true" />
                Restore
              </Button>
              {onDelete && (
                <Button variant="ghost" onClick={() => onDelete(habit.id)} aria-label={`Delete ${habit.name}`} className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => onEdit(habit)} aria-label={`Edit ${habit.name}`} className="flex-1">
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Button>
              <Button variant="ghost" onClick={() => onArchive(habit.id)} aria-label={`Archive ${habit.name}`}>
                <Archive className="size-4" aria-hidden="true" />
                Archive
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
