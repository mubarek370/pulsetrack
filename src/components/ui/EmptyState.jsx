import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  message = '',
  ctaLabel = '',
  onCta = null,
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-base bg-surface/50 px-6 py-12 text-center">
      <div className="relative mb-5 flex size-24 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-indigo-500/5" />
        <span className="absolute inset-3 rounded-full bg-indigo-500/10" />
        <span className="relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
          <Icon className="size-6" />
        </span>
      </div>
      <h3 className="text-base font-semibold text-base-color">{title}</h3>
      {message && <p className="mt-1 max-w-xs text-sm text-muted-color">{message}</p>}
      {ctaLabel && onCta && (
        <Button onClick={onCta} className="mt-5">{ctaLabel}</Button>
      )}
    </div>
  )
}
