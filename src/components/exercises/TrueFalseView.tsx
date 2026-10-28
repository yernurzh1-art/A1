import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import type { TrueFalseExercise } from '@/types'
import { optionClass, type OptionState } from './optionStyles'

export function TrueFalseView({
  exercise,
  value,
  onChange,
  checked,
}: {
  exercise: TrueFalseExercise
  value: boolean | null
  onChange: (v: boolean) => void
  checked: boolean
}) {
  useEffect(() => {
    if (checked) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1' || e.key.toLowerCase() === 't') onChange(true)
      if (e.key === '2' || e.key.toLowerCase() === 'f') onChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [checked, onChange])

  const state = (v: boolean): OptionState => {
    if (checked) return v === exercise.answer ? 'correct' : value === v ? 'wrong' : 'dimmed'
    return value === v ? 'selected' : 'idle'
  }
  return (
    <div className="space-y-6">
      <blockquote className="rounded-3xl border border-line bg-surface-2 px-5 py-6 text-center text-lg font-bold sm:text-xl">“{exercise.statement}”</blockquote>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={checked} onClick={() => onChange(true)} className={optionClass(state(true), 'justify-center py-5')}>
          <Check size={20} /> True
        </button>
        <button type="button" disabled={checked} onClick={() => onChange(false)} className={optionClass(state(false), 'justify-center py-5')}>
          <X size={20} /> False
        </button>
      </div>
    </div>
  )
}
