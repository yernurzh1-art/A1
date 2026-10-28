import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Heart, HeartCrack, X, Zap } from 'lucide-react'
import type { AnswerValue, Exercise, Skill } from '@/types'
import { checkAnswer, correctAnswerText, givenAnswerText, isAnswerReady } from '@/lib/exercises'
import { useProgress } from '@/store/progress'
import { sfx } from '@/lib/sound'
import { sparkle } from '@/lib/confetti'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ExerciseView, defaultPrompt } from './ExerciseView'

export interface RunnerResult {
  accuracy: number
  correct: number
  total: number
  wrong: number
}

const PRAISE = ['Correct!', 'Great job!', 'Excellent!', 'Well done!', 'Perfect!', 'Nice one!', 'Brilliant!']

export interface ExerciseRunnerProps {
  exercises: Exercise[]
  skill: Skill
  /** Where the exercise comes from (saved with mistakes). */
  source: { label: string; path: string }
  /** Lessons in the course cost hearts for mistakes. */
  useHearts?: boolean
  /** Review mode: correct answers fix saved mistakes and give hearts back. */
  review?: boolean
  /** Ask wrong questions again at the end. */
  requeue?: boolean
  onFinish: (r: RunnerResult) => void
  onExit?: () => void
  /** Smaller header for exercises embedded in a page. */
  embedded?: boolean
  title?: ReactNode
}

