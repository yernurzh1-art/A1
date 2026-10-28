import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/store/progress'
import { dayKey } from '@/lib/date'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'

export default function ReviewPractice() {
  const navigate = useNavigate()
  // Take a snapshot so fixing mistakes during the session doesn't change the list.
  const exercises = useMemo(() => {
    const seen = new Set<string>()
    return useProgress
      .getState()
      .mistakes.filter((m) => !m.resolved && !seen.has(m.exercise.id) && seen.add(m.exercise.id))
      .slice(0, 15)
      .map((m) => m.exercise)
  }, [])

  if (!exercises.length) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <EmptyState emoji="🎉" title="Nothing to review" body="You have no open mistakes. Keep learning!" action={<ButtonLink to="/learn">Continue learning</ButtonLink>} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ActivityFlow id={`review:${dayKey()}`} skill="quiz" baseXp={20} completeTitle="Review complete! ♻️" onContinue={() => navigate('/review')} continueLabel="Back to Review">
        {(finish) => (
          <ExerciseRunner
            review
            exercises={exercises}
            skill="quiz"
            title={`♻️ Review · ${exercises.length} mistakes · +1 ❤️ for each fix`}
            source={{ label: 'Review practice', path: '/review' }}
            onExit={() => navigate('/review')}
            onFinish={(r) => finish(r.accuracy, { mistakes: r.wrong })}
          />
        )}
      </ActivityFlow>
    </div>
  )
}
