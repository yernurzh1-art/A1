import { useMemo, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HeartCrack, Lock } from 'lucide-react'
import { STEP_ORDER, type StepKey } from '@/types'
import { useProgress, HEART_REFILL_MS } from '@/store/progress'
import { UNITS, STEP_INFO, getUnit } from '@/data/units'
import { getWords } from '@/data/vocabulary'
import { getGrammarTopic } from '@/data/grammar'
import { getListening } from '@/data/listening'
import { getReading } from '@/data/reading'
import { getSpeaking } from '@/data/speaking'
import { getWriting } from '@/data/writing'
import { getVideo } from '@/data/videos'
import { stepDone, stepId, stepUnlocked, unitQuiz } from '@/lib/course'
import { SKILLS } from '@/lib/skills'
import { cn } from '@/lib/cn'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { VocabLesson } from '@/components/vocabulary/VocabLesson'
import { GrammarLesson } from '@/components/grammar/GrammarLesson'
import { ListeningActivity } from '@/components/listening/ListeningActivity'
import { ReadingActivity } from '@/components/reading/ReadingActivity'
import { SpeakingActivity } from '@/components/speaking/SpeakingActivity'
import { WritingActivity } from '@/components/writing/WritingActivity'
import { VideoActivity } from '@/components/video/VideoActivity'
import { FinalTest } from '@/components/final/FinalTest'
import { Button, ButtonLink } from '@/components/ui/Button'
import NotFound from './NotFound'

/** Steps that use the exercise runner and therefore cost hearts. */
const HEART_STEPS: StepKey[] = ['vocabulary', 'grammar', 'listening', 'reading', 'quiz']

export default function LessonStep() {
  const { unitId = '', step = '' } = useParams()
  const navigate = useNavigate()
  const state = useProgress()
  const unit = getUnit(unitId)
  const stepKey = STEP_ORDER.find((s) => s === step)
  const quiz = useMemo(() => (unit ? unitQuiz(unit) : []), [unit])
  // Decide about the hearts gate once per step, so losing the last heart
  // mid-lesson shows the runner's own "out of hearts" dialog instead.
  const gate = useRef<{ key: string; blocked: boolean } | null>(null)
  const gateKey = `${unitId}/${step}`
  if (gate.current?.key !== gateKey) {
    gate.current = { key: gateKey, blocked: !state.settings.unlimitedHearts && state.hearts.count <= 0 }
  }

  if (!unit || !stepKey) return <NotFound />
  const index = UNITS.indexOf(unit)
  const path = `/learn/${unit.id}/${stepKey}`
  const unitPath = `/learn/${unit.id}`
  const stepIdx = STEP_ORDER.indexOf(stepKey)
  const nextKey = STEP_ORDER[stepIdx + 1]
  const exit = () => navigate(unitPath)

  if (!stepUnlocked(state, index, stepKey)) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-muted">
          <Lock size={34} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">This step is locked</h1>
        <p className="mt-2 text-muted">Finish the previous steps first — one step at a time! 🪜</p>
        <ButtonLink to={unitPath} className="mt-6">
          Back to Unit {unit.number}
        </ButtonLink>
      </div>
    )
  }

  const outOfHearts = HEART_STEPS.includes(stepKey) && gate.current.blocked && !state.settings.unlimitedHearts && state.hearts.count <= 0
  if (outOfHearts) {
    const minutes = Math.max(1, Math.ceil((state.hearts.updatedAt + HEART_REFILL_MS - Date.now()) / 60000))
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-500/10 text-rose-500">
          <HeartCrack size={36} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">You’re out of hearts</h1>
        <p className="mt-2 text-muted">The next heart comes in about {minutes} min. Practise your mistakes to earn hearts back now — or try a speaking, writing or video step.</p>
        <div className="mt-6 grid gap-3">
          <ButtonLink to="/review" size="lg">
            Practise mistakes (+❤️)
          </ButtonLink>
          <Button variant="secondary" size="lg" onClick={exit}>
            Back to the unit
          </Button>
        </div>
      </div>
    )
  }

  const meta = SKILLS[stepKey]
  const lastStep = !nextKey
  const continueTo = () => navigate(nextKey ? `/learn/${unit.id}/${nextKey}` : unitPath)
  const continueLabel = nextKey ? `Next: ${STEP_INFO[nextKey].label}` : 'Finish the unit'

  return (
    <div>
      {/* Lesson header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={unitPath} className="text-sm font-semibold text-muted hover:text-ink">
            ← Unit {unit.number} · {unit.title}
          </Link>
        </div>
        <div className="flex items-center gap-1.5" aria-label={`Step ${stepIdx + 1} of ${STEP_ORDER.length}`}>
          {STEP_ORDER.map((s, i) => (
            <Link
              key={s}
              to={stepUnlocked(state, index, s) ? `/learn/${unit.id}/${s}` : '#'}
              title={STEP_INFO[s].label}
              className={cn(
                'h-2 rounded-full transition-all',
                i === stepIdx ? 'w-8 bg-brand-500' : stepDone(state, unit.id, s) ? 'w-4 bg-emerald-500' : 'w-4 bg-surface-3',
              )}
            />
          ))}
        </div>
      </div>
      <div className="mb-6 flex items-center gap-3">
        <span className={cn('grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white', meta.tone.gradient)}>
          <meta.icon size={22} />
        </span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Step {stepIdx + 1} of 8 · {STEP_INFO[stepKey].label}
          </div>
          <div className="text-lg font-extrabold">{STEP_INFO[stepKey].description}</div>
        </div>
      </div>

      <ActivityFlow
        key={path}
        id={stepId(unit.id, stepKey)}
        skill={stepKey}
        onContinue={continueTo}
        continueLabel={continueLabel}
        completeTitle={lastStep ? `🏆 Unit ${unit.number} Complete!` : undefined}
      >
        {(finish) => {
          const done = (acc: number, mistakes = 0) => finish(acc, { mistakes })
          switch (stepKey) {
            case 'vocabulary':
              return <VocabLesson words={getWords(unit.words)} seed={unit.id} path={path} useHearts onDone={done} onExit={exit} />
            case 'grammar':
              return <GrammarLesson topics={unit.grammar.map((g) => getGrammarTopic(g)!)} path={path} useHearts onDone={done} onExit={exit} />
            case 'listening': {
              const t = getListening(unit.listening)!
              return <ListeningActivity title={t.title} description={t.description} lines={t.lines} exercises={t.exercises} path={path} useHearts onDone={done} />
            }
            case 'reading':
              return <ReadingActivity task={getReading(unit.reading)!} path={path} useHearts onDone={done} />
            case 'speaking':
              return <SpeakingActivity task={getSpeaking(unit.speaking)!} onDone={(a) => done(a)} />
            case 'writing':
              return <WritingActivity task={getWriting(unit.writing)!} onDone={(a) => done(a)} />
            case 'video':
              return <VideoActivity lesson={getVideo(unit.video)!} path={path} onDone={done} />
            case 'quiz':
              return quiz.length ? (
                <div className="mx-auto max-w-2xl">
                  <ExerciseRunner exercises={quiz} skill="quiz" source={{ label: `Unit ${unit.number} quiz`, path }} useHearts onExit={exit} onFinish={(r) => done(r.accuracy, r.wrong)} />
                </div>
              ) : (
                <FinalTest finishLabel="Complete the course" onFinished={(r) => done(r.total / 100)} />
              )
          }
        }}
      </ActivityFlow>
    </div>
  )
}
