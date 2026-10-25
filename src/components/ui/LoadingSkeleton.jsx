export default function LoadingSkeleton({ className = 'h-4 w-full' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />
}

export function CardSkeleton({
  count = 3,
  className = 'h-24',
  containerClassName = 'grid gap-3',
}) {
  return (
    <div className={containerClassName} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <LoadingSkeleton key={i} className={`rounded-2xl ${className}`} />
      ))}
    </div>
  )
}
