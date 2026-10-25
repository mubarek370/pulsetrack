import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Flame, Timer, Weight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import HabitList from '../components/habits/HabitList'
import ActivityHeatmap from '../components/charts/ActivityHeatmap'
import { daysAgoKey } from '../utils/dates'
import { formatWeight } from '../utils/units'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const percentChange = (current, previous) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100)

const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0)

export default function Dashboard() {
  const { habits, workouts, heatmap, profile, units, toggleHabit, dataLoading } = useApp()
  const navigate = useNavigate()
  const loading = dataLoading

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const completed = activeHabits.filter((h) => h.completedToday).length

  const stats = useMemo(() => {
    const thisWeek = workouts.filter((w) => w.date >= daysAgoKey(6))
    const lastWeek = workouts.filter((w) => w.date >= daysAgoKey(13) && w.date <= daysAgoKey(7))
    return {
      count: thisWeek.length,
      countTrend: percentChange(thisWeek.length, lastWeek.length),
      minutes: sum(thisWeek, (w) => w.duration),
      minutesTrend: percentChange(sum(thisWeek, (w) => w.duration), sum(lastWeek, (w) => w.duration)),
      volume: sum(thisWeek, (w) => w.volume),
      volumeTrend: percentChange(sum(thisWeek, (w) => w.volume), sum(lastWeek, (w) => w.volume)),
      calories: sum(thisWeek, (w) => w.calories),
      caloriesTrend: percentChange(sum(thisWeek, (w) => w.calories), sum(lastWeek, (w) => w.calories)),
    }
  }, [workouts])

  const activeDays = heatmap.filter((d) => d.count > 0).length
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${getGreeting()}, ${profile.name.split(' ')[0]}`}
        subtitle={today}
        action={
          <p className="rounded-full border border-base bg-surface px-3 py-1.5 text-sm text-muted-color">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{completed}</span> of {activeHabits.length} habits done
          </p>
        }
      />

      <section aria-labelledby="today-habits">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="today-habits" className="text-base font-semibold text-base-color">Today&apos;s habits</h2>
          {activeHabits.length > 0 && (
            <div
              role="progressbar"
              aria-label="Habits completed today"
              aria-valuemin={0}
              aria-valuemax={activeHabits.length}
              aria-valuenow={completed}
              className="flex w-24 gap-1"
            >
              {activeHabits.map((h) => (
                <span
                  key={h.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    h.completedToday ? 'bg-indigo-500' : 'bg-surface-3'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <HabitList
          habits={activeHabits}
          onToggle={toggleHabit}
          loading={loading}
          onCreate={() => navigate('/app/habits')}
        />
      </section>

      <section aria-labelledby="week-summary">
        <h2 id="week-summary" className="mb-3 text-base font-semibold text-base-color">This week</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Dumbbell} label="Workouts" value={stats.count} trend={stats.countTrend} loading={loading} />
          <StatCard icon={Timer} label="Active minutes" value={stats.minutes} trend={stats.minutesTrend} loading={loading} />
          <StatCard icon={Weight} label="Volume lifted" value={formatWeight(stats.volume, units)} trend={stats.volumeTrend} loading={loading} />
          <StatCard icon={Flame} label="Calories burned" value={stats.calories.toLocaleString()} trend={stats.caloriesTrend} loading={loading} />
        </div>
      </section>

      <section aria-labelledby="activity" className="rounded-2xl border border-base bg-surface p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-1">
          <h2 id="activity" className="text-base font-semibold text-base-color">Activity</h2>
          <p className="text-xs text-subtle-color">{activeDays} active days in the last year</p>
        </div>
        <ActivityHeatmap data={heatmap} loading={loading} />
      </section>
    </div>
  )
}
