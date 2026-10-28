import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { AnswerValue, Exercise, Skill } from '@/types'
import { checkAnswer, correctAnswerText, givenAnswerText, isAnswerReady } from '@/lib/exercises'
import { useProgress } from '@/store/progress'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ExerciseView, defaultPrompt } from '@/components/exercises/ExerciseView'

/** One practice item with instant "✅ Correct!" / "❌ Try again" feedback. */
export function InlineExercise({ exercise, number, skill, source, onSolved }: { exercise: Exercise; number: number; skill: Skill; source: { label: string; path: string }; onSolved?: (firstTry: boolean) => void }) {
  const sound = useProgress((s) => s.settings.sound)
  const [value, setValue] = useState<AnswerValue>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [tries, setTries] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const instant = exercise.kind === 'choice' || exercise.kind === 'truefalse' || (exercise.kind === 'fill' && !!exercise.options) || (exercise.kind === 'listen' && !!exercise.options)

  const evaluate = (ok: boolean, v: AnswerValue) => {
    if (status === 'correct') return
    if (ok) {
      setStatus('correct')
      if (sound) sfx.correct()
      useProgress.getState().resolveMistake(exercise.id)
      onSolved?.(tries === 0)
    } else {
      setStatus('wrong')
      if (sound) sfx.wrong()
      if (tries === 0) useProgress.getState().recordMistake({ exercise, skill, source: source.label, path: source.path, given: givenAnswerText(exercise, v), correct: correctAnswerText(exercise) })
      setTries((t) => t + 1)
    }
  }

  const onChange = (v: AnswerValue) => {
    setValue(v)
    if (instant) evaluate(checkAnswer(exercise, v), v)
    else if (status === 'wrong') setStatus('idle')
  }

  return (
    <div className={cn('card p-5 transition-colors sm:p-6', status === 'correct' && 'border-emerald-300 dark:border-emerald-500/40')}>
      <div className="mb-4 flex items-center gap-3">
        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold', status === 'correct' ? 'bg-emerald-500 text-white' : 'bg-surface-2 text-muted')}>
          {status === 'correct' ? '✓' : number}
        </span>
        <span className="font-bold text-ink-2">{defaultPrompt(exercise)}</span>
      </div>
      <ExerciseView
        key={resetKey}
        exercise={exercise}
        value={value}
        onChange={onChange}
        checked={status === 'correct'}
        correct={status === 'correct'}
        onSubmit={() => isAnswerReady(exercise, value) && evaluate(checkAnswer(exercise, value), value)}
        onResolved={(ok) => evaluate(ok, null)}
      />
      {!instant && status !== 'correct' && exercise.kind !== 'match' && (
        <div className="mt-4 flex justify-end">
          <Button size="sm" disabled={!isAnswerReady(exercise, value)} onClick={() => evaluate(checkAnswer(exercise, value), value)}>
            Check
          </Button>
        </div>
      )}
      {status === 'correct' && (
        <div className="mt-4 animate-fade-up rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-800 dark:text-emerald-200">
          <b>✅ Correct!</b> {exercise.explanation}
        </div>
      )}
      {status === 'wrong' && (
        <div className="mt-4 flex animate-shake flex-wrap items-center justify-between gap-2 rounded-2xl bg-rose-500/10 px-4 py-3 text-rose-800 dark:text-rose-200">
          <span>
            <b>❌ Try again.</b> {exercise.explanation ?? 'Read the rule above and choose again.'}
          </span>
          {!instant && (
            <button
              type="button"
              onClick={() => {
                setValue(null)
                setStatus('idle')
                setResetKey((k) => k + 1)
              }}
              className="flex items-center gap-1 text-sm font-bold hover:underline"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
          {tries >= 2 && exercise.kind !== 'match' && <span className="w-full text-sm">Answer: <b>{correctAnswerText(exercise)}</b></span>}
        </div>
      )}
    </div>
  )
}
