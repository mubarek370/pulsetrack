import { useId } from 'react'

/** 🔥 + current streak. Tooltip (hover or keyboard focus) shows the longest streak. */
export default function StreakBadge({ streak = 0, longest = 0 }) {
  const tooltipId = useId()
  const active = streak > 0

  return (
    <button
      type="button"
      aria-describedby={tooltipId}
      aria-label={`${streak} day streak`}
      className={`group relative inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${
        active ? 'bg-orange-500/10 text-orange-600 dark:text-orange-300' : 'bg-surface-2 text-subtle-color'
      }`}
    >
      <span aria-hidden="true" className={active ? '' : 'opacity-40 grayscale'}>🔥</span>
      <span aria-hidden="true">{streak}</span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-base bg-surface-2 px-2.5 py-1 text-xs font-normal text-base-color opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
      >
        Longest streak: {longest} {longest === 1 ? 'day' : 'days'}
      </span>
    </button>
  )
}
