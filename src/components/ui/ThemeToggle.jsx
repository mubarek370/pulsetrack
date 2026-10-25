import { Moon, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'

/**
 * Sun/Moon toggle button.
 * size: "sm" (default) | "md"
 */
export default function ThemeToggle({ size = 'sm', className = '' }) {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  const iconSize = size === 'md' ? 'size-5' : 'size-4'
  const btnSize = size === 'md' ? 'size-10' : 'size-8'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center rounded-lg border transition-colors duration-200
        border-base bg-surface hover:bg-surface-2 text-muted-color hover:text-base-color
        ${btnSize} ${className}`}
    >
      {isDark
        ? <Sun className={iconSize} aria-hidden="true" />
        : <Moon className={iconSize} aria-hidden="true" />
      }
    </button>
  )
}
