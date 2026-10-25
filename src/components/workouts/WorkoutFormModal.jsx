import { useMemo, useState } from 'react'
import { Dumbbell, Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'
import { WORKOUT_TYPES } from '../../data/mockData'
import { todayKey } from '../../utils/dates'
import { useApp } from '../../context/AppContext'

const EXERCISE_SUGGESTIONS = [
  'Bench Press',
  'Incline Dumbbell Press',
  'Barbell Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-ups',
  'Lat Pulldown',
  'Dumbbell Bicep Curl',
  'Tricep Pushdown',
  'Leg Press',
  'Hamstring Curl',
  'Lateral Raises',
]

function WorkoutForm({ workout, onSubmit, onCancel }) {
  const { units = 'kg' } = useApp()

  const [name, setName] = useState(workout?.name ?? '')
  const [type, setType] = useState(workout?.type ?? WORKOUT_TYPES[0])
  const [date, setDate] = useState(workout?.date ?? todayKey())
  const [duration, setDuration] = useState(workout ? String(workout.duration) : '45')
  const [calories, setCalories] = useState(workout?.calories ? String(workout.calories) : '')
  const [notes, setNotes] = useState(workout?.notes ?? '')

  // Interactive Exercises State
  const [exercises, setExercises] = useState(
    Array.isArray(workout?.exercises) && workout.exercises.length > 0
      ? workout.exercises.map((e) => ({
          name: e.name || '',
          sets: e.sets ?? 3,
          reps: e.reps ?? 10,
          weight: e.weight ?? 0,
        }))
      : [],
  )

  // Real-time calculated volume (sets × reps × weight)
  const totalVolume = useMemo(() => {
    return exercises.reduce((acc, ex) => {
      const s = Number(ex.sets) || 0
      const r = Number(ex.reps) || 0
      const w = Number(ex.weight) || 0
      return acc + s * r * w
    }, 0)
  }, [exercises])

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: '', sets: 3, reps: 10, weight: 60 },
    ])
  }

  const handleUpdateExercise = (index, field, value) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    )
  }

  const handleRemoveExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    const cleanedExercises = exercises
      .filter((ex) => ex.name && ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: Math.max(1, Number(ex.sets) || 1),
        reps: Math.max(1, Number(ex.reps) || 1),
        weight: Math.max(0, Number(ex.weight) || 0),
      }))

    onSubmit({
      name: trimmed,
      type,
      date,
      duration: Number(duration) || 0,
      calories: Number(calories) || 0,
      exercises: cleanedExercises,
      volume: totalVolume > 0 ? totalVolume : Number(workout?.volume) || 0,
      notes: notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <datalist id="exercise-suggestions">
        {EXERCISE_SUGGESTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <div>
        <label htmlFor="workout-name" className={labelClass}>
          Workout Name
        </label>
        <input
          id="workout-name"
          type="text"
          required
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push Day Heavy"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="workout-type" className={labelClass}>
            Type
          </label>
          <select
            id="workout-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            {WORKOUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="workout-date" className={labelClass}>
            Date
          </label>
          <input
            id="workout-date"
            type="date"
            required
            max={todayKey()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="workout-duration" className={labelClass}>
            Duration (min)
          </label>
          <input
            id="workout-duration"
            type="number"
            required
            min={1}
            max={600}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="workout-calories" className={labelClass}>
            Calories (optional)
          </label>
          <input
            id="workout-calories"
            type="number"
            min={0}
            max={5000}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="kcal"
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Exercise Builder Section ── */}
      <div className="rounded-xl border border-base bg-surface-2/40 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-4 text-indigo-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-base-color">Exercises</span>
            {totalVolume > 0 && (
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                Total: {totalVolume.toLocaleString()} {units}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddExercise}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add exercise
          </button>
        </div>

        {exercises.length === 0 ? (
          <p className="text-xs text-muted-color py-1">
            No specific exercises added yet. Click &quot;Add exercise&quot; to log sets, reps, and weights.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {exercises.map((ex, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-base bg-surface p-2 transition"
              >
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    required
                    list="exercise-suggestions"
                    placeholder="Exercise (e.g. Bench Press)"
                    value={ex.name}
                    onChange={(e) => handleUpdateExercise(index, 'name', e.target.value)}
                    className="w-full rounded border border-base bg-transparent px-2 py-1 text-xs text-base-color focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min={1}
                      max={99}
                      value={ex.sets}
                      onChange={(e) => handleUpdateExercise(index, 'sets', e.target.value)}
                      title="Sets"
                      className="w-12 rounded border border-base bg-transparent px-1.5 py-1 text-center text-xs text-base-color focus:border-indigo-500 focus:outline-none"
                    />
                    <span className="text-xs text-muted-color">sets</span>
                  </div>

                  <span className="text-xs text-muted-color">×</span>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min={1}
                      max={999}
                      value={ex.reps}
                      onChange={(e) => handleUpdateExercise(index, 'reps', e.target.value)}
                      title="Reps"
                      className="w-12 rounded border border-base bg-transparent px-1.5 py-1 text-center text-xs text-base-color focus:border-indigo-500 focus:outline-none"
                    />
                    <span className="text-xs text-muted-color">reps</span>
                  </div>

                  <span className="text-xs text-muted-color">@</span>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min={0}
                      max={9999}
                      step={0.5}
                      value={ex.weight}
                      onChange={(e) => handleUpdateExercise(index, 'weight', e.target.value)}
                      title={`Weight (${units})`}
                      className="w-14 rounded border border-base bg-transparent px-1.5 py-1 text-center text-xs text-base-color focus:border-indigo-500 focus:outline-none"
                    />
                    <span className="text-xs text-muted-color">{units}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    aria-label="Remove exercise"
                    className="rounded p-1 text-muted-color hover:bg-rose-500/10 hover:text-rose-500 transition"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="workout-notes" className={labelClass}>
          Notes (optional)
        </label>
        <textarea
          id="workout-notes"
          rows={2}
          maxLength={300}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Felt strong on bench, increased weight on final set..."
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{workout ? 'Save changes' : 'Log workout'}</Button>
      </div>
    </form>
  )
}

export default function WorkoutFormModal({ open, workout = null, onClose, onSubmit }) {
  return (
    <Modal open={open} title={workout ? 'Edit workout' : 'Log workout'} onClose={onClose}>
      <WorkoutForm key={workout?.id ?? 'new'} workout={workout} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  )
}
