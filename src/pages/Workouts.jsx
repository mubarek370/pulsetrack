import { useMemo, useState } from 'react'
import { Dumbbell, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/LoadingSkeleton'
import WorkoutCard from '../components/workouts/WorkoutCard'
import WorkoutFormModal from '../components/workouts/WorkoutFormModal'
import { WORKOUT_TYPES } from '../data/mockData'

const FILTERS = ['All', ...WORKOUT_TYPES]

export default function Workouts() {
  const {
    workouts,
    units,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    dataLoading,
    workoutsHasMore,
    workoutsLoadingMore,
    loadMoreWorkouts,
  } = useApp()
  const loading = dataLoading
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)

  const visible = useMemo(
    () => (filter === 'All' ? workouts : workouts.filter((w) => w.type === filter)),
    [workouts, filter],
  )

  const handleSubmit = (workout) => {
    if (editingWorkout) {
      updateWorkout(editingWorkout.id, workout)
      setEditingWorkout(null)
    } else {
      addWorkout(workout)
    }
    setFormOpen(false)
  }

  const handleEdit = (workout) => {
    setEditingWorkout(workout)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingWorkout(null)
  }

  return (
    <div>
      <PageHeader
        title="Workouts"
        subtitle={`${workouts.length} sessions logged recently`}
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Log workout
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by workout type">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
              filter === f
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                : 'border-base bg-surface text-muted-color hover:border-strong hover:text-base-color'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={5} className="h-36" containerClassName="grid gap-4 lg:grid-cols-2" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title={filter === 'All' ? 'No workouts yet' : `No ${filter.toLowerCase()} workouts`}
          message="Log a session to start building your history."
          ctaLabel="Log a workout"
          onCta={() => setFormOpen(true)}
        />
      ) : (
        <>
          <ul className="grid gap-4 lg:grid-cols-2">
            {visible.map((workout) => (
              <li key={workout.id}>
                <WorkoutCard
                  workout={workout}
                  units={units}
                  onEdit={handleEdit}
                  onDelete={deleteWorkout}
                />
              </li>
            ))}
          </ul>

          {workoutsHasMore && filter === 'All' && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="secondary"
                disabled={workoutsLoadingMore}
                onClick={loadMoreWorkouts}
              >
                {workoutsLoadingMore ? 'Loading more…' : 'Load more workouts'}
              </Button>
            </div>
          )}
        </>
      )}

      <WorkoutFormModal
        open={formOpen}
        workout={editingWorkout}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
