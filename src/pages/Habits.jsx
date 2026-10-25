import { useMemo, useState } from 'react'
import { Archive, ListChecks, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/LoadingSkeleton'
import HabitManageCard from '../components/habits/HabitManageCard'
import HabitFormModal from '../components/habits/HabitFormModal'

export default function Habits() {
  const { habits, addHabit, updateHabit, setHabitArchived, deleteHabit, dataLoading } = useApp()
  const loading = dataLoading
  const [tab, setTab] = useState('active')
  const [modal, setModal] = useState({ open: false, habit: null })

  const active = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const archived = useMemo(() => habits.filter((h) => h.archived), [habits])
  const visible = tab === 'active' ? active : archived

  const openCreate = () => setModal({ open: true, habit: null })
  const openEdit = (habit) => setModal({ open: true, habit })
  const closeModal = () => setModal((m) => ({ ...m, open: false }))

  const handleSubmit = (data) => {
    if (modal.habit) updateHabit(modal.habit.id, data)
    else addHabit(data)
    closeModal()
  }

  const tabs = [
    { id: 'active', label: 'Active', count: active.length },
    { id: 'archived', label: 'Archived', count: archived.length },
  ]

  return (
    <div>
      <PageHeader
        title="Habits"
        subtitle="Build routines that stick."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            New habit
          </Button>
        }
      />

      <div className="mb-5 inline-flex rounded-lg border border-base bg-surface p-1" role="group" aria-label="Habit filter">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
              tab === t.id ? 'bg-surface-3 text-base-color' : 'text-muted-color hover:text-base-color'
            }`}
          >
            {t.label} <span className="ml-1 text-xs text-subtle-color">{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={6} className="h-48" containerClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
      ) : visible.length === 0 ? (
        tab === 'active' ? (
          <EmptyState
            icon={ListChecks}
            title="No active habits"
            message="Create a habit to start tracking your daily progress."
            ctaLabel="Create a habit"
            onCta={openCreate}
          />
        ) : (
          <EmptyState icon={Archive} title="Nothing archived" message="Habits you archive will show up here so you can restore them later." />
        )
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((habit) => (
            <li key={habit.id}>
              <HabitManageCard
                habit={habit}
                onEdit={openEdit}
                onArchive={(id) => setHabitArchived(id, true)}
                onRestore={(id) => setHabitArchived(id, false)}
                onDelete={deleteHabit}
              />
            </li>
          ))}
        </ul>
      )}

      <HabitFormModal open={modal.open} habit={modal.habit} onClose={closeModal} onSubmit={handleSubmit} />
    </div>
  )
}
