import type { CompareResult, OpenAnswerResult } from '@/lib/text'
import { ListenButton } from '@/components/ui/ListenButton'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { cn } from '@/lib/cn'

export function scoreMessage(score: number): { title: string; tone: 'great' | 'good' | 'retry' } {
  if (score >= 0.85) return { title: 'Excellent! 🌟', tone: 'great' }
  if (score >= 0.6) return { title: 'Good job! 👍', tone: 'good' }
  return { title: "Let's try again 💪", tone: 'retry' }
}

const TONE = {
  great: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10',
  good: 'border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10',
  retry: 'border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10',
}
const RING = { great: '#10b981', good: '#f59e0b', retry: '#f43f5e' }

/** Feedback for "repeat the sentence": coloured words + words to practise. */
export function RepeatFeedback({ said, result }: { said: string; result: CompareResult }) {
  const msg = scoreMessage(result.score)
  return (
    <div className={cn('animate-fade-up rounded-3xl border p-4 sm:p-5', TONE[msg.tone])}>
      <div className="flex items-center gap-4">
        <ProgressRing value={result.score} size={60} stroke={6} color={RING[msg.tone]}>
          <span className="text-sm font-extrabold">{Math.round(result.score * 100)}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <div className="text-lg font-extrabold">{msg.title}</div>
          <div className="truncate text-sm text-muted">You said: “{said}”</div>
        </div>
      </div>
      <p className="mt-4 text-lg font-bold leading-relaxed">
        {result.words.map((w, i) => (
          <span key={i} className={cn('mr-1.5 inline-block rounded-md px-1', w.ok ? 'text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 underline decoration-wavy dark:text-rose-300')}>
            {w.word}
          </span>
        ))}
      </p>
      {result.missed.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Words to practise</div>
          <div className="flex flex-wrap gap-2">
            {result.missed.map((w, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-surface py-1 pl-3 pr-1 text-sm font-semibold shadow-soft">
                {w} <ListenButton text={w} size="sm" variant="plain" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Feedback for open answers: transcript, key words and a model answer. */
export function OpenFeedback({ said, result, sample, minWords }: { said: string; result: OpenAnswerResult; sample: string; minWords: number }) {
  const msg = scoreMessage(result.score)
  return (
    <div className={cn('animate-fade-up rounded-3xl border p-4 sm:p-5', TONE[msg.tone])}>
      <div className="flex items-center gap-4">
        <ProgressRing value={result.score} size={60} stroke={6} color={RING[msg.tone]}>
          <span className="text-sm font-extrabold">{Math.round(result.score * 100)}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <div className="text-lg font-extrabold">{msg.title}</div>
          <div className="text-sm text-muted">
            {result.wordCount} words{result.wordCount < minWords && ` · try to say at least ${minWords}`}
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-surface/70 px-4 py-3 font-semibold">“{said}”</p>
      <ul className="mt-3 space-y-1 text-sm">
        {result.totalGroups > 0 && (
          <li>
            {result.usedGroups === result.totalGroups ? '✅' : '⚠️'} You used {result.usedGroups} of {result.totalGroups} key ideas.
          </li>
        )}
        {result.missingHints.length > 0 && <li>💡 Try to use: <b>{result.missingHints.join(', ')}</b></li>}
      </ul>
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 text-sm">
        <span className="font-bold text-muted">Example:</span>
        <span className="flex-1">{sample}</span>
        <ListenButton text={sample} size="sm" variant="plain" />
      </div>
    </div>
  )
}
