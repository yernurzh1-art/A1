import type { AnswerValue, Exercise } from '@/types'
import { ChoiceView } from './ChoiceView'
import { TrueFalseView } from './TrueFalseView'
import { FillView } from './FillView'
import { OrderView } from './OrderView'
import { MatchView } from './MatchView'
import { ListenTypeView } from './ListenTypeView'

export interface ExerciseViewProps {
  exercise: Exercise
  value: AnswerValue
  onChange: (v: AnswerValue) => void
  checked: boolean
  correct: boolean
  /** Enter pressed inside a text field. */
  onSubmit: () => void
  /** Match exercises check themselves. */
  onResolved: (correct: boolean) => void
}

export function ExerciseView({ exercise, value, onChange, checked, correct, onSubmit, onResolved }: ExerciseViewProps) {
  switch (exercise.kind) {
    case 'choice':
      return <ChoiceView exercise={exercise} value={value as number | null} onChange={onChange} checked={checked} />
    case 'listen':
      if (exercise.options) {
        return <ChoiceView exercise={{ ...exercise, options: exercise.options }} value={value as number | null} onChange={onChange} checked={checked} />
      }
      return <ListenTypeView exercise={exercise} value={value as string | null} onChange={onChange} checked={checked} correct={correct} onSubmit={onSubmit} />
    case 'truefalse':
      return <TrueFalseView exercise={exercise} value={value as boolean | null} onChange={onChange} checked={checked} />
    case 'fill':
      return <FillView exercise={exercise} value={value as string | null} onChange={onChange} checked={checked} correct={correct} onSubmit={onSubmit} />
    case 'order':
      return <OrderView exercise={exercise} value={value as string[] | null} onChange={onChange} checked={checked} correct={correct} />
    case 'match':
      return <MatchView key={exercise.id} exercise={exercise} onResolved={onResolved} checked={checked} />
  }
}

export function defaultPrompt(ex: Exercise): string {
  if (ex.prompt) return ex.prompt
  switch (ex.kind) {
    case 'choice':
      return 'Choose the correct answer'
    case 'truefalse':
      return 'True or false?'
    case 'fill':
      return ex.options ? 'Choose the missing word' : 'Type the missing word'
    case 'order':
      return 'Put in the correct order'
    case 'match':
      return 'Match the pairs'
    case 'listen':
      return ex.options ? 'What did you hear?' : 'Listen and type'
  }
}
