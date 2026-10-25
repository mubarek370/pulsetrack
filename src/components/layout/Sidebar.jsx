import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { NAV_ITEMS } from './navItems'
import Logo from '../ui/Logo'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

export default function Sidebar() {
  const { profile } = useApp()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    navigate('/')
    logout()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-base bg-base px-4 py-6 md:flex">
      <Link to="/" aria-label="PulseTrack home" className="mb-8 rounded-lg px-2">
        <Logo />
      </Link>

      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-300'
                  : 'text-muted-color hover:bg-surface-2 hover:text-base-color'
              }`
            }
          >
            <Icon className="size-[18px]" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle + profile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-subtle-color">Appearance</span>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-base bg-surface p-3">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-base"
            />
          ) : (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-500 dark:text-indigo-300"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-base-color">{profile.name}</p>
            <p className="truncate text-xs text-subtle-color">{profile.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="rounded-lg p-2 text-subtle-color transition-colors hover:bg-surface-2 hover:text-base-color"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}
