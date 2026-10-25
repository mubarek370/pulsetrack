import { Check, Circle } from 'lucide-react'
import { PASSWORD_RULES, getPasswordStrength } from '../../utils/validation'

const SEGMENT_COLORS = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400']

/** Live strength bar + requirement checklist. */
export default function PasswordStrength({ password = '' }) {
  const { score, label } = getPasswordStrength(password)

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((segment) => (
            <span
              key={segment}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                segment <= score ? SEGMENT_COLORS[score] : 'bg-surface-2'
              }`}
            />
          ))}
        </div>
        <p role="status" aria-live="polite" className="w-12 text-right text-xs text-muted-color">{label}</p>
      </div>

      <ul aria-label="Password requirements" className="grid gap-1.5 text-xs sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password)
          return (
            <li key={rule.id} className={`flex items-center gap-1.5 transition-colors ${met ? 'text-emerald-500' : 'text-subtle-color'}`}>
              {met ? <Check className="size-3.5" aria-hidden="true" /> : <Circle className="size-3.5" aria-hidden="true" />}
              <span>{rule.label}</span>
              <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
