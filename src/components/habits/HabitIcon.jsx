import { createElement } from 'react'
import { Target } from 'lucide-react'
import { HABIT_ICONS } from '../../data/mockData'

export default function HabitIcon({ icon, className = 'size-5', ...props }) {
  const IconComponent = HABIT_ICONS[icon] ?? Target
  return createElement(IconComponent, { className, ...props })
}
