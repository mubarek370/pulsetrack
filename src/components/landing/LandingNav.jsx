import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'
import CtaLink from './CtaLink'
import ThemeToggle from '../ui/ThemeToggle'

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
]

export default function LandingNav() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-base bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="PulseTrack home" className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-color transition-colors duration-150 hover:text-base-color">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <CtaLink to="/app" size="sm">Open app</CtaLink>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-color transition-colors hover:text-base-color">
                Log in
              </Link>
              <CtaLink to="/signup" size="sm">Get started</CtaLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
