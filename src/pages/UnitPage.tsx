import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Lock } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { UNITS, STEP_INFO, getUnit } from '@/data/units'
import { getWords } from '@/data/vocabulary'
import { getGrammarTopic } from '@/data/grammar'
import { STEP_ORDER } from '@/types'
import { stepDone, stepId, stepUnlocked, unitProgress, unitUnlocked } from '@/lib/course'
import { stepContentTitle } from '@/lib/unitContent'
import { SKILLS } from '@/lib/skills'
import { cn } from '@/lib/cn'
import { ButtonLink } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ListenButton } from '@/components/ui/ListenButton'
import NotFound from './NotFound'

export default function UnitPage() {
  const { unitId = '' } = useParams()
  const state = useProgress()
  const unit = getUnit(unitId)
  if (!unit) return <NotFound />
  const index = UNITS.indexOf(unit)
  const open = unitUnlocked(state, index)
  const progress = unitProgress(state, unit)
  const nextStep = STEP_ORDER.find((s) => !stepDone(state, unit.id, s))
  const nextUnit = UNITS[index + 1]
  const words = getWords(unit.words)

  return (
    <div className="space-y-6">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        ← Course map
      </Link>

      <section className={cn('relative overflow-hidden rounded-4xl bg-gradient-to-br p-6 text-white shadow-lift sm:p-9', unit.gradient)}>
        <div className="pointer-events-none absolute -right-6 -top-10 text-[11rem] leading-none opacity-20">{unit.emoji}</div>
        <div className="relative max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">Unit {unit.number} of {UNITS.length}</div>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{unit.title}</h1>
          <p className="mt-1 text-lg font-semibold text-white/90">{unit.subtitle}</p>
          <p className="mt-3 text-white/85">{unit.description}</p>
          <div className="mt-6 max-w-md">
            <div className="mb-1.5 text-sm font-bold">
              Unit {unit.number} — {Math.round(progress * 100)}% completed
            </div>
            <ProgressBar value={progress} className="bg-white/25" barClassName="bg-white" />
          </div>
          {open ? (
            nextStep ? (
              <ButtonLink to={`/learn/${unit.id}/${nextStep}`} variant="white" size="lg" className="mt-6" iconRight={<ArrowRight size={18} />}>
                {progress > 0 ? `Continue: ${STEP_INFO[nextStep].label}` : 'Start the unit'}
              </ButtonLink>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 font-bold">🎉 Unit complete!{nextUnit && ` Unit ${nextUnit.number} is unlocked.`}</div>
            )
          ) : (
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black/20 px-4 py-2 font-bold">
              <Lock size={16} /> Finish Unit {unit.number - 1} to unlock
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section>
          <h2 className="mb-3 text-lg font-extrabold">8 steps of this unit</h2>
          <ol className="space-y-3">
            {STEP_ORDER.map((step, i) => {
              const meta = SKILLS[step]
              const done = stepDone(state, unit.id, step)
              const unlocked = stepUnlocked(state, index, step)
              const record = state.activities[stepId(unit.id, step)]
              const isNext = step === nextStep && unlocked
              const body = (
                <>
                  <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', done ? 'bg-emerald-500 text-white' : unlocked ? cn('bg-gradient-to-br text-white', meta.tone.gradient) : 'bg-surface-3 text-faint')}>
                    {done ? <Check size={22} strokeWidth={3} /> : unlocked ? <meta.icon size={22} /> : <Lock size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted">Step {i + 1}</span>
                      {isNext && <span className="chip bg-brand-500 py-0.5 text-white">Next</span>}
                    </span>
                    <span className="block font-extrabold">{STEP_INFO[step].label}</span>
                    <span className="block truncate text-sm text-muted">{stepContentTitle(unit, step)}</span>
                  </span>
                  <span className="hidden text-right sm:block">
                    {record ? (
                      <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{Math.round(record.bestAccuracy * 100)}%</span>
                    ) : (
                      <span className="chip bg-amber-400/15 text-amber-700 dark:text-amber-300">+{meta.baseXp} XP</span>
                    )}
                  </span>
                  {unlocked && <ChevronRight size={20} className="text-faint" />}
                </>
              )
              return (
                <li key={step}>
                  {unlocked ? (
                    <Link to={`/learn/${unit.id}/${step}`} className={cn('card card-hover flex items-center gap-4 p-4', isNext && 'ring-2 ring-brand-500/40')}>
                      {body}
                    </Link>
                  ) : (
                    <div className="card flex items-center gap-4 p-4 opacity-60" aria-disabled>
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="font-extrabold">You will learn to…</h3>
            <ul className="mt-3 space-y-2">
              {unit.goals.map((g) => (
                <li key={g} className="flex gap-2 text-sm">
                  <span className="text-emerald-500">✓</span> {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-extrabold">Words</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {words.map((w) => (
                <span key={w.id} className="flex items-center gap-0.5 rounded-full bg-surface-2 py-0.5 pl-2.5 pr-0.5 text-sm font-semibold">
                  {w.en}
                  <ListenButton text={w.en} size="sm" variant="plain" className="h-7 min-w-7" />
                </span>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-extrabold">Grammar</h3>
            <ul className="mt-3 space-y-2">
              {unit.grammar.map((g) => {
                const t = getGrammarTopic(g)!
                return (
                  <li key={g}>
                    <Link to={`/grammar/${g}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-surface-2">
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-sm font-bold">{t.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
