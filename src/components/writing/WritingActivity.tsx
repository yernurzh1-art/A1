import { useMemo, useRef, useState } from 'react'
import { ArrowRight, CircleCheck, CircleAlert, Eye, EyeOff, Lightbulb, TriangleAlert, WandSparkles } from 'lucide-react'
import type { WritingTask } from '@/types'
import { checkWriting, type WritingResult } from '@/lib/writing'
import { splitSentences, wordCount } from '@/lib/text'
import { useProgress } from '@/store/progress'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ListenButton } from '@/components/ui/ListenButton'

export function WritingActivity({ task, onDone, finishLabel = 'Finish', exam = false }: { task: WritingTask; onDone: (score: number) => void; finishLabel?: string; /** Hide the example answer (tests). */ exam?: boolean }) {
  const showRu = useProgress((s) => s.settings.showRussian)
  const sound = useProgress((s) => s.settings.sound)
  const [text, setText] = useState('')
  const [result, setResult] = useState<WritingResult | null>(null)
  const [best, setBest] = useState(0)
  const [showExample, setShowExample] = useState(false)
  const area = useRef<HTMLTextAreaElement>(null)

  const words = wordCount(text)
  const sentences = useMemo(() => splitSentences(text).filter((s) => wordCount(s) > 0).length, [text])

  const insert = (hint: string) => {
    const starter = hint.replace(/…|\.\.\./g, '').replace(/\(.*?\)/g, '').trim()
    setText((t) => (t && !/\s$/.test(t) ? t + ' ' : t) + starter + ' ')
    area.current?.focus()
  }

  const check = () => {
    const r = checkWriting(text, task)
    setResult(r)
    setBest((b) => Math.max(b, r.score))
    if (sound) (r.score >= 60 ? sfx.correct : sfx.wrong)()
  }

  const tone = !result ? '' : result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-4">
        <div className="card p-5 sm:p-6">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-orange-500">✍️ Writing task</div>
          <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
            {task.emoji} {task.prompt}
          </h2>
          {showRu && <p className="mt-1 text-muted">{task.promptRu}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-sm font-bold text-muted">
              <Lightbulb size={15} /> Hints:
            </span>
            {task.hints.map((h) => (
              <button key={h} type="button" onClick={() => insert(h)} className="chip bg-orange-500/10 text-orange-700 transition hover:bg-orange-500/20 dark:text-orange-300" title="Click to add to your text">
                + {h}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <textarea
            ref={area}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            placeholder="Start writing here…"
            spellCheck
            lang="en"
            aria-label="Your text"
            className="block w-full resize-y bg-transparent p-5 text-lg leading-8 outline-none placeholder:text-faint sm:p-6"
          />
          <div className="space-y-2 border-t border-line bg-surface-2 px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
              <span className={cn(words >= task.minWords ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted')}>
                {words} / {task.minWords} words
              </span>
              <span className={cn(sentences >= task.minSentences ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted')}>
                {sentences} / {task.minSentences} sentences
              </span>
            </div>
            <ProgressBar value={words / task.minWords} size="xs" barClassName={words >= task.minWords ? 'bg-emerald-500' : 'bg-orange-400'} label="Word count" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {exam ? (
            <span />
          ) : (
            <Button variant="ghost" icon={showExample ? <EyeOff size={16} /> : <Eye size={16} />} onClick={() => setShowExample((v) => !v)}>
              {showExample ? 'Hide example' : 'Show example answer'}
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" disabled={words === 0} onClick={check} icon={<WandSparkles size={16} />}>
              Check answer
            </Button>
            <Button disabled={!result} onClick={() => onDone(best / 100)} iconRight={<ArrowRight size={16} />}>
              {finishLabel}
            </Button>
          </div>
        </div>

        {showExample && !exam && (
          <div className="animate-fade-up rounded-3xl border border-dashed border-orange-300 bg-orange-50/60 p-5 dark:border-orange-500/30 dark:bg-orange-500/5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">Example answer</span>
              <ListenButton text={task.example} size="sm" />
            </div>
            <p className="leading-7">{task.example}</p>
          </div>
        )}
      </div>

      <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
        {result ? (
          <div className="animate-fade-up">
            <div className="flex items-center gap-4">
              <ProgressRing value={result.score / 100} size={84} stroke={8} color={tone}>
                <span className="text-xl font-extrabold">{result.score}</span>
              </ProgressRing>
              <div>
                <div className="text-xl font-extrabold">{result.score >= 80 ? 'Excellent writing! 🌟' : result.score >= 60 ? 'Good job! 👍' : 'Keep going! 💪'}</div>
                <div className="text-sm text-muted">Automatic check · score out of 100</div>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5">
              {result.items.map((it, i) => (
                <li key={i} className="flex gap-3">
                  {it.status === 'pass' ? (
                    <CircleCheck size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                  ) : it.status === 'warn' ? (
                    <TriangleAlert size={20} className="mt-0.5 shrink-0 text-amber-500" />
                  ) : (
                    <CircleAlert size={20} className="mt-0.5 shrink-0 text-rose-500" />
                  )}
                  <div>
                    <div className="font-semibold">{it.title}</div>
                    {it.detail && <div className="text-sm text-muted">{it.detail}</div>}
                  </div>
                </li>
              ))}
            </ul>
            {result.grammarIssues.length > 0 && (
              <div className="mt-5 rounded-2xl bg-amber-400/10 p-4">
                <div className="mb-2 text-sm font-bold text-amber-700 dark:text-amber-300">Grammar tips</div>
                <ul className="space-y-1.5 text-sm">
                  {result.grammarIssues.map((g, i) => (
                    <li key={i}>
                      <span className="rounded bg-rose-500/15 px-1.5 font-mono text-rose-700 line-through decoration-rose-400 dark:text-rose-300">{g.found}</span> — {g.tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-xs text-faint">Edit your text and check again to improve your score. Your best score counts.</p>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-500/10 text-3xl">🔎</div>
            <h3 className="mt-4 text-lg font-extrabold">Instant feedback</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">Write your text and press “Check answer”. We check length, sentences, capital letters, punctuation, key structures and common A1 mistakes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
