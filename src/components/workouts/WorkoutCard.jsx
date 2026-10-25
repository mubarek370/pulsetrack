import { Clock, Dumbbell, Flame, HeartPulse, Pencil, PersonStanding, Trash2, Weight } from 'lucide-react'
import WorkoutTypeTag from './WorkoutTypeTag'
import { formatDate } from '../../utils/dates'
import { convertWeight, formatWeight } from '../../utils/units'

const TYPE_ICONS = { Strength: Dumbbell, Cardio: HeartPulse, Mobility: PersonStanding }

export default function WorkoutCard({ workout, units = 'kg', onEdit, onDelete }) {
  const Icon = TYPE_ICONS[workout.type] ?? Dumbbell

  return (
    <article
      aria-label={`${workout.name}, ${formatDate(workout.date)}`}
      className="group relative rounded-2xl border border-base bg-surface p-4 transition-colors duration-200 hover:border-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-base-color">{workout.name}</h3>
              <WorkoutTypeTag type={workout.type} />
            </div>
            <p className="mt-0.5 text-xs text-subtle-color">{formatDate(workout.date)}</p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-90 transition sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(workout)}
                className="rounded-lg p-1.5 text-muted-color hover:bg-surface-2 hover:text-base-color transition"
                aria-label={`Edit ${workout.name}`}
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${workout.name}"?`)) {
                    onDelete(workout.id)
                  }
                }}
                className="rounded-lg p-1.5 text-muted-color hover:bg-rose-500/10 hover:text-rose-500 transition"
                aria-label={`Delete ${workout.name}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-color">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          <dt className="sr-only">Duration</dt>
          <dd>{workout.duration} min</dd>
        </div>
        {workout.calories > 0 && (
          <div className="flex items-center gap-1.5">
            <Flame className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Calories</dt>
            <dd>{workout.calories} kcal</dd>
          </div>
        )}
        {workout.volume > 0 && (
          <div className="flex items-center gap-1.5">
            <Weight className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Total volume</dt>
            <dd>{formatWeight(workout.volume, units)}</dd>
          </div>
        )}
      </dl>

      {workout.exercises && workout.exercises.length > 0 && (
        <ul aria-label="Exercises" className="mt-4 flex flex-wrap gap-2">
          {workout.exercises.map((ex) => (
            <li key={ex.name} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-base-color">
              {ex.name} · {ex.sets}×{ex.reps} · {convertWeight(ex.weight, units)} {units}
            </li>
          ))}
        </ul>
      )}

      {workout.notes && <p className="mt-3 text-xs text-subtle-color">{workout.notes}</p>}
    </article>
  )
}
