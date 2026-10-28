import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Pause, Play, SkipForward, X } from 'lucide-react'
import type { Backdrop, TrailerScene } from '@/data/book'
import { speak, stopSpeaking } from '@/lib/speech'
import { cn } from '@/lib/cn'
import { Lighthouse } from './Lighthouse'

function Stars({ n = 40 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white" style={{ left: `${(i * 53) % 100}%`, top: `${(i * 29) % 60}%`, animationDelay: `${(i % 9) * 0.3}s` }} />
      ))}
    </>
  )
}

function BackdropArt({ kind }: { kind: Backdrop }) {
  switch (kind) {
    case 'sea':
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f59e0b] via-[#f472b6] to-[#1e3a8a]">
          <div className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_80px_30px_rgba(253,230,138,0.5)]" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-b from-[#1e40af] to-[#0b1033]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute inset-x-0 h-1 bg-amber-100/40 blur-[1px]" style={{ bottom: `${30 - i * 9}%`, marginLeft: `${30 + i * 6}%`, marginRight: `${30 + i * 6}%` }} />
          ))}
          <div className="absolute left-[20%] top-[22%] text-3xl">🕊️</div>
        </div>
      )
    case 'shop':
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b2414] to-[#1c120a]">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="absolute inset-x-[6%] flex items-end gap-1 border-b-4 border-[#5b3a1e]" style={{ top: `${8 + row * 22}%`, height: '18%' }}>
              {Array.from({ length: 26 }, (_, i) => (
                <span key={i} className="flex-1 rounded-t-sm" style={{ height: `${55 + ((i * 7 + row * 13) % 40)}%`, background: ['#b45309', '#7c2d12', '#1e3a8a', '#065f46', '#9f1239', '#a16207'][(i + row) % 6], opacity: 0.85 }} />
              ))}
            </div>
          ))}
          <div className="absolute right-[12%] top-[10%] h-24 w-24 rounded-full bg-amber-300/30 blur-2xl" />
        </div>
      )
    case 'key':
      return (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#78350f,#0c0a09_70%)]">
          <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 text-[7rem] drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] sm:text-[10rem]">🗝️</div>
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className="absolute h-1 w-1 animate-float rounded-full bg-amber-300/80" style={{ left: `${10 + ((i * 41) % 80)}%`, top: `${15 + ((i * 17) % 60)}%`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      )
    case 'lighthouse':
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#312e81] via-[#7c3aed] to-[#f472b6]">
          <Lighthouse className="absolute bottom-[8%] left-[58%] h-[78%]" />
          <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-[#1e1b4b] to-[#0b1033]" />
        </div>
      )
    case 'night':
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0b1033] to-[#1e1b4b]">
          <Stars />
          <div className="absolute left-[18%] top-[12%] h-14 w-14 rounded-full bg-slate-100 shadow-[0_0_50px_10px_rgba(241,245,249,0.3)]" />
          <Lighthouse lit beam className="absolute bottom-[8%] left-1/2 h-[80%] -translate-x-1/2" />
          <div className="absolute inset-x-0 bottom-0 h-[12%] bg-[#0b1033]" />
        </div>
      )
    case 'storm':
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-[#030712]">
          <div className="absolute inset-0 animate-[pulse_2.2s_ease-in-out_infinite] bg-white/10" />
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className="absolute h-8 w-px rotate-12 bg-sky-200/30" style={{ left: `${(i * 31) % 100}%`, top: `${(i * 47) % 90}%` }} />
          ))}
          <Lighthouse lit className="absolute bottom-[6%] left-[20%] h-[60%] opacity-80" />
          <div className="absolute right-[25%] top-[8%] text-6xl">⚡</div>
        </div>
      )
    case 'title':
      return <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b,#000_70%)]"><Stars n={30} /></div>
  }
}

/** Cinematic animated trailer with narration. */
export function TrailerPlayer({ scenes, open, onClose, onFinished }: { scenes: TrailerScene[]; open: boolean; onClose: () => void; onFinished: () => void }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const token = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const finished = useRef(onFinished)
  finished.current = onFinished

  const halt = useCallback(() => {
    token.current++
    window.clearTimeout(timer.current)
    stopSpeaking()
  }, [])

  const playFrom = useCallback(
    (k: number) => {
      halt()
      const my = token.current
      setI(k)
      setPlaying(true)
      speak(scenes[k].narration, {
        role: 'B',
        speed: 0.9,
        onEnd: () => {
          if (my !== token.current) return
          timer.current = window.setTimeout(() => {
            if (my !== token.current) return
            if (k + 1 < scenes.length) playFrom(k + 1)
            else {
              setPlaying(false)
              finished.current()
            }
          }, 1100)
        },
      })
    },
    [halt, scenes],
  )

  useEffect(() => {
    if (open) playFrom(0)
    else halt()
    return halt
  }, [open, playFrom, halt])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const scene = scenes[i]
  const isTitle = scene.backdrop === 'title'

  return createPortal(
    <div className="fixed inset-0 z-[90] flex animate-fade-in items-center justify-center bg-black" role="dialog" aria-modal="true" aria-label="Book trailer">
      <div className="relative aspect-video w-full max-w-6xl overflow-hidden bg-black">
        <div key={i} className="absolute inset-0 animate-ken-burns">
          <BackdropArt kind={scene.backdrop} />
        </div>
        {/* letterbox */}
        <div className="absolute inset-x-0 top-0 h-[9%] bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-[9%] bg-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div key={`t${i}`} className="absolute inset-x-0 bottom-[16%] px-6 text-center">
          <p
            className={cn(
              'mx-auto max-w-3xl animate-fade-up font-serif text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]',
              isTitle ? 'text-[clamp(2rem,7vw,5rem)] font-bold tracking-[0.15em] text-amber-100' : 'text-[clamp(1.1rem,3.4vw,2.4rem)] italic',
            )}
          >
            {scene.text}
          </p>
          {isTitle && <p className="mt-3 animate-fade-up text-sm font-bold uppercase tracking-[0.4em] text-white/70 [animation-delay:400ms]">Now reading on Stepwise</p>}
        </div>
        <div className="absolute inset-x-[6%] top-[3%] flex gap-1">
          {scenes.map((_, k) => (
            <span key={k} className={cn('h-1 flex-1 rounded-full', k < i ? 'bg-white' : k === i ? 'bg-amber-300' : 'bg-white/25')} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <button onClick={() => (playing ? (halt(), setPlaying(false)) : playFrom(i))} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={18} className="fill-current" /> : <Play size={18} className="ml-0.5 fill-current" />}
        </button>
        <button onClick={() => (i + 1 < scenes.length ? playFrom(i + 1) : (halt(), finished.current(), onClose()))} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25" aria-label="Next scene">
          <SkipForward size={18} />
        </button>
      </div>
      <button onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25" aria-label="Close trailer">
        <X size={20} />
      </button>
    </div>,
    document.body,
  )
}