export function ExerciseRunner({ exercises, skill, source, useHearts = false, review = false, requeue = true, onFinish, onExit, embedded = false, title }: ExerciseRunnerProps) {
  const navigate = useNavigate()
  const [queue, setQueue] = useState(() => exercises.map((ex) => ({ ex, retry: false })))
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState<AnswerValue>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [combo, setCombo] = useState(0)
  const [praise, setPraise] = useState(PRAISE[0])
  const [outOfHearts, setOutOfHearts] = useState(false)
  const firstTry = useRef(new Map<string, boolean>())
  // Guards against double evaluation (fast double clicks / Enter + click).
  const locked = useRef(false)

  const hearts = useProgress((s) => s.hearts.count)
  const unlimited = useProgress((s) => s.settings.unlimitedHearts)
  const sound = useProgress((s) => s.settings.sound)
  const { recordMistake, resolveMistake, loseHeart, gainHeart, syncHearts } = useProgress.getState()

  useEffect(() => {
    syncHearts()
  }, [syncHearts])

  const item = queue[index]
  const ex = item?.ex
  const ready = !!ex && (ex.kind === 'match' ? false : isAnswerReady(ex, value))

  const evaluate = useCallback(
    (ok: boolean) => {
      if (!ex || locked.current) return
      locked.current = true
      setChecked(true)
      setCorrect(ok)
      if (!firstTry.current.has(ex.id)) firstTry.current.set(ex.id, ok)
      if (ok) {
        if (sound) sfx.correct()
        setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)])
        setCombo((c) => {
          const next = c + 1
          if (next >= 3 && next % 2 === 1) sparkle(0.5, 0.85)
          return next
        })
        resolveMistake(ex.id)
        if (review) gainHeart()
      } else {
        if (sound) sfx.wrong()
        setCombo(0)
        recordMistake({ exercise: ex, skill, source: source.label, path: source.path, given: givenAnswerText(ex, value), correct: correctAnswerText(ex) })
        if (useHearts) loseHeart()
        if (requeue && !item.retry) setQueue((q) => [...q, { ex, retry: true }])
      }
    },
    [ex, sound, resolveMistake, review, gainHeart, recordMistake, skill, source, value, useHearts, loseHeart, requeue, item],
  )

  const check = useCallback(() => {
    if (!ex || checked || !ready) return
    evaluate(checkAnswer(ex, value))
  }, [ex, checked, ready, evaluate, value])

  const finish = useCallback(() => {
    const total = firstTry.current.size || 1
    const right = [...firstTry.current.values()].filter(Boolean).length
    onFinish({ accuracy: right / total, correct: right, total, wrong: total - right })
  }, [onFinish])

  const next = useCallback(() => {
    if (useHearts && !unlimited && useProgress.getState().hearts.count <= 0) {
      setOutOfHearts(true)
      return
    }
    if (index + 1 >= queue.length) {
      finish()
      return
    }
    locked.current = false
    setIndex((i) => i + 1)
    setValue(null)
    setChecked(false)
    setCorrect(false)
  }, [useHearts, unlimited, index, queue.length, finish])

  // Enter = check / continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || outOfHearts) return
      const target = e.target as HTMLElement
      if (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && !checked)) return
      // We handle Enter ourselves (this also stops a focused button from clicking twice).
      e.preventDefault()
      if (checked) next()
      else check()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [checked, next, check, outOfHearts])

  const progress = useMemo(() => (queue.length ? (index + (checked ? 1 : 0)) / queue.length : 0), [index, checked, queue.length])

  if (!ex) return null

  return (
    <div className={cn('flex flex-col', !embedded && 'min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-7rem)]')}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 sm:gap-4">
        {onExit && (
          <button onClick={onExit} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink" aria-label="Exit">
            <X size={22} />
          </button>
        )}
        <div className="flex-1">
          {title && <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">{title}</div>}
          <ProgressBar value={progress} size={embedded ? 'sm' : 'md'} barClassName="bg-gradient-to-r from-emerald-400 to-emerald-500" label="Lesson progress" />
        </div>
        {combo >= 3 && (
          <div className="flex animate-pop items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-300">
            <Zap size={14} className="fill-current" /> {combo}
          </div>
        )}
        {useHearts && (
          <div className={cn('flex items-center gap-1 font-extrabold', hearts <= 1 && !unlimited ? 'text-rose-500' : 'text-rose-500')} title="Hearts">
            <Heart size={20} className="fill-current" />
            <span className="tabular-nums">{unlimited ? '∞' : hearts}</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div key={`${ex.id}-${index}`} className="mx-auto w-full max-w-2xl flex-1 animate-fade-up">
        <div className="mb-5 flex items-center gap-2">
          {item.retry && <span className="chip bg-amber-400/15 text-amber-700 dark:text-amber-300">↻ Try again</span>}
          <h2 className="text-lg font-extrabold text-ink-2 sm:text-xl">{defaultPrompt(ex)}</h2>
        </div>
        <ExerciseView exercise={ex} value={value} onChange={setValue} checked={checked} correct={correct} onSubmit={check} onResolved={evaluate} />
      </div>

      {/* Footer / feedback */}
      <div
        className={cn(
          'sticky bottom-0 z-10 mt-8 -mx-4 border-t px-4 py-4 sm:-mx-6 sm:px-6',
          embedded && 'rounded-b-3xl',
          !checked && 'border-line bg-bg/90 backdrop-blur',
          checked && correct && 'animate-slide-up border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-[#0f2a22]',
          checked && !correct && 'animate-slide-up border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-[#2c1219]',
        )}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {checked ? (
            <div className="flex items-start gap-3">
              <div className={cn('grid h-11 w-11 shrink-0 animate-pop place-items-center rounded-full text-white', correct ? 'bg-emerald-500' : 'bg-rose-500')}>
                {correct ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
              </div>
              <div className="min-w-0">
                <div className={cn('text-lg font-extrabold', correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300')}>
                  {correct ? `✅ ${praise}` : '❌ Not quite'}
                </div>
                {!correct && ex.kind !== 'match' && (
                  <div className="text-sm text-rose-800 dark:text-rose-200">
                    Correct answer: <b>{correctAnswerText(ex)}</b>
                  </div>
                )}
                {ex.explanation && <div className={cn('mt-0.5 text-sm', correct ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200')}>💡 {ex.explanation}</div>}
              </div>
            </div>
          ) : (
            <div className="hidden text-sm text-muted sm:block">
              {ex.kind === 'match' ? 'Match all the pairs to continue' : 'Press Enter to check'}
            </div>
          )}
          {checked ? (
            <Button variant={correct ? 'success' : 'danger'} size="lg" className="sm:min-w-40" onClick={next} autoFocus>
              Continue
            </Button>
          ) : (
            <Button size="lg" className="sm:min-w-40" disabled={!ready} onClick={check}>
              Check
            </Button>
          )}
        </div>
      </div>

      <Modal open={outOfHearts} onClose={() => onExit?.()} hideClose title="Out of hearts">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 animate-pop place-items-center rounded-full bg-rose-500/10 text-rose-500">
            <HeartCrack size={40} />
          </div>
          <h3 className="text-2xl font-extrabold">You’re out of hearts</h3>
          <p className="mt-2 text-muted">A new heart comes every 15 minutes. Practise your mistakes to earn hearts back right now!</p>
          <div className="mt-6 grid gap-3">
            <Button size="lg" onClick={() => navigate('/review')}>
              Practise mistakes (+❤️)
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onExit?.()}>
              End lesson
            </Button>
          </div>
          <p className="mt-4 text-xs text-faint">Teachers: turn on “Unlimited hearts” in Profile → Settings.</p>
        </div>
      </Modal>
    </div>
  )
}
