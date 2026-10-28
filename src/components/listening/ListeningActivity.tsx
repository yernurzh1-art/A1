import { useCallback, useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import type { DialogLine, Exercise } from '@/types'
import { ExerciseRunner, type RunnerResult } from '@/components/exercises/ExerciseRunner'
import { Button } from '@/components/ui/Button'
import { ListenButton } from '@/components/ui/ListenButton'
import { DialogPlayer } from './DialogPlayer'

/** Listen → answer → only then the transcript can be shown. */
export function ListeningActivity({
  title,
  description,
  lines,
  exercises,
  path,
  onDone,
  useHearts,
  finishLabel = 'Finish',
}: {
  title: string
  description?: string
  lines: DialogLine[]
  exercises: Exercise[]
  path: string
  onDone: (accuracy: number, mistakes: number) => void
  useHearts?: boolean
  finishLabel?: string
}) {
  const [played, setPlayed] = useState(false)
  const [result, setResult] = useState<RunnerResult | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const onPlayed = useCallback(() => setPlayed(true), [])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-24">
        {description && <p className="text-muted">{description}</p>}
        <DialogPlayer lines={lines} title={title} onPlayed={onPlayed} />
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="font-bold">📜 Transcript</div>
            <Button size="sm" variant="secondary" disabled={!result} onClick={() => setShowTranscript((v) => !v)} icon={!result ? <Lock size={14} /> : showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}>
              {showTranscript ? 'Hide transcript' : 'Show transcript'}
            </Button>
          </div>
          {!result && <p className="mt-2 text-sm text-muted">The transcript opens after you finish the tasks. Try to understand by listening first! 👂</p>}
          {result && showTranscript && (
            <ol className="mt-4 space-y-2">
              {lines.map((l, i) => (
                <li key={i} className="flex animate-fade-up items-start gap-3 rounded-2xl bg-surface-2 px-3 py-2" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="mt-0.5 w-24 shrink-0 truncate text-sm font-bold text-cyan-600 dark:text-cyan-300">{l.speaker}</span>
                  <span className="flex-1">{l.text}</span>
                  <ListenButton text={l.text} size="sm" variant="plain" />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <div className="card p-4 sm:p-6">
        {result ? (
          <div className="py-10 text-center">
            <div className="text-5xl">🎧</div>
            <h3 className="mt-3 text-2xl font-extrabold">Well listened!</h3>
            <p className="mt-1 text-muted">
              {result.correct} of {result.total} correct on the first try. Now open the transcript and listen again.
            </p>
            <Button className="mt-6" size="lg" onClick={() => onDone(result.accuracy, result.wrong)} iconRight={<ArrowRight size={18} />}>
              {finishLabel}
            </Button>
          </div>
        ) : (
          <>
            {!played && <p className="mb-4 rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-800 dark:text-cyan-200">▶ Press Play and listen to the whole dialogue first. You can replay it any time.</p>}
            <ExerciseRunner embedded exercises={exercises} skill="listening" source={{ label: `Listening: ${title}`, path }} useHearts={useHearts} onFinish={setResult} title="Questions" />
          </>
        )}
      </div>
    </div>
  )
}
