import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 hover:shadow-indigo-500/40',
  secondary: 'border border-base bg-surface text-base-color hover:border-strong hover:bg-surface-2',
}

const SIZES = {
  sm: 'px-3.5 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function CtaLink({ to = '', href = '', variant = 'primary', size = 'lg', className = '', children }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.98] ${SIZES[size]} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`

  if (to) {
    return <Link to={to} className={classes}>{children}</Link>
  }

  return <a href={href} className={classes}>{children}</a>
}
