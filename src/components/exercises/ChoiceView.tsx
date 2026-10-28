import { useEffect } from 'react'
import type { ChoiceExercise, ListenExercise } from '@/types'
import { ListenButton } from '@/components/ui/ListenButton'
import { WordVisual } from '@/components/vocabulary/WordVisual'
import { KeyHint, optionClass, type OptionState } from './optionStyles'

/** Multiple choice. Also used for listening exercises with options. */
export function ChoiceView({
  exercise,
  value,
  onChange,
  checked,
}: {
  exercise: ChoiceExercise | (ListenExercise & { options: string[] })
  value: number | null
  onChange: (v: number) => void
  checked: boolean
}) {
  const options = exercise.options
  const answer = exercise.answer as number

  useEffect(() => {
    if (checked) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const n = Number(e.key)
      if (n >= 1 && n <= options.length) onChange(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [checked, options.length, onChange])

  const isListen = exercise.kind === 'listen'

  return (
    <div className="space-y-5">
      {isListen ? (
        <div className="flex items-center justify-center gap-3 py-2">
          <ListenButton text={exercise.audio} size="lg" variant="solid" className="h-20 min-w-20 rounded-3xl" />
          <ListenButton text={exercise.audio} size="md" slow />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          {exercise.emoji && <WordVisual emoji={exercise.emoji} size="xl" />}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold sm:text-2xl">{exercise.question}</h3>
            {exercise.audio && <ListenButton text={exercise.audio} size="sm" />}
          </div>
        </div>
      )}
      <div className={options.length > 3 && options.every((o) => o.length < 18) ? 'grid grid-cols-2 gap-3' : 'grid gap-3'}>
        {options.map((opt, i) => {
          let state: OptionState = value === i ? 'selected' : 'idle'
          if (checked) state = i === answer ? 'correct' : value === i ? 'wrong' : 'dimmed'
          return (
            <button key={i} type="button" disabled={checked} onClick={() => onChange(i)} className={optionClass(state)}>
              <KeyHint n={i + 1} state={state} />
              <span className="min-w-0 flex-1">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
