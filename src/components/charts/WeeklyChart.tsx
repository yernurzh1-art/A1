import { useState } from 'react'
import { useElementWidth } from '@/hooks/useElementWidth'

export interface DayValue {
  label: string
  full: string
  value: number
  isToday?: boolean
}

function niceMax(v: number) {
  if (v <= 0) return 50
  const step = v <= 60 ? 20 : v <= 150 ? 50 : 100
  return Math.ceil((v * 1.1) / step) * step
}

/** Rounded-top column path, square at the baseline. */
function column(x: number, y: number, w: number, base: number) {
  const r = Math.min(4, (base - y) / 2, w / 2)
  if (base - y <= 0.5) return ''
  return `M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${base} Z`
}

/** XP per day for the last 7 days — single series, goal reference line, hover tooltips. */
export function WeeklyChart({ data, goal }: { data: DayValue[]; goal: number }) {
  const [ref, width] = useElementWidth<HTMLDivElement>(300)
  const [hover, setHover] = useState<number | null>(null)
  const height = 220
  const pad = { top: 18, right: 8, bottom: 28, left: 34 }
  const innerW = Math.max(100, width - pad.left - pad.right)
  const innerH = height - pad.top - pad.bottom
  const max = niceMax(Math.max(goal, ...data.map((d) => d.value)))
  const ticks = [0, max / 2, max]
  const band = innerW / data.length
  const barW = Math.min(24, band * 0.5)
  const y = (v: number) => pad.top + innerH - (v / max) * innerH
  const base = pad.top + innerH
  const maxIdx = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0)

  return (
    <div ref={ref} className="viz-root relative w-full min-w-0">
      <svg width={width} height={height} role="img" aria-label={`XP earned in the last 7 days: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--viz-grid)" strokeWidth={1} />
            <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--viz-muted)] text-[11px] font-semibold tabular-nums">
              {t}
            </text>
          </g>
        ))}
        {/* goal reference */}
        <line x1={pad.left} x2={width - pad.right} y1={y(goal)} y2={y(goal)} stroke="var(--viz-goal)" strokeWidth={1.5} />
        <text x={width - pad.right} y={y(goal) - 6} textAnchor="end" className="fill-[var(--viz-text)] text-[11px] font-bold">
          Goal {goal} XP
        </text>
        {data.map((d, i) => {
          const cx = pad.left + band * i + band / 2
          const x = cx - barW / 2
          const label = d.isToday || (i === maxIdx && d.value > 0)
          return (
            <g key={d.full} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${d.full}: ${d.value} XP`}>
              <rect x={pad.left + band * i} y={pad.top} width={band} height={innerH} fill="transparent" />
              <path d={column(x, y(d.value), barW, base)} fill="var(--viz-bar)" opacity={hover === null || hover === i ? 1 : 0.55} className="transition-opacity" />
              {label && d.value > 0 && (
                <text x={cx} y={y(d.value) - 6} textAnchor="middle" className="fill-[var(--viz-text)] text-[11px] font-bold tabular-nums">
                  {d.value}
                </text>
              )}
              <text x={cx} y={height - 8} textAnchor="middle" className={d.isToday ? 'fill-[var(--viz-text)] text-[11px] font-extrabold' : 'fill-[var(--viz-muted)] text-[11px] font-semibold'}>
                {d.isToday ? 'Today' : d.label}
              </text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lift"
          style={{ left: pad.left + band * hover + band / 2, top: Math.max(4, y(data[hover].value) - 10) }}
        >
          <div className="font-bold">{data[hover].full}</div>
          <div className="flex items-center gap-1.5 text-muted">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--viz-bar)' }} />
            <span className="font-semibold text-ink">{data[hover].value} XP</span>
            {data[hover].value >= goal && <span>· goal reached ✓</span>}
          </div>
        </div>
      )}
      <table className="sr-only">
        <caption>XP per day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.full}>
              <td>{d.full}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
