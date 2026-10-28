import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Square, Turtle, Volume2 } from 'lucide-react'
import { speakSequence } from '@/lib/speech'
import { splitSentences } from '@/lib/text'
import { cn } from '@/lib/cn'
import { ListenButton } from '@/components/ui/ListenButton'

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** A text with 🔊 read-aloud (sentence highlighting) and tap-to-translate glossary words. */
export function ReadingText({ paragraphs, glossary = {}, title, className }: { paragraphs: string[]; glossary?: Record<string, string>; title?: string; className?: string }) {
  const sentences = useMemo(() => paragraphs.map((p) => splitSentences(p)), [paragraphs])
  const flat = useMemo(() => sentences.flat(), [sentences])
  const [current, setCurrent] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const cancel = useRef<(() => void) | null>(null)

  useEffect(() => () => cancel.current?.(), [])

  const re = useMemo(() => {
    const keys = Object.keys(glossary).sort((a, b) => b.length - a.length)
    return keys.length ? new RegExp(`\\b(${keys.map(escapeRe).join('|')})\\b`, 'gi') : null
  }, [glossary])

  const read = (speed = 1) => {
    cancel.current?.()
    setPlaying(true)
    cancel.current = speakSequence(
      flat.map((text) => ({ text, role: 'narrator' as const })),
      { speed, gapMs: 200, onItem: setCurrent, onDone: () => { setPlaying(false); setCurrent(-1) } },
    )
  }
  const stop = () => {
    cancel.current?.()
    setPlaying(false)
    setCurrent(-1)
  }

  const renderGloss = (text: string, keyBase: string) => {
    if (!re) return text
    const parts = text.split(re)
    return parts.map((part, i) => {
      const key = Object.keys(glossary).find((k) => k.toLowerCase() === part.toLowerCase())
      if (!key) return <Fragment key={i}>{part}</Fragment>
      const id = `${keyBase}-${i}`
      return (
        <span key={i} className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === id ? null : id)}
            className="rounded-sm underline decoration-brand-400 decoration-dotted decoration-2 underline-offset-4 hover:bg-brand-500/10"
          >
            {part}
          </button>
          {open === id && (
            <span className="absolute bottom-full left-1/2 z-20 mb-2 flex -translate-x-1/2 animate-pop items-center gap-1 whitespace-nowrap rounded-xl bg-slate-900 py-1.5 pl-3 pr-1 text-sm font-semibold text-white shadow-lift dark:bg-white dark:text-slate-900">
              {glossary[key]}
              <ListenButton text={part} size="sm" variant="plain" className="text-current" />
            </span>
          )}
        </span>
      )
    })
  }

  let counter = 0
  return (
    <div className={cn('card p-5 sm:p-7', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {title && <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>}
        <div className="flex gap-2">
          {playing ? (
            <button onClick={stop} className="flex h-10 items-center gap-2 rounded-2xl bg-brand-500 px-4 text-sm font-bold text-white shadow-glow">
              <Square size={14} className="fill-current" /> Stop
            </button>
          ) : (
            <button onClick={() => read()} className="flex h-10 items-center gap-2 rounded-2xl bg-brand-500/10 px-4 text-sm font-bold text-brand-600 hover:bg-brand-500/20 dark:text-brand-300">
              <Volume2 size={16} /> Listen to the text
            </button>
          )}
          <button onClick={() => read(0.7)} disabled={playing} className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-2 text-muted hover:text-ink disabled:opacity-50" aria-label="Listen slowly">
            <Turtle size={18} />
          </button>
        </div>
      </div>
      <div className="space-y-4 text-[17px] leading-8 sm:text-lg sm:leading-9">
        {sentences.map((list, p) => (
          <p key={p}>
            {list.map((s) => {
              const idx = counter++
              return (
                <span key={idx} className={cn('rounded-md transition-colors', current === idx && 'bg-amber-300/40 dark:bg-amber-400/25')}>
                  {renderGloss(s, `${idx}`)}{' '}
                </span>
              )
            })}
          </p>
        ))}
      </div>
      {Object.keys(glossary).length > 0 && <p className="mt-5 text-xs text-faint">Tip: tap the underlined words to see the translation.</p>}
    </div>
  )
}
