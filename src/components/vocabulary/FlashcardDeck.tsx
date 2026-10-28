import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Word } from '@/types'
import { useProgress } from '@/store/progress'
import type { Grade } from '@/lib/srs'
import { shuffle } from '@/lib/random'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Flashcard } from './Flashcard'

const GRADES: { grade: Grade; label: string; hint: string; cls: string }[] = [
  { grade: 'again', label: 'Again', hint: "I didn't know", cls: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300' },
  { grade: 'good', label: 'Good', hint: 'I remembered', cls: 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300' },
  { grade: 'easy', label: 'Easy', hint: 'Too easy!', cls: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300' },
]

/** Flip cards and grade yourself — this feeds the spaced-repetition schedule. */
export function FlashcardDeck({ words, onFinish }: { words: Word[]; onFinish: (accuracy: number) => void }) {
  const deck = useMemo(() => shuffle(words), [words])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const gradeWord = useProgress((s) => s.gradeWord)
  const word = deck[i]

  const grade = (g: Grade) => {
    gradeWord(word.id, g)
    const k = known + (g === 'again' ? 0 : 1)
    setKnown(k)
    if (i + 1 >= deck.length) onFinish(k / deck.length)
    else {
      setFlipped(false)
      setI(i + 1)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center gap-3">
        <ProgressBar value={i / deck.length} size="sm" barClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        <span className="shrink-0 text-sm font-bold text-muted">
          {i + 1} / {deck.length}
        </span>
      </div>
      <Flashcard word={word} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      <div className="mt-6 min-h-24">
        {flipped ? (
          <div className="grid animate-fade-up grid-cols-3 gap-2">
            {GRADES.map((g) => (
              <button key={g.grade} onClick={() => grade(g.grade)} className={cn('rounded-2xl border-2 px-2 py-3 text-center transition active:scale-95', g.cls)}>
                <div className="font-extrabold">{g.label}</div>
                <div className="text-xs opacity-80">{g.hint}</div>
              </button>
            ))}
          </div>
        ) : (
          <Button size="lg" block onClick={() => setFlipped(true)} iconRight={<ArrowRight size={18} />}>
            Show the answer
          </Button>
        )}
      </div>
    </div>
  )
}
