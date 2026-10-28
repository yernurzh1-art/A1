import { useState } from 'react'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import type { ReadingTask } from '@/types'
import { ExerciseRunner, type RunnerResult } from '@/components/exercises/ExerciseRunner'
import { Button } from '@/components/ui/Button'
import { ReadingText } from './ReadingText'

export function ReadingActivity({ task, path, onDone, useHearts }: { task: ReadingTask; path: string; onDone: (accuracy: number, mistakes: number) => void; useHearts?: boolean }) {
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState<RunnerResult | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <BookOpen size={14} /> {task.topic}
          </span>
          <span className="chip bg-surface-2">
            <Clock size={14} /> {task.minutes} min
          </span>
        </div>
        <p className="text-muted">{task.intro}</p>
        <ReadingText title={`${task.emoji} ${task.title}`} paragraphs={task.paragraphs} glossary={task.glossary} />
      </div>
      <div className="card p-4 sm:p-6">
        {result ? (
          <div className="py-10 text-center">
            <div className="text-5xl">📖</div>
            <h3 className="mt-3 text-2xl font-extrabold">Reading complete!</h3>
            <p className="mt-1 text-muted">
              {result.correct} of {result.total} correct on the first try.
            </p>
            <Button className="mt-6" size="lg" onClick={() => onDone(result.accuracy, result.wrong)} iconRight={<ArrowRight size={18} />}>
              Finish
            </Button>
          </div>
        ) : started ? (
          <ExerciseRunner embedded exercises={task.exercises} skill="reading" source={{ label: `Reading: ${task.title}`, path }} useHearts={useHearts} onFinish={setResult} title="Tasks" />
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-3xl">📝</div>
            <h3 className="mt-4 text-xl font-extrabold">{task.exercises.length} tasks after the text</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">True / False, multiple choice, matching and more. Read the text first — you can look at it while you answer.</p>
            <Button className="mt-6" size="lg" onClick={() => setStarted(true)}>
              Start the tasks
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
