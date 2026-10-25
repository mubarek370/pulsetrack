import { CalendarDays, Dumbbell, Flame, TrendingUp } from 'lucide-react'

export const LANDING_FEATURES = [
  {
    id: 'habits',
    icon: Flame,
    title: 'Streaks that keep you honest',
    description:
      'Check in with one big tap. Watch your current streak grow and see your longest run for a little extra motivation.',
    points: ['One-tap, instant check-ins', 'Current and longest streaks', 'Custom colors and icons'],
    accent: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  },
  {
    id: 'workouts',
    icon: Dumbbell,
    title: 'A workout log that stays out of your way',
    description:
      'Log strength, cardio, and mobility sessions in seconds, with duration, calories, and volume tracked for you.',
    points: ['Strength, Cardio, and Mobility tags', 'Filter your history by type', 'Switch between kg and lbs'],
    accent: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  },
  {
    id: 'progress',
    icon: TrendingUp,
    title: 'Progress you can actually see',
    description:
      'Line charts for your big lifts, plus weekly volume and habit completion, so trends are obvious at a glance.',
    points: ['Bench, squat, and deadlift trends', 'Weekly training volume', '30-day habit completion'],
    accent: { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  },
  {
    id: 'heatmap',
    icon: CalendarDays,
    title: 'A year of effort, one glance',
    description:
      'A GitHub-style heatmap turns every active day into a small win and makes consistency easy to spot.',
    points: ['52 weeks of activity', 'Four shades of intensity', 'Hover any day for details'],
    accent: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  },
]

export const LANDING_STEPS = [
  {
    title: 'Pick your habits',
    description: 'Start with a few small daily actions: water, a run, reading, meditation, the gym.',
  },
  {
    title: 'Check in every day',
    description: 'One tap marks a habit done and keeps your streak alive. Log workouts as you finish them.',
  },
  {
    title: 'Watch it compound',
    description: 'Charts and the activity heatmap show how small days add up to real progress.',
  },
]

export const LANDING_FACTS = [
  { value: '365', label: 'days of activity in one view' },
  { value: '3', label: 'workout types to log' },
  { value: '2', label: 'unit systems: kg and lbs' },
  { value: '1 tap', label: 'to check in a habit' },
]
