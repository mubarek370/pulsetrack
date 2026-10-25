import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import LoadingSkeleton from './LoadingSkeleton'

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend = null,
  trendLabel = 'vs last week',
  loading = false,
}) {
  if (loading) {
    return (
      <div aria-busy="true" aria-label={`Loading ${label}`} className="rounded-2xl border border-base bg-surface p-4">
        <LoadingSkeleton className="mb-4 size-9" />
        <LoadingSkeleton className="mb-2 h-3 w-20" />
        <LoadingSkeleton className="h-6 w-24" />
      </div>
    )
  }

  const TrendIcon = trend === null || trend === 0 ? Minus : trend > 0 ? ArrowUpRight : ArrowDownRight
  const trendColor =
    trend === null || trend === 0 ? 'text-subtle-color' : trend > 0 ? 'text-emerald-500' : 'text-rose-500'

  return (
    <article
      aria-label={label}
      className="rounded-2xl border border-base bg-surface p-4 transition-colors duration-200 hover:border-strong"
    >
      <span className="mb-4 flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
        {Icon && <Icon className="size-5" aria-hidden="true" />}
      </span>
      <p className="text-xs font-medium text-muted-color">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-base-color">{value}</p>
      {trend !== null && (
        <p className={`mt-2 flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="size-3.5" aria-hidden="true" />
          <span>
            {trend > 0 ? '+' : ''}
            {trend}% <span className="text-subtle-color">{trendLabel}</span>
          </span>
        </p>
      )}
    </article>
  )
}
