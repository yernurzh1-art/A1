import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { dailyChallenge } from '@/lib/course'
import { dayKey } from '@/lib/date'
import { useProgress } from '@/store/progress'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'

export default function DailyChallenge() {
  const navigate = useNavigate()
  const exercises = useMemo(() => dailyChallenge(), [])
  return (
    <div className="mx-auto max-w-2xl">
      <ActivityFlow id={`challenge:${dayKey()}`} skill="quiz" baseXp={30} completeTitle="Challenge complete! ⚡" onContinue={() => navigate('/practice')} continueLabel="Back to Practice">
        {(finish) => (
          <ExerciseRunner
            exercises={exercises}
            skill="quiz"
            requeue={false}
            title="⚡ Daily challenge"
            source={{ label: 'Daily challenge', path: '/challenge' }}
            onExit={() => navigate('/practice')}
            onFinish={(r) => {
              useProgress.getState().saveChallenge(Math.round(r.accuracy * 100))
              finish(r.accuracy, { mistakes: r.wrong })
            }}
          />
        )}
      </ActivityFlow>
    </div>
  )
}
