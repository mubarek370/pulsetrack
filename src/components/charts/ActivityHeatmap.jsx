import { useEffect, useMemo, useRef } from 'react'
import LoadingSkeleton from '../ui/LoadingSkeleton'
import { formatDate, parseDateKey } from '../../utils/dates'

const SHADES = [
  'bg-slate-100 dark:bg-zinc-800/80',   // 0 — no activity
  'bg-indigo-200 dark:bg-indigo-900',   // 1
  'bg-indigo-400 dark:bg-indigo-700',   // 2
  'bg-indigo-500 dark:bg-indigo-500',   // 3
  'bg-indigo-700 dark:bg-indigo-300',   // 4
]
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** data: [{ date: 'YYYY-MM-DD', count: 0-4 }] in ascending order. */
export default function ActivityHeatmap({ data = [], loading = false }) {
  const scrollRef = useRef(null)

  const weeks = useMemo(() => {
    if (!data.length) return []
    const lead = parseDateKey(data[0].date).getDay()
    const cells = [...Array(lead).fill(null), ...data]
    const columns = []
    for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7))
    return columns
  }, [data])

  const monthLabels = useMemo(() => {
    let last = -1
    const labels = weeks.map((week) => {
      const first = week.find(Boolean)
      const month = first ? parseDateKey(first.date).getMonth() : -1
      if (month !== -1 && month !== last) {
        last = month
        return MONTHS[month]
      }
      return ''
    })
    if (labels[0] && labels[1]) labels[0] = ''
    return labels
  }, [weeks])

  // Start scrolled to the most recent week on narrow screens.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [weeks, loading])

  if (loading) return <LoadingSkeleton className="h-36 w-full" />

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col gap-1 pt-5 text-[10px] text-subtle-color" aria-hidden="true">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="flex h-3 items-center">{label}</span>
          ))}
        </div>

        <div ref={scrollRef} className="scrollbar-thin overflow-x-auto pb-2">
          <div
            role="img"
            aria-label={`Activity heatmap for the last 12 months: ${total} activities in total`}
            className="w-max"
          >
            <div className="mb-1 flex gap-1" aria-hidden="true">
              {monthLabels.map((label, i) => (
                <span key={i} className="h-4 w-3 shrink-0 whitespace-nowrap text-[10px] leading-4 text-subtle-color">
                  {label}
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) =>
                    day ? (
                      <div
                        key={day.date}
                        title={`${day.count} ${day.count === 1 ? 'activity' : 'activities'} on ${formatDate(day.date, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        className={`size-3 rounded-[3px] transition-transform duration-150 hover:scale-125 ${SHADES[Math.min(day.count, SHADES.length - 1)]}`}
                      />
                    ) : (
                      <div key={`pad-${di}`} className="size-3" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-subtle-color" aria-hidden="true">
        <span>Less</span>
        {SHADES.map((shade) => (
          <span key={shade} className={`size-3 rounded-[3px] ${shade}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
