import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Word } from '@/types'
import { useProgress } from '@/store/progress'
import { wordExercises } from '@/lib/course'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { WordCard } from './WordCard'

/** Unit vocabulary step: learn the words one by one, then practise them. */
export function VocabLesson({ words, seed, path, useHearts, onDone, onExit }: { words: Word[]; seed: string; path: string; useHearts?: boolean; onDone: (accuracy: number, mistakes: number) => void; onExit: () => void }) {
  const [i, setI] = useState(0)
  const [practice, setPractice] = useState(false)
  const exercises = useMemo(() => wordExercises(words, seed, 10), [words, seed])

  if (practice) {
    return <ExerciseRunner exercises={exercises} skill="vocabulary" source={{ label: 'Vocabulary lesson', path }} useHearts={useHearts} onExit={onExit} onFinish={(r) => onDone(r.accuracy, r.wrong)} />
  }

  const last = i === words.length - 1
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-muted">
          New words · {i + 1} / {words.length}
        </span>
        <button onClick={() => { useProgress.getState().markWordsSeen(words.map((w) => w.id)); setPractice(true) }} className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
          I know these — skip to practice
        </button>
      </div>
      <div className="mb-4 flex gap-1.5">
        {words.map((w, k) => (
          <button key={w.id} onClick={() => setI(k)} className={cn('h-1.5 flex-1 rounded-full transition-colors', k <= i ? 'bg-violet-500' : 'bg-surface-3')} aria-label={w.en} />
        ))}
      </div>
      <WordCard key={words[i].id} word={words[i]} className="animate-fade-up" big />
      <div className="mt-5 flex gap-3">
        <Button variant="secondary" size="lg" disabled={i === 0} onClick={() => setI(i - 1)} icon={<ArrowLeft size={18} />}>
          Back
        </Button>
        <Button
          size="lg"
          block
          onClick={() => {
            if (!last) setI(i + 1)
            else {
              useProgress.getState().markWordsSeen(words.map((w) => w.id))
              setPractice(true)
            }
          }}
          iconRight={<ArrowRight size={18} />}
        >
          {last ? 'Practise these words' : 'Next word'}
        </Button>
      </div>
    </div>
  )
}
