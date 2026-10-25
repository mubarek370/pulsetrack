import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { useApp } from '../../context/AppContext'

/** data: rows keyed by `xKey`; series: [{ key, label, color }]. */
export default function ProgressChart({ data = [], series = [], xKey = 'week', unit = 'kg' }) {
  const { theme } = useApp()
  const isDark = theme === 'dark'

  const gridStroke = isDark ? '#27272a' : '#e2e8f0'
  const axisStroke = isDark ? '#3f3f46' : '#cbd5e1'
  const tickFill = isDark ? '#a1a1aa' : '#64748b'
  const cursorStroke = isDark ? '#52525b' : '#94a3b8'

  return (
    <div>
      <div
        role="img"
        aria-label={`Line chart of ${series.map((s) => s.label).join(', ')} progress over ${data.length} weeks`}
        className="h-72 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: tickFill, fontSize: 12 }} stroke={axisStroke} tickLine={false} />
            <YAxis tick={{ fill: tickFill, fontSize: 12 }} stroke={axisStroke} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: cursorStroke }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: s.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-muted-color" aria-label="Chart legend">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <svg className="size-2.5" viewBox="0 0 10 10" aria-hidden="true">
              <circle cx="5" cy="5" r="5" fill={s.color} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
