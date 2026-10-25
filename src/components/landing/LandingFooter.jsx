import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'

export default function LandingFooter() {
  const { user } = useAuth()

  return (
    <footer className="border-t border-base bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <Logo />

        <nav aria-label="Footer" className="flex gap-6 text-sm text-muted-color">
          <a href="#features" className="transition-colors hover:text-base-color">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-base-color">How it works</a>
          <Link to={user ? '/app' : '/login'} className="transition-colors hover:text-base-color">
            {user ? 'Open app' : 'Log in'}
          </Link>
        </nav>

        <p className="text-xs text-subtle-color">
          © {new Date().getFullYear()} PulseTrack. Built with React, Tailwind, and Recharts.
        </p>
      </div>
    </footer>
  )
}
