export default function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-base bg-surface px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-base-color">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((item) => (
          <li key={item.dataKey ?? item.name} className="flex items-center gap-2 text-muted-color">
            <svg className="size-2" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill={item.color ?? item.payload?.fill ?? '#6366f1'} />
            </svg>
            <span>{item.name}:</span>
            <span className="font-semibold text-base-color">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              {unit && ` ${unit}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
