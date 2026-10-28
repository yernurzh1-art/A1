import { useEffect, useRef } from 'react'
import type { FillExercise } from '@/types'
import { cn } from '@/lib/cn'
import { optionClass, type OptionState } from './optionStyles'
import { normalize } from '@/lib/text'

/** Sentence with one gap: choose a chip or type the word. */
export function FillView({
  exercise,
  value,
  onChange,
  checked,
  correct,
  onSubmit,
}: {
  exercise: FillExercise
  value: string | null
  onChange: (v: string) => void
  checked: boolean
  correct: boolean
  onSubmit: () => void
}) {
  const [before, after] = exercise.text.split('___')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!exercise.options) inputRef.current?.focus()
  }, [exercise.id, exercise.options])

  const isAnswer = (opt: string) => exercise.answers.some((a) => normalize(a) === normalize(opt))

  const gapTone = checked ? (correct ? 'border-emerald-500 text-emerald-600 dark:text-emerald-300' : 'border-rose-500 text-rose-600 dark:text-rose-300') : 'border-brand-400 text-brand-600 dark:text-brand-300'

  return (
    <div className="space-y-6">
      <p className="rounded-3xl border border-line bg-surface-2 px-5 py-6 text-center text-xl font-bold leading-loose sm:text-2xl">
        {before}
        {exercise.options ? (
          <span className={cn('mx-1 inline-block min-w-20 border-b-4 px-2 text-center transition-colors', gapTone, !value && 'text-transparent')}>{value || '____'}</span>
        ) : (
          <input
            ref={inputRef}
            value={value ?? ''}
            disabled={checked}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSubmit()
              }
            }}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Your answer"
            className={cn('mx-1 inline-block w-36 border-b-4 bg-transparent px-2 text-center outline-none transition-colors sm:w-44', gapTone)}
          />
        )}
        {after}
      </p>
      {exercise.hint && !checked && <p className="text-center text-sm text-muted">💡 Hint: {exercise.hint}</p>}
      {exercise.options && (
        <div className="flex flex-wrap justify-center gap-3">
          {exercise.options.map((opt) => {
            let state: OptionState = value === opt ? 'selected' : 'idle'
            if (checked) state = isAnswer(opt) ? 'correct' : value === opt ? 'wrong' : 'dimmed'
            return (
              <button key={opt} type="button" disabled={checked} onClick={() => onChange(opt)} className={optionClass(state, 'w-auto min-w-24 justify-center px-5')}>
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
