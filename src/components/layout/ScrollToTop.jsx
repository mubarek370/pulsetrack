import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets scroll position when the route changes (e.g. landing CTA to app). */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
