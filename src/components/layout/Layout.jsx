import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

import ErrorBoundary from '../ui/ErrorBoundary'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh bg-base md:pl-64">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-indigo-500 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar />

      <header className="sticky top-0 z-20 flex items-center border-b border-base bg-base/90 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/" aria-label="PulseTrack home" className="flex-1 rounded-lg">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8">
        <div key={pathname} className="animate-fade-up">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
