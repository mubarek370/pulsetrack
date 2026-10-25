const STYLES = {
  Strength: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-indigo-500/30',
  Cardio: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/30',
  Mobility: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30',
}

/** Colored pill for a workout type: "Strength" | "Cardio" | "Mobility". */
export default function WorkoutTypeTag({ type }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STYLES[type] ?? 'bg-surface-2 text-muted-color ring-base'
      }`}
    >
      {type}
    </span>
  )
}
