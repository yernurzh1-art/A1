import { useEffect, useRef } from 'react'
import type { ListenExercise } from '@/types'
import { ListenButton } from '@/components/ui/ListenButton'
import { useSpeak } from '@/hooks/useSpeak'
import { cn } from '@/lib/cn'

/** Listen and type what you hear (dictation). */
export function ListenTypeView({
  exercise,
  value,
  onChange,
  checked,
  correct,
  onSubmit,
}: {
  exercise: ListenExercise
  value: string | null
  onChange: (v: string) => void
  checked: boolean
  correct: boolean
  onSubmit: () => void
}) {
  const { say } = useSpeak()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const t = window.setTimeout(() => say(exercise.audio), 350)
    ref.current?.focus()
    return () => window.clearTimeout(t)
  }, [exercise.id, exercise.audio, say])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <ListenButton text={exercise.audio} size="lg" variant="solid" className="h-20 min-w-20 rounded-3xl" />
        <ListenButton text={exercise.audio} slow />
      </div>
      <input
        ref={ref}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={checked}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit()
          }
        }}
        placeholder="Type what you hear…"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type what you hear"
        className={cn(
          'w-full rounded-2xl border-2 bg-surface px-5 py-4 text-center text-lg font-semibold outline-none transition-colors',
          checked ? (correct ? 'border-emerald-500' : 'border-rose-500') : 'border-line focus:border-brand-500',
        )}
      />
    </div>
  )
}
