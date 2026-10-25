export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function daysAgoKey(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toDateKey(d)
}

export function parseDateKey(key) {
  return new Date(`${key}T12:00:00`)
}

export function formatDate(key, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return parseDateKey(key).toLocaleDateString(undefined, options)
}
