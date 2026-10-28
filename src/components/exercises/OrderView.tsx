import { useMemo } from 'react'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import type { OrderExercise } from '@/types'
import { shuffle, seeded } from '@/lib/random'
import { cn } from '@/lib/cn'
import { sfx } from '@/lib/sound'

const stripEnd = (s: string) => s.replace(/[.?!]+$/, '')

/** Build a sentence from tiles, or put sentences / dialogue lines in order. */
export function OrderView({
  exercise,
  value,
  onChange,
  checked,
  correct,
}: {
  exercise: OrderExercise
  value: string[] | null
  onChange: (v: string[]) => void
  checked: boolean
  correct: boolean
}) {
  const lines = exercise.layout === 'lines'
  // Tiles keep their own index so duplicate words work.
  const tiles = useMemo(() => {
    const base = exercise.items.map((text, i) => ({ text: lines ? text : stripEnd(text), i }))
    let mixed = shuffle(base, seeded(exercise.id))
    if (mixed.every((t, k) => t.i === k)) mixed = mixed.slice(1).concat(mixed[0])
    return mixed
  }, [exercise.id, exercise.items, lines])

  const picked = useMemo(() => {
    // value holds tile texts; map them back to tile indexes in order
    const used = new Set<number>()
    return (value ?? []).map((text) => {
      const t = tiles.find((x) => x.text === text && !used.has(x.i))
      if (t) used.add(t.i)
      return t
    }).filter((t): t is { text: string; i: number } => !!t)
  }, [value, tiles])
  const pickedIdx = new Set(picked.map((t) => t.i))
  const punct = lines ? '' : (exercise.items[exercise.items.length - 1].match(/[.?!]+$/)?.[0] ?? '')

  const add = (t: { text: string; i: number }) => {
    if (checked) return
    sfx.tap()
    onChange([...picked.map((p) => p.text), t.text])
  }
  const remove = (k: number) => {
    if (checked) return
    onChange(picked.filter((_, idx) => idx !== k).map((p) => p.text))
  }
  const move = (k: number, dir: -1 | 1) => {
    const next = picked.slice()
    const j = k + dir
    if (j < 0 || j >= next.length) return
    ;[next[k], next[j]] = [next[j], next[k]]
    onChange(next.map((p) => p.text))
  }

  const answerTone = checked ? (correct ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-rose-500 bg-rose-50 dark:bg-rose-500/10') : 'border-line bg-surface-2'

  return (
    <div className="space-y-5">
      {exercise.translation && <p className="text-center text-muted">«{exercise.translation}»</p>}
      <div className={cn('min-h-20 rounded-3xl border-2 border-dashed p-3 transition-colors', answerTone, lines ? 'space-y-2' : 'flex flex-wrap content-start items-center gap-2')}>
        {picked.length === 0 && <span className="w-full p-3 text-center text-sm text-faint">Tap the {lines ? 'sentences' : 'words'} below in the correct order</span>}
        {picked.map((t, k) =>
          lines ? (
            <div key={t.i} className="flex animate-fade-up items-center gap-2 rounded-2xl border border-line bg-surface p-2 pl-3 shadow-soft">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">{k + 1}</span>
              <span className="flex-1 text-sm font-semibold sm:text-base">{t.text}</span>
              {!checked && (
                <span className="flex gap-1">
                  <button type="button" onClick={() => move(k, -1)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Move up">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" onClick={() => move(k, 1)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Move down">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" onClick={() => remove(k)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Remove">
                    <X size={16} />
                  </button>
                </span>
              )}
            </div>
          ) : (
            <button
              key={t.i}
              type="button"
              onClick={() => remove(k)}
              disabled={checked}
              className="animate-pop rounded-xl border-2 border-line bg-surface px-3.5 py-2 font-semibold shadow-[0_3px_0_0_var(--line)] transition hover:border-rose-300"
            >
              {t.text}
            </button>
          ),
        )}
        {!lines && picked.length === exercise.items.length && punct && <span className="text-xl font-bold text-muted">{punct}</span>}
      </div>
      <div className={cn(lines ? 'space-y-2' : 'flex flex-wrap justify-center gap-2')}>
        {tiles.map((t) => {
          const used = pickedIdx.has(t.i)
          return (
            <button
              key={t.i}
              type="button"
              disabled={used || checked}
              onClick={() => add(t)}
              className={cn(
                'rounded-xl border-2 font-semibold transition-all',
                lines ? 'block w-full px-4 py-3 text-left text-sm sm:text-base' : 'px-3.5 py-2',
                used ? 'border-transparent bg-surface-3 text-transparent shadow-none' : 'border-line bg-surface shadow-[0_3px_0_0_var(--line)] hover:-translate-y-px hover:border-brand-300 active:translate-y-[2px] active:shadow-none',
              )}
            >
              {t.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
