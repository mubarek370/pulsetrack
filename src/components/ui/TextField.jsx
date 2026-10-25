import { AlertCircle } from 'lucide-react'
import { labelClass } from './formStyles'

const BASE =
  'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-base-color placeholder:text-subtle-color transition-colors focus:outline-none focus:ring-2'

const VALID = 'border-base focus:border-indigo-500 focus:ring-indigo-500/40'
const INVALID = 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30'

/** Labeled input with accessible error/hint text. `icon` is a Lucide component, `trailing` an optional node. */
export default function TextField({ id, label, error = '', hint = '', icon: Icon = null, trailing = null, className = '', ...inputProps }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-color" aria-hidden="true" />
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${BASE} ${error ? INVALID : VALID} ${Icon ? 'pl-9' : ''} ${trailing ? 'pr-11' : ''}`}
          {...inputProps}
        />
        {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
      </div>
      {hint && !error && <p id={hintId} className="mt-1.5 text-xs text-subtle-color">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
