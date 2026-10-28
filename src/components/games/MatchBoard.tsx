import { useEffect, useMemo, useRef, useState } from 'react'
import { Timer } from 'lucide-react'
import type { Word } from '@/types'
import { shuffle } from '@/lib/random'
import { sfx } from '@/lib/sound'
import { useProgress } from '@/store/progress'
import { cn } from '@/lib/cn'

type Card = { id: string; wordId: string; text: string; side: 'en' | 'ru' }

/** Memory-style matching: English ↔ Russian, against the clock. */
export function MatchBoard({ words, onFinish }: { words: Word[]; onFinish: (r: { seconds: number; mistakes: number }) => void }) {
  const sound = useProgress((s) => s.settings.sound)
  const cards = useMemo<Card[]>(
    () => shuffle(words.flatMap((w) => [{ id: `${w.id}-en`, wordId: w.id, text: `${w.emoji.startsWith('#') ? '🎨' : w.emoji} ${w.en}`, side: 'en' as const }, { id: `${w.id}-ru`, wordId: w.id, text: w.ru, side: 'ru' as const }])),
    [words],
  )
  const [selected, setSelected] = useState<Card | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const done = matched.size === words.length
  const finished = useRef(false)

  useEffect(() => {
    if (done) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [done])

  useEffect(() => {
    if (done && !finished.current) {
      finished.current = true
      window.setTimeout(() => onFinish({ seconds, mistakes }), 500)
    }
  }, [done, seconds, mistakes, onFinish])

  const tap = (c: Card) => {
    if (matched.has(c.wordId) || wrong.length) return
    if (!selected) {
      setSelected(c)
      return
    }
    if (selected.id === c.id) {
      setSelected(null)
      return
    }
    if (selected.wordId === c.wordId && selected.side !== c.side) {
      setMatched((m) => new Set(m).add(c.wordId))
      if (sound) sfx.correct()
    } else {
      setWrong([selected.id, c.id])
      setMistakes((m) => m + 1)
      if (sound) sfx.wrong()
      window.setTimeout(() => setWrong([]), 550)
    }
    setSelected(null)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-1.5 text-muted">
          <Timer size={16} /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </span>
        <span className="text-muted">
          {matched.size} / {words.length} pairs · {mistakes} mistakes
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => {
          const isMatched = matched.has(c.wordId)
          const isSel = selected?.id === c.id
          const isWrong = wrong.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => tap(c)}
              disabled={isMatched}
              className={cn(
                'min-h-20 rounded-2xl border-2 px-3 py-3 text-center font-bold transition-all duration-200',
                isMatched && 'scale-95 border-emerald-300 bg-emerald-50 text-emerald-700 opacity-40 dark:bg-emerald-500/10 dark:text-emerald-300',
                isSel && 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
                isWrong && 'animate-shake border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/15',
                !isMatched && !isSel && !isWrong && 'border-line bg-surface shadow-[0_3px_0_0_var(--line)] hover:-translate-y-0.5 hover:border-brand-300',
                c.side === 'ru' && !isMatched && !isSel && !isWrong && 'text-ink-2',
              )}
            >
              {c.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
