import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bot, Eye, Lightbulb, RotateCcw, SkipForward } from 'lucide-react'
import type { SpeakingItem, SpeakingTask } from '@/types'
import { compareSentence, evaluateOpenAnswer, extractName, type CompareResult, type OpenAnswerResult } from '@/lib/text'
import { speak } from '@/lib/speech'
import { SPEAKING_TYPES } from '@/data/speaking'
import { useProgress } from '@/store/progress'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ListenButton } from '@/components/ui/ListenButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SpeakInput } from './SpeakInput'
import { OpenFeedback, RepeatFeedback, scoreMessage } from './SpeechFeedback'

type Attempt = { said: string; score: number; repeat?: CompareResult; open?: OpenAnswerResult }

export function evaluateItem(item: SpeakingItem, said: string): Attempt {
  if (item.target) {
    const r = compareSentence(item.target, said)
    return { said, score: r.score, repeat: r }
  }
  const r = evaluateOpenAnswer(said, item.keywords, item.minWords ?? 3)
  return { said, score: r.score, open: r }
}

/** Pick the recogniser alternative that best matches the target sentence. */
function bestAlternative(item: SpeakingItem) {
  return (alts: string[]) => {
    if (!item.target) return alts[0]
    return alts.reduce((best, a) => (compareSentence(item.target!, a).score > compareSentence(item.target!, best).score ? a : best), alts[0])
  }
}

export function SpeakingActivity({ task, onDone }: { task: SpeakingTask; onDone: (accuracy: number) => void }) {
  return task.type === 'roleplay' || task.type === 'dialogue' ? <RolePlay task={task} onDone={onDone} /> : <SpeakingCards task={task} onDone={onDone} />
}

function TaskHeader({ task }: { task: SpeakingTask }) {
  const meta = SPEAKING_TYPES[task.type]
  return (
    <div className="mb-5">
      <div className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-500">
        {meta.emoji} {meta.label}
      </div>
      <h2 className="text-2xl font-extrabold">{task.title}</h2>
      <p className="mt-1 text-muted">{task.instructions}</p>
    </div>
  )
}

