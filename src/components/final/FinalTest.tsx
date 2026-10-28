import { useState } from 'react'
import { ArrowRight, Printer, RotateCcw, Timer } from 'lucide-react'
import type { FinalSection, FinalTestResult } from '@/types'
import { FINAL_GRAMMAR, FINAL_LISTENING, FINAL_READING, FINAL_SECTIONS, FINAL_SPEAKING, FINAL_VOCABULARY, FINAL_WRITING, PASS_SCORE } from '@/data/finalTest'
import { useProgress } from '@/store/progress'
import { celebrate } from '@/lib/confetti'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { ReadingText } from '@/components/reading/ReadingText'
import { DialogPlayer } from '@/components/listening/DialogPlayer'
import { WritingActivity } from '@/components/writing/WritingActivity'
import { FinalSpeaking } from './FinalSpeaking'
import { Certificate } from './Certificate'

const SECTION_BAR: Record<FinalSection, string> = {
  grammar: 'bg-blue-500',
  vocabulary: 'bg-violet-500',
  reading: 'bg-emerald-500',
  listening: 'bg-cyan-500',
  writing: 'bg-orange-500',
  speaking: 'bg-rose-500',
}

/** The Final A1 Test: six sections, a score per section and a certificate. */
export function FinalTest({ onFinished, finishLabel = 'Continue' }: { onFinished?: (r: FinalTestResult) => void; finishLabel?: string }) {
  const name = useProgress((s) => s.profile.name)
  const sound = useProgress((s) => s.settings.sound)
  const [stage, setStage] = useState(-1)
  const [scores, setScores] = useState<Partial<Record<FinalSection, number>>>({})
  const [result, setResult] = useState<FinalTestResult | null>(null)

  const done = (key: FinalSection, score: number) => {
    const next = { ...scores, [key]: Math.round(score * 100) }
    setScores(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (stage + 1 < FINAL_SECTIONS.length) setStage(stage + 1)
    else {
      const all = next as Record<FinalSection, number>
      const total = Math.round(FINAL_SECTIONS.reduce((n, s) => n + all[s.key], 0) / FINAL_SECTIONS.length)
      const r: FinalTestResult = { scores: all, total, passed: total >= PASS_SCORE, date: Date.now() }
      setResult(r)
      useProgress.getState().saveFinalTest(r)
      useProgress.getState().addXp(r.passed ? 200 : 50, 'quiz')
      if (r.passed) celebrate()
      if (sound) sfx.complete()
    }
  }

  /* Intro ---------------------------------------------------------- */
  if (stage === -1) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-7 text-white shadow-lift sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 text-[10rem] opacity-20">🏆</div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Final A1 Challenge</div>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Final A1 Test</h1>
          <p className="mt-2 max-w-lg text-white/90">Six sections — like a real exam. You need {PASS_SCORE}% or more to complete level A1 and get your certificate.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="chip bg-white/20 text-white">
              <Timer size={14} /> about 20 minutes
            </span>
            <span className="chip bg-white/20 text-white">🎤 microphone recommended</span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {FINAL_SECTIONS.map((s, i) => (
            <div key={s.key} className="card flex items-center gap-4 p-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl">{s.emoji}</div>
              <div>
                <div className="font-bold">
                  {i + 1}. {s.label}
                </div>
                <div className="text-sm text-muted">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button size="xl" onClick={() => setStage(0)} iconRight={<ArrowRight size={20} />}>
            START THE TEST
          </Button>
        </div>
      </div>
    )
  }

  /* Results -------------------------------------------------------- */
  if (result) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="card p-6 text-center sm:p-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted">A1 score</div>
          <div className={cn('mt-2 text-6xl font-extrabold', result.passed ? 'text-gradient' : 'text-ink')}>{result.total}%</div>
          <h2 className="mt-3 text-2xl font-extrabold">{result.passed ? '🎉 A1 Level Completed!' : 'Almost there! 💪'}</h2>
          <p className="mt-1 text-muted">{result.passed ? 'Congratulations — you can now communicate in simple everyday situations.' : `You need ${PASS_SCORE}% to pass. Review the weak sections and try again.`}</p>
          <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
            {FINAL_SECTIONS.map((s) => (
              <div key={s.key}>
                <div className="mb-1 flex justify-between text-sm font-semibold">
                  <span>
                    {s.emoji} {s.label}
                  </span>
                  <span className="tabular-nums">{result.scores[s.key]}%</span>
                </div>
                <ProgressBar value={result.scores[s.key] / 100} size="sm" barClassName={SECTION_BAR[s.key]} />
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold">
              <span>TOTAL</span>
              <span>{result.total}%</span>
            </div>
          </div>
        </div>
        {result.passed && (
          <>
            <Certificate name={name} score={result.total} date={result.date} />
            <div className="flex justify-center">
              <Button variant="secondary" icon={<Printer size={18} />} onClick={() => window.print()}>
                Print certificate
              </Button>
            </div>
          </>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            icon={<RotateCcw size={18} />}
            onClick={() => {
              setScores({})
              setResult(null)
              setStage(-1)
            }}
          >
            Take the test again
          </Button>
          {onFinished && (
            <Button size="lg" onClick={() => onFinished(result)} iconRight={<ArrowRight size={18} />}>
              {finishLabel}
            </Button>
          )}
        </div>
      </div>
    )
  }

  /* Sections ------------------------------------------------------- */
  const section = FINAL_SECTIONS[stage]
  const source = { label: 'Final A1 Test', path: '/final-test' }
  return (
    <div>
      <div className="mx-auto mb-6 max-w-5xl">
        <div className="mb-2 flex items-center justify-between text-sm font-bold">
          <span>
            {section.emoji} Section {stage + 1} of {FINAL_SECTIONS.length}: {section.label}
          </span>
          <span className="text-muted">Final A1 Test</span>
        </div>
        <div className="flex gap-1.5">
          {FINAL_SECTIONS.map((s, i) => (
            <div key={s.key} className={cn('h-2 flex-1 rounded-full', i < stage ? SECTION_BAR[s.key] : i === stage ? 'bg-brand-400' : 'bg-surface-3')} />
          ))}
        </div>
      </div>
      <div key={section.key} className="mx-auto max-w-5xl animate-fade-up">
        {section.key === 'grammar' && (
          <div className="mx-auto max-w-2xl">
            <ExerciseRunner exercises={FINAL_GRAMMAR} skill="quiz" source={source} requeue={false} onFinish={(r) => done('grammar', r.accuracy)} />
          </div>
        )}
        {section.key === 'vocabulary' && (
          <div className="mx-auto max-w-2xl">
            <ExerciseRunner exercises={FINAL_VOCABULARY} skill="quiz" source={source} requeue={false} onFinish={(r) => done('vocabulary', r.accuracy)} />
          </div>
        )}
        {section.key === 'reading' && (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <ReadingText title={FINAL_READING.title} paragraphs={FINAL_READING.paragraphs} className="lg:sticky lg:top-24" />
            <div className="card p-4 sm:p-6">
              <ExerciseRunner embedded exercises={FINAL_READING.exercises} skill="quiz" source={source} requeue={false} onFinish={(r) => done('reading', r.accuracy)} />
            </div>
          </div>
        )}
        {section.key === 'listening' && (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="lg:sticky lg:top-24">
              <DialogPlayer lines={FINAL_LISTENING.lines} title={FINAL_LISTENING.title} />
            </div>
            <div className="card p-4 sm:p-6">
              <ExerciseRunner embedded exercises={FINAL_LISTENING.exercises} skill="quiz" source={source} requeue={false} onFinish={(r) => done('listening', r.accuracy)} />
            </div>
          </div>
        )}
        {section.key === 'writing' && <WritingActivity task={FINAL_WRITING} exam finishLabel="Next section" onDone={(score) => done('writing', score)} />}
        {section.key === 'speaking' && <FinalSpeaking items={FINAL_SPEAKING} onDone={(score) => done('speaking', score)} />}
      </div>
    </div>
  )
}
