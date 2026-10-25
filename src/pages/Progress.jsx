import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import ProgressChart from '../components/charts/ProgressChart'
import VolumeChart from '../components/charts/VolumeChart'
import { EXERCISE_SERIES, HABIT_COLORS, exerciseProgress, weeklyVolume as fallbackWeeklyVolume } from '../data/mockData'
import { convertWeight } from '../utils/units'

function ChartCard({ id, title, subtitle, loading, skeletonHeight, children }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-base bg-surface p-4 sm:p-5">
      <h2 id={id} className="text-base font-semibold text-base-color">{title}</h2>
      <p className="mb-4 mt-0.5 text-xs text-muted-color">{subtitle}</p>
      {loading ? <LoadingSkeleton className={`${skeletonHeight} w-full`} /> : children}
    </section>
  )
}

export default function Progress() {
  const { habits, workouts, units, dataLoading } = useApp()
  const loading = dataLoading

  const progressData = useMemo(
    () =>
      exerciseProgress.map((row) => ({
        week: row.week,
        ...Object.fromEntries(EXERCISE_SERIES.map((s) => [s.key, convertWeight(row[s.key], units)])),
      })),
    [units],
  )

  // Compute weekly volume from real logged workouts if available, fallback to sample data if empty
  const volumeData = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return fallbackWeeklyVolume.map((row) => ({
        week: row.week,
        volume: convertWeight(row.volume, units),
      }))
    }

    // Build last 8 weeks buckets
    const weeks = []
    const now = new Date()
    for (let w = 7; w >= 0; w -= 1) {
      const end = new Date(now)
      end.setDate(now.getDate() - w * 7)
      const start = new Date(end)
      start.setDate(end.getDate() - 6)
      weeks.push({
        label: `Wk ${8 - w}`,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        volume: 0,
      })
    }

    workouts.forEach((workout) => {
      if (!workout.date || !workout.volume) return
      const targetWeek = weeks.find((wk) => workout.date >= wk.startDate && workout.date <= wk.endDate)
      if (targetWeek) {
        targetWeek.volume += Number(workout.volume) || 0
      }
    })

    return weeks.map((w) => ({
      week: w.label,
      volume: convertWeight(w.volume, units),
    }))
  }, [workouts, units])

  const completionData = useMemo(
    () =>
      habits
        .filter((h) => !h.archived)
        .map((h) => ({
          name: h.short ?? h.name.split(' ')[0],
          rate: h.completionRate,
          fill: HABIT_COLORS[h.color]?.hex ?? '#6366f1',
        })),
    [habits],
  )

  return (
    <div>
      <PageHeader title="Progress" subtitle="Your last 8 weeks at a glance." />

      <div className="space-y-4">
        <ChartCard id="lifts" title="Exercise progress" subtitle={`Top set weight (${units}) per week`} loading={loading} skeletonHeight="h-72">
          <ProgressChart data={progressData} series={EXERCISE_SERIES} unit={units} />
        </ChartCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard id="completion" title="Habit completion rate" subtitle="Share of days completed in the last 30 days" loading={loading} skeletonHeight="h-64">
            <VolumeChart
              data={completionData}
              xKey="name"
              yKey="rate"
              seriesName="Completion"
              unit="%"
              yDomain={[0, 100]}
              ariaLabel="Bar chart of 30-day habit completion rate per habit"
            />
          </ChartCard>

          <ChartCard id="volume" title="Weekly volume" subtitle={`Total weight lifted (${units}) per week`} loading={loading} skeletonHeight="h-64">
            <VolumeChart
              data={volumeData}
              xKey="week"
              yKey="volume"
              seriesName="Volume"
              unit={units}
              color="#a855f7"
              ariaLabel="Bar chart of weekly training volume over 8 weeks"
            />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
