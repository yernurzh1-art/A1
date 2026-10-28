import { useCallback, useRef, useState, type ReactNode } from 'react'
import type { Skill } from '@/types'
import { SKILLS } from '@/lib/skills'
import { useProgress } from '@/store/progress'
import { LessonComplete } from './LessonComplete'

export type FinishFn = (accuracy: number, opts?: { mistakes?: number }) => void

/**
 * Runs an activity and shows the "Lesson Complete" screen when it calls `finish`.
 * Awards XP, saves progress and updates the streak.
 */
export function ActivityFlow({
  id,
  skill,
  baseXp,
  children,
  onContinue,
  continueLabel,
  completeTitle,
}: {
  id: string
  skill: Skill
  baseXp?: number
  children: (finish: FinishFn) => ReactNode
  onContinue: () => void
  continueLabel?: string
  completeTitle?: string
}) {
  const [run, setRun] = useState(0)
  const [result, setResult] = useState<{ xp: number; accuracy: number; durationMs: number; isRepeat: boolean; mistakes: number } | null>(null)
  const start = useRef(Date.now())

  const finish = useCallback<FinishFn>(
    (accuracy, opts) => {
      const { xp, isRepeat } = useProgress.getState().completeActivity({ id, skill, accuracy, baseXp: baseXp ?? SKILLS[skill].baseXp })
      setResult({ xp, accuracy, durationMs: Date.now() - start.current, isRepeat, mistakes: opts?.mistakes ?? 0 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [id, skill, baseXp],
  )

  if (result) {
    return (
      <LessonComplete
        {...result}
        title={completeTitle}
        hasMistakes={result.mistakes > 0}
        onContinue={onContinue}
        continueLabel={continueLabel}
        onRetry={() => {
          setResult(null)
          start.current = Date.now()
          setRun((r) => r + 1)
        }}
      />
    )
  }
  return <div key={run}>{children(finish)}</div>
}
