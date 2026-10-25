import { AlertCircle, CheckCircle2 } from 'lucide-react'

const STYLES = {
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

/** Form-level message. Renders nothing when `message` is empty. */
export default function FormAlert({ message = '', variant = 'error', className = '' }) {
  if (!message) return null

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${STYLES[variant] ?? STYLES.error} ${className}`}
    >
      {variant === 'success' ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      )}
      <span>{message}</span>
    </div>
  )
}
