import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400',
  secondary: 'border border-base bg-surface text-base-color hover:border-strong hover:bg-surface-2',
  ghost: 'text-muted-color hover:bg-surface-2 hover:text-base-color',
}

/** variant: "primary" | "secondary" | "ghost". `loading` shows a spinner and disables the button. */
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  loading = false,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
