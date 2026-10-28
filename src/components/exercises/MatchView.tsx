import { useEffect, useMemo, useState } from 'react'
import type { MatchExercise } from '@/types'
import { seeded, shuffle } from '@/lib/random'
import { cn } from '@/lib/cn'
import { sfx } from '@/lib/sound'
import { useProgress } from '@/store/progress'

type Side = 'L' | 'R'

/** Tap a left item, then its partner on the right. Self-checking. */
export function MatchView({ exercise, onResolved, checked }: { exercise: MatchExercise; onResolved: (correct: boolean) => void; checked: boolean }) {
  const sound = useProgress((s) => s.settings.sound)
  const left = useMemo(() => shuffle(exercise.pairs.map((p, i) => ({ text: p[0], i })), seeded(exercise.id + 'L')), [exercise])
  const right = useMemo(() => shuffle(exercise.pairs.map((p, i) => ({ text: p[1], i })), seeded(exercise.id + 'R')), [exercise])
  const [sel, setSel] = useState<{ side: Side; i: number } | null>(null)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<{ L: number; R: number } | null>(null)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    if (done.size === exercise.pairs.length && !checked) onResolved(mistakes <= 1)
  }, [done, exercise.pairs.length, mistakes, onResolved, checked])

  const tap = (side: Side, i: number) => {
    if (done.has(i) || checked) return
    if (!sel || sel.side === side) {
      setSel({ side, i })
      if (sound) sfx.tap()
      return
    }
    const l = side === 'L' ? i : sel.i
    const r = side === 'R' ? i : sel.i
    if (l === r) {
      setDone((d) => new Set(d).add(i))
      if (sound) sfx.correct()
    } else {
      setWrong({ L: l, R: r })
      setMistakes((m) => m + 1)
      if (sound) sfx.wrong()
      window.setTimeout(() => setWrong(null), 600)
    }
    setSel(null)
  }

  const cls = (side: Side, i: number) => {
    const isDone = done.has(i)
    const isSel = sel?.side === side && sel.i === i
    const isWrong = wrong?.[side] === i
    return cn(
      'w-full rounded-2xl border-2 px-3 py-3 text-center text-sm font-semibold transition-all sm:text-base',
      isDone && 'border-emerald-400 bg-emerald-50 text-emerald-700 opacity-70 dark:bg-emerald-500/10 dark:text-emerald-300',
      isSel && 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
      isWrong && 'animate-shake border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
      !isDone && !isSel && !isWrong && 'border-line bg-surface shadow-[0_3px_0_0_var(--line)] hover:border-brand-300 active:translate-y-[2px] active:shadow-none',
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {left.map((t) => (
            <button key={t.i} type="button" className={cls('L', t.i)} onClick={() => tap('L', t.i)} disabled={done.has(t.i)}>
              {t.text}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((t) => (
            <button key={t.i} type="button" className={cls('R', t.i)} onClick={() => tap('R', t.i)} disabled={done.has(t.i)}>
              {t.text}
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-muted">
        {done.size} / {exercise.pairs.length} pairs matched{mistakes > 0 && ` · ${mistakes} mistake${mistakes > 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
