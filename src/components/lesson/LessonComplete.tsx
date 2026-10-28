import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Flame, RotateCcw, Star, Target } from 'lucide-react'
import { celebrate } from '@/lib/confetti'
import { sfx } from '@/lib/sound'
import { useCountUp } from '@/hooks/useCountUp'
import { useProgress, displayStreak, todayXp } from '@/store/progress'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/cn'

function formatTime(ms: number) {
  const s = Math.max(1, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function LessonComplete({
  xp,
  accuracy,
  durationMs,
  title = 'Lesson Complete!',
  isRepeat,
  onContinue,
  continueLabel = 'Continue',
  onRetry,
  hasMistakes,
}: {
  xp: number
  accuracy: number
  durationMs: number
  title?: string
  isRepeat?: boolean
  onContinue: () => void
  continueLabel?: string
  onRetry?: () => void
  hasMistakes?: boolean
}) {
  const sound = useProgress((s) => s.settings.sound)
  const streak = useProgress(displayStreak)
  const today = useProgress(todayXp)
  const goal = useProgress((s) => s.profile.dailyGoal)
  const xpShown = useCountUp(xp)
  const acc = Math.round(accuracy * 100)
  const accShown = useCountUp(acc)

  useEffect(() => {
    celebrate()
    if (sound) sfx.complete()
  }, [sound])

  const message = acc >= 95 ? 'Flawless! You are on fire 🔥' : acc >= 80 ? 'Great work — keep it up!' : acc >= 60 ? 'Good job! Practice makes perfect.' : 'You finished it! Review your mistakes to improve.'

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center py-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse-ring rounded-full" />
        <div className="grid h-28 w-28 animate-pop place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-6xl shadow-lift">🎉</div>
      </div>
      <h1 className="animate-fade-up text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <p className="mt-2 animate-fade-up text-muted [animation-delay:100ms]">{message}</p>

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: `+${xpShown}`, icon: Star, tone: 'border-amber-400 text-amber-500', head: 'bg-amber-400' },
          { label: 'Accuracy', value: `${accShown}%`, icon: Target, tone: 'border-emerald-500 text-emerald-500', head: 'bg-emerald-500' },
          { label: 'Time', value: formatTime(durationMs), icon: Clock, tone: 'border-sky-500 text-sky-500', head: 'bg-sky-500' },
        ].map((t, i) => (
          <div key={t.label} className={cn('animate-fade-up overflow-hidden rounded-2xl border-2 bg-surface', t.tone)} style={{ animationDelay: `${150 + i * 100}ms` }}>
            <div className={cn('py-1 text-[11px] font-extrabold uppercase tracking-wider text-white', t.head)}>{t.label}</div>
            <div className="flex items-center justify-center gap-1.5 py-3 text-xl font-extrabold tabular-nums">
              <t.icon size={18} /> {t.value}
            </div>
          </div>
        ))}
      </div>

      {isRepeat && <p className="mt-3 text-xs text-faint">Repeated lessons give half XP.</p>}

      <div className="mt-6 w-full animate-fade-up rounded-2xl border border-line bg-surface p-4 text-left [animation-delay:450ms]">
        <div className="mb-2 flex items-center justify-between text-sm font-bold">
          <span className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" /> {streak} day streak
          </span>
          <span className="text-muted">
            Daily goal: {Math.min(today, goal)} / {goal} XP
          </span>
        </div>
        <ProgressBar value={today / goal} size="sm" barClassName="bg-gradient-to-r from-amber-400 to-orange-500" />
      </div>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-[auto_1fr]">
        {onRetry && (
          <Button variant="secondary" size="lg" icon={<RotateCcw size={18} />} onClick={onRetry}>
            Try again
          </Button>
        )}
        <Button size="lg" onClick={onContinue} iconRight={<ArrowRight size={18} />} autoFocus className={onRetry ? '' : 'sm:col-span-2'}>
          {continueLabel}
        </Button>
      </div>
      {hasMistakes && (
        <Link to="/review" className="mt-4 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
          Review your mistakes →
        </Link>
      )}
    </div>
  )
}
