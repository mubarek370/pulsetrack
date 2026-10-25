import { Dumbbell, LayoutDashboard, ListChecks, Settings, TrendingUp } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/habits', label: 'Habits', icon: ListChecks },
  { to: '/app/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]
