import { Link } from 'react-router-dom'
import { ArrowRight, Check, Lock, Trophy } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { UNITS, STEP_INFO } from '@/data/units'
import { STEP_ORDER } from '@/types'
import { courseProgress, nextStep, stepDone, unitComplete, unitProgress, unitUnlocked, unitsCompleted, wordsLearned } from '@/lib/course'
import { SKILLS } from '@/lib/skills'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ButtonLink } from '@/components/ui/Button'
import { useElementWidth } from '@/hooks/useElementWidth'

const ROW = 172
const TOP = 132
const NODE = 76
/** Horizontal offsets for a winding path, as a share of the half-width. */
const OFFSETS = [0, 0.55, 0.8, 0.45, -0.2, -0.7, -0.8, -0.4, 0.3, 0]

export default function Learn() {
  const state = useProgress()
  const [box, boxWidth] = useElementWidth<HTMLDivElement>(340)
  const W = Math.max(290, Math.min(520, boxWidth - 32))
  const swing = W / 2 - 70
  const next = nextStep(state)
  const currentIndex = next ? next.unitIndex : UNITS.length
  const points = UNITS.map((_, i) => ({ x: W / 2 + OFFSETS[i % OFFSETS.length] * swing, y: TOP + i * ROW + NODE / 2 }))
  const end = { x: W / 2, y: TOP + UNITS.length * ROW + 30 }
  const height = end.y + 120
  const all = [{ x: W / 2, y: 26 }, ...points, end]

  const curve = (pts: { x: number; y: number }[]) =>
    pts.reduce((d, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = pts[i - 1]
      const my = (p.y - prev.y) / 2
      return `${d} C ${prev.x} ${prev.y + my}, ${p.x} ${p.y - my}, ${p.x} ${p.y}`
    }, '')

  const doneUpTo = Math.min(all.length, currentIndex + 2)
  const focusUnit = UNITS[Math.min(currentIndex, UNITS.length - 1)]
  const focusIndex = Math.min(currentIndex, UNITS.length - 1)

  return (
    <div>
      <PageHeader
        eyebrow="Course map"
        title="Your path to A1"
        subtitle="Ten units, from your first “Hello!” to the Final A1 Challenge. Finish a unit to unlock the next one."
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Path */}
        <div ref={box} className="card relative overflow-hidden bg-dots py-6">
          <div className="relative mx-auto" style={{ width: W, height }}>
            <svg width={W} height={height} className="absolute inset-0" aria-hidden>
              <path d={curve(all)} fill="none" stroke="var(--line-strong)" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" />
              <path d={curve(all.slice(0, doneUpTo))} fill="none" stroke="url(#road)" strokeWidth={10} strokeLinecap="round" />
              <defs>
                <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#8b7bff" />
                  <stop offset="1" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>

            {/* START */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <div className="rounded-full bg-ink px-5 py-2 text-sm font-extrabold tracking-wider text-bg shadow-lift">🚩 START</div>
            </div>

            {UNITS.map((u, i) => {
              const p = points[i]
              const open = unitUnlocked(state, i)
              const complete = unitComplete(state, u)
              const progress = unitProgress(state, u)
              const current = i === currentIndex
              return (
                <div key={u.id} className="absolute" style={{ left: p.x - NODE / 2 - 8, top: p.y - NODE / 2 - 8 }}>
                  {current && (
                    <div className="absolute -top-11 left-1/2 z-10 -translate-x-1/2 animate-float whitespace-nowrap rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-glow after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-brand-500">
                      {progress > 0 ? 'CONTINUE' : 'START'}
                    </div>
                  )}
                  <ProgressRing value={progress} size={NODE + 16} stroke={6} color={complete ? '#22c55e' : 'var(--color-brand-500)'}>
                    <Link
                      to={`/learn/${u.id}`}
                      aria-label={`Unit ${u.number}: ${u.title}${open ? '' : ' (locked)'}`}
                      className={cn(
                        'relative grid place-items-center rounded-full text-3xl transition-transform hover:scale-105 active:scale-95',
                        open ? `bg-gradient-to-br text-white shadow-[0_6px_0_0_rgb(0_0_0/0.15)] ${u.gradient}` : 'bg-surface-3 text-faint',
                        current && 'animate-pulse-ring',
                      )}
                      style={{ width: NODE, height: NODE }}
                    >
                      {open ? u.emoji : <Lock size={26} />}
                      {complete && (
                        <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full border-2 border-surface bg-emerald-500 text-white">
                          <Check size={15} strokeWidth={3} />
                        </span>
                      )}
                    </Link>
                  </ProgressRing>
                  <div className="absolute left-1/2 top-full mt-1 w-max max-w-44 -translate-x-1/2 rounded-xl bg-surface/90 px-2.5 py-1 text-center shadow-soft backdrop-blur">
                    <div className={cn('text-sm font-extrabold', !open && 'text-muted')}>
                      Unit {u.number} — {u.title}
                    </div>
                    <div className="text-xs font-semibold text-muted">{!open ? '🔒 Locked' : complete ? '✅ Completed' : `${Math.round(progress * 100)}% completed`}</div>
                  </div>
                </div>
              )
            })}

            {/* Finish */}
            <Link to="/final-test" className="absolute -translate-x-1/2 text-center" style={{ left: end.x, top: end.y - 10 }}>
              <div className={cn('mx-auto grid h-20 w-20 place-items-center rounded-3xl shadow-lift transition hover:scale-105', state.finalTest?.passed ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950' : 'bg-surface-3 text-muted')}>
                <Trophy size={34} />
              </div>
              <div className="mt-2 w-40 text-sm font-extrabold">A1 Certificate</div>
              <div className="text-xs text-muted">{state.finalTest?.passed ? `Passed · ${state.finalTest.total}%` : 'Pass the Final Test'}</div>
            </Link>
          </div>
        </div>

        {/* Side panel */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="mb-2 flex items-center justify-between text-sm font-bold">
              <span>Course progress</span>
              <span>{Math.round(courseProgress(state) * 100)}%</span>
            </div>
            <ProgressBar value={courseProgress(state)} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-surface-2 p-2">
                <div className="text-lg font-extrabold">{unitsCompleted(state)}/10</div>
                <div className="text-[11px] font-semibold text-muted">units</div>
              </div>
              <div className="rounded-2xl bg-surface-2 p-2">
                <div className="text-lg font-extrabold">{wordsLearned(state)}</div>
                <div className="text-[11px] font-semibold text-muted">words</div>
              </div>
              <div className="rounded-2xl bg-surface-2 p-2">
                <div className="text-lg font-extrabold">{state.xp}</div>
                <div className="text-[11px] font-semibold text-muted">XP</div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className={cn('bg-gradient-to-br p-5 text-white', focusUnit.gradient)}>
              <div className="text-xs font-bold uppercase tracking-wider text-white/80">{next ? 'Current unit' : 'Course complete'}</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-4xl">{focusUnit.emoji}</span>
                <div>
                  <div className="text-xl font-extrabold">
                    Unit {focusUnit.number} — {focusUnit.title}
                  </div>
                  <div className="text-sm text-white/85">{focusUnit.subtitle}</div>
                </div>
              </div>
            </div>
            <ul className="space-y-1 p-3">
              {STEP_ORDER.map((step) => {
                const done = stepDone(state, focusUnit.id, step)
                const Icon = SKILLS[step].icon
                return (
                  <li key={step} className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm">
                    <span className={cn('grid h-7 w-7 place-items-center rounded-lg', done ? 'bg-emerald-500 text-white' : SKILLS[step].tone.soft)}>
                      {done ? <Check size={14} strokeWidth={3} /> : <Icon size={14} className={SKILLS[step].tone.text} />}
                    </span>
                    <span className={cn('flex-1 font-semibold', done && 'text-muted line-through')}>{STEP_INFO[step].label}</span>
                  </li>
                )
              })}
            </ul>
            <div className="p-3 pt-0">
              <ButtonLink to={next ? `/learn/${next.unit.id}/${next.step}` : '/final-test'} block iconRight={<ArrowRight size={18} />}>
                {next ? (unitProgress(state, focusUnit) > 0 ? 'Continue' : 'Start unit') : 'Final Test'}
              </ButtonLink>
              {!unitUnlocked(state, focusIndex) && <p className="mt-2 text-center text-xs text-muted">Finish the previous unit to unlock.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
