import { useEffect, useState } from 'react'

/** Returns true for `delay` ms, then false. Simulates an async data fetch. */
export default function useSimulatedLoading(delay = 600) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return loading
}
