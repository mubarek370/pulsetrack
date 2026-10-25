import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { useApp } from '../../context/AppContext'

/**
 * Generic responsive bar chart (used for weekly volume and habit completion).
 * data rows may include an optional `fill` hex to color individual bars.
 */
export default function VolumeChart({
  data = [],
  xKey = 'week',
  yKey = 'volume',
  seriesName = 'Volume',
  color = '#6366f1',
  unit = '',
  yDomain = ['auto', 'auto'],
  ariaLabel = 'Bar chart',
}) {
  const { theme } = useApp()
  const isDark = theme === 'dark'

  const gridStroke = isDark ? '#27272a' : '#e2e8f0'
  const axisStroke = isDark ? '#3f3f46' : '#cbd5e1'
  const tickFill = isDark ? '#a1a1aa' : '#64748b'

  return (
    <div role="img" aria-label={ariaLabel} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: tickFill, fontSize: 12 }} stroke={axisStroke} tickLine={false} />
          <YAxis tick={{ fill: tickFill, fontSize: 12 }} stroke={axisStroke} tickLine={false} domain={yDomain} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)' }} />
          <Bar dataKey={yKey} name={seriesName} fill={color} radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((row, i) => (
              <Cell key={`${row[xKey]}-${i}`} fill={row.fill ?? color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
