import { Link } from 'react-router-dom'
import { CalendarDays, Flame, TrendingUp } from 'lucide-react'
import Logo from '../ui/Logo'

/** Split-screen shell for Login and Signup. `footer` is an optional node (e.g. a switch-page link). */
export default function AuthLayout({ title, subtitle = '', footer = null, children }) {
  return (
    <div className="grid min-h-dvh bg-base lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-base bg-surface p-12 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_60%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 size-96 rounded-full bg-purple-500/10 blur-3xl" />

        <Link to="/" aria-label="PulseTrack home" className="relative w-fit rounded-lg">
          <Logo />
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-base-color">Small check-ins. Big momentum.</h2>
          <ul className="mt-8 space-y-4 text-sm text-muted-color">
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                <Flame className="size-4" aria-hidden="true" />
              </span>
              Streaks that keep you consistent
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <TrendingUp className="size-4" aria-hidden="true" />
              </span>
              Charts that show your progress
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              A year of activity at a glance
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-subtle-color">© {new Date().getFullYear()} PulseTrack</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link to="/" aria-label="PulseTrack home" className="mb-8 inline-block rounded-lg lg:hidden">
            <Logo />
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-base-color">{title}</h1>
          {subtitle && <p className="mb-6 mt-1.5 text-sm text-muted-color">{subtitle}</p>}

          {children}

          {footer && <p className="mt-6 text-center text-sm text-muted-color">{footer}</p>}
        </div>
      </main>
    </div>
  )
}
