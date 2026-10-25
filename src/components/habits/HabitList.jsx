import { ListChecks } from 'lucide-react'
import HabitCheckInCard from './HabitCheckInCard'
import EmptyState from '../ui/EmptyState'
import { CardSkeleton } from '../ui/LoadingSkeleton'

/** habits: array, onToggle(id), loading: bool, onCreate: optional CTA handler. */
export default function HabitList({ habits = [], onToggle, loading = false, onCreate = null }) {
  if (loading) {
    return <CardSkeleton count={5} className="h-[88px]" containerClassName="grid gap-3 lg:grid-cols-2" />
  }

  if (!habits.length) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No habits yet"
        message="Create your first habit to start building streaks."
        ctaLabel="Create a habit"
        onCta={onCreate}
      />
    )
  }

  return (
    <ul aria-label="Today's habits" className="grid gap-3 lg:grid-cols-2">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCheckInCard habit={habit} onToggle={onToggle} />
        </li>
      ))}
    </ul>
  )
}
