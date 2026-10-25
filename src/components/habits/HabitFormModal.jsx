import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'
import { HABIT_COLORS, HABIT_ICONS } from '../../data/mockData'

// Rendered inside <Modal>, so it remounts (fresh state) every time the dialog opens.
function HabitForm({ habit, onSubmit, onCancel }) {
  const [name, setName] = useState(habit?.name ?? '')
  const [color, setColor] = useState(habit?.color ?? 'indigo')
  const [icon, setIcon] = useState(habit?.icon ?? 'droplets')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({ name: trimmed, color, icon })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="habit-name" className={labelClass}>Name</label>
        <input
          id="habit-name"
          type="text"
          required
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Stretch for 10 minutes"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>Color</legend>
        <div className="flex flex-wrap gap-3">
          {Object.entries(HABIT_COLORS).map(([key, palette]) => (
            <label key={key} className="relative cursor-pointer">
              <input
                type="radio"
                name="habit-color"
                value={key}
                checked={color === key}
                onChange={() => setColor(key)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`block size-8 rounded-full ${palette.swatch} ring-2 ring-transparent ring-offset-2 ring-offset-base transition peer-checked:ring-indigo-500 peer-focus-visible:ring-indigo-300`}
              />
              <span className="sr-only">{palette.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Icon</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(HABIT_ICONS).map(([key, Icon]) => (
            <label key={key} className="relative cursor-pointer">
              <input
                type="radio"
                name="habit-icon"
                value={key}
                checked={icon === key}
                onChange={() => setIcon(key)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-lg border border-base bg-surface text-muted-color transition peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-300 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300 hover:border-strong hover:text-base-color"
              >
                <Icon className="size-5" />
              </span>
              <span className="sr-only">{key}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{habit ? 'Save changes' : 'Create habit'}</Button>
      </div>
    </form>
  )
}

/** habit: habit to edit, or null to create. onSubmit({ name, color, icon }). */
export default function HabitFormModal({ open, habit = null, onClose, onSubmit }) {
  return (
    <Modal open={open} title={habit ? 'Edit habit' : 'New habit'} onClose={onClose}>
      <HabitForm habit={habit} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  )
}