function Scene({ task }: { task: SpeakingTask }) {
  if (!task.scene) return null
  return (
    <figure className="mb-5 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-sky-100 via-white to-amber-50 p-6 text-center dark:from-sky-500/10 dark:via-surface dark:to-amber-500/10">
      <div className="flex flex-wrap items-end justify-center gap-2 text-5xl sm:gap-4 sm:text-6xl">
        {task.scene.items.map((e, i) => (
          <span key={i} className="inline-block animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            {e}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-sm font-semibold text-muted">🖼️ {task.scene.caption}</figcaption>
    </figure>
  )
}

function Hints({ hints }: { hints?: string[] }) {
  if (!hints?.length) return null
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <span className="flex items-center gap-1 text-sm font-bold text-muted">
        <Lightbulb size={15} /> Hints:
      </span>
      {hints.map((h) => (
        <span key={h} className="chip bg-surface-2 text-ink-2">
          {h}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Card mode: repeat / answer / introduce / describe                  */
/* ------------------------------------------------------------------ */

function SpeakingCards({ task, onDone }: { task: SpeakingTask; onDone: (accuracy: number) => void }) {
  const showRu = useProgress((s) => s.settings.showRussian)
  const sound = useProgress((s) => s.settings.sound)
  const [index, setIndex] = useState(0)
  const [best, setBest] = useState<number[]>(() => task.items.map(() => 0))
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [inputKey, setInputKey] = useState(0)
  const item = task.items[index]
  const last = index === task.items.length - 1

  const onResult = useCallback(
    (said: string) => {
      const a = evaluateItem(item, said)
      setAttempt(a)
      setBest((b) => b.map((v, i) => (i === index ? Math.max(v, a.score) : v)))
      if (sound) (a.score >= 0.6 ? sfx.correct : sfx.wrong)()
    },
    [item, index, sound],
  )

  const next = () => {
    if (last) {
      onDone(best.reduce((a, b) => a + b, 0) / best.length)
      return
    }
    setIndex((i) => i + 1)
    setAttempt(null)
    setInputKey((k) => k + 1)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <TaskHeader task={task} />
      <Scene task={task} />
      <Hints hints={task.hints} />
      <div className="mb-3 flex items-center gap-3">
        <ProgressBar value={(index + (attempt ? 1 : 0)) / task.items.length} size="sm" barClassName="bg-gradient-to-r from-rose-400 to-pink-500" />
        <span className="shrink-0 text-sm font-bold text-muted">
          {index + 1} / {task.items.length}
        </span>
      </div>

      <div key={index} className="card animate-fade-up p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted">{item.target ? 'Repeat after me' : 'Answer the question'}</div>
            <p className="mt-2 text-2xl font-extrabold leading-snug sm:text-3xl">{item.prompt}</p>
            {showRu && item.promptRu && <p className="mt-1 text-muted">{item.promptRu}</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <ListenButton text={item.prompt} />
            <ListenButton text={item.prompt} slow />
          </div>
        </div>
        {item.starter && <p className="mt-4 rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-ink-2">💬 Start with: <b>{item.starter}</b></p>}

        <div className="mt-6">
          <SpeakInput key={inputKey} onResult={onResult} pickBest={bestAlternative(item)} />
        </div>

        {attempt && (
          <div className="mt-6">
            {attempt.repeat ? (
              <RepeatFeedback said={attempt.said} result={attempt.repeat} />
            ) : (
              attempt.open && <OpenFeedback said={attempt.said} result={attempt.open} sample={item.sample} minWords={item.minWords ?? 3} />
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={next} className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <SkipForward size={16} /> Skip
        </button>
        <div className="flex gap-2">
          {attempt && attempt.score < 0.85 && (
            <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={() => { setAttempt(null); setInputKey((k) => k + 1) }}>
              Try again
            </Button>
          )}
          <Button disabled={!attempt} onClick={next} iconRight={<ArrowRight size={16} />}>
            {last ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Chat mode: role play / complete the dialogue                       */
/* ------------------------------------------------------------------ */

interface Message {
  from: 'ai' | 'me'
  text: string
  score?: number
}

function RolePlay({ task, onDone }: { task: SpeakingTask; onDone: (accuracy: number) => void }) {
  const sound = useProgress((s) => s.settings.sound)
  const [messages, setMessages] = useState<Message[]>([])
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [pending, setPending] = useState<Attempt | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [inputKey, setInputKey] = useState(0)
  const [finished, setFinished] = useState(false)
  const name = useRef('friend')
  const bottom = useRef<HTMLDivElement>(null)
  const item = task.items[index]
  const partner = task.type === 'dialogue' ? 'Friend' : 'AI partner'

  const sayAi = useCallback((text: string) => {
    setMessages((m) => [...m, { from: 'ai', text }])
    speak(text, { role: 'B' })
  }, [])

  // First line.
  useEffect(() => {
    const t = window.setTimeout(() => sayAi(task.items[0].prompt), 400)
    return () => window.clearTimeout(t)
  }, [task, sayAi])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, pending, finished])

  const advance = useCallback(
    (score: number) => {
      setScores((s) => [...s, score])
      setPending(null)
      setShowExample(false)
      const reply = item.reply?.replace(/\{name\}/g, name.current)
      const nextIndex = index + 1
      window.setTimeout(() => {
        if (reply) sayAi(reply)
        window.setTimeout(
          () => {
            if (nextIndex < task.items.length) {
              setIndex(nextIndex)
              setInputKey((k) => k + 1)
              sayAi(task.items[nextIndex].prompt)
            } else setFinished(true)
          },
          reply ? 1400 : 300,
        )
      }, 500)
    },
    [item, index, task.items, sayAi],
  )

  const onResult = useCallback(
    (said: string) => {
      const a = evaluateItem(item, said)
      const found = extractName(said)
      if (found && index === 0) name.current = found
      setMessages((m) => [...m, { from: 'me', text: said, score: a.score }])
      if (sound) (a.score >= 0.5 ? sfx.correct : sfx.wrong)()
      if (a.score >= 0.5) advance(a.score)
      else setPending(a)
    },
    [item, index, sound, advance],
  )

  const total = useMemo(() => (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0), [scores])

  return (
    <div className="mx-auto max-w-2xl">
      <TaskHeader task={task} />
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-5 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl text-white">
            {task.emoji}
          </div>
          <div>
            <div className="font-bold">{task.title}</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> {partner} · online
            </div>
          </div>
          <div className="ml-auto text-sm font-bold text-muted">
            {Math.min(index + 1, task.items.length)} / {task.items.length}
          </div>
        </div>

        <div className="max-h-[26rem] min-h-64 space-y-3 overflow-y-auto bg-dots p-4 sm:p-5">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex animate-fade-up items-end gap-2', m.from === 'me' && 'flex-row-reverse')}>
              {m.from === 'ai' && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-3xl px-4 py-2.5 text-[15px] font-medium shadow-soft',
                  m.from === 'ai' ? 'rounded-bl-md bg-surface' : 'rounded-br-md bg-brand-500 text-white',
                )}
              >
                {m.text}
                {m.from === 'ai' && <ListenButton text={m.text} size="sm" variant="plain" className="-my-1 ml-1 align-middle" />}
                {m.score !== undefined && (
                  <div className="mt-1 text-right text-[11px] font-bold opacity-80">{scoreMessage(m.score).title} · {Math.round(m.score * 100)}%</div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottom} />
        </div>

        <div className="border-t border-line p-4 sm:p-5">
          {finished ? (
            <div className="text-center">
              <div className="text-4xl">🎉</div>
              <p className="mt-2 text-lg font-extrabold">Conversation complete!</p>
              <p className="text-sm text-muted">Average score: {Math.round(total * 100)}%</p>
              <Button className="mt-4" size="lg" onClick={() => onDone(total)} iconRight={<ArrowRight size={18} />}>
                Finish
              </Button>
            </div>
          ) : pending ? (
            <div className="space-y-3">
              {pending.open && <OpenFeedback said={pending.said} result={pending.open} sample={item.sample} minWords={item.minWords ?? 3} />}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => advance(pending.score)}>
                  Continue anyway
                </Button>
                <Button icon={<RotateCcw size={16} />} onClick={() => { setPending(null); setInputKey((k) => k + 1) }}>
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-bold text-muted">Your turn {item.starter && <span className="font-normal">· start with “{item.starter}”</span>}</span>
                <button type="button" onClick={() => setShowExample((v) => !v)} className="flex items-center gap-1 font-semibold text-brand-600 hover:underline dark:text-brand-300">
                  <Eye size={14} /> {showExample ? 'Hide' : 'Show'} example
                </button>
              </div>
              {showExample && (
                <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2 text-sm">
                  <span className="flex-1">{item.sample}</span>
                  <ListenButton text={item.sample} size="sm" variant="plain" />
                </div>
              )}
              <SpeakInput key={inputKey} onResult={onResult} compact />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
