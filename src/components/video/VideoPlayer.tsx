import { useCallback, useEffect, useRef, useState } from 'react'
import { Captions, ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play, RotateCcw } from 'lucide-react'
import type { VideoLesson, VideoScene } from '@/types'
import { speak, stopSpeaking } from '@/lib/speech'
import { cn } from '@/lib/cn'

function SceneView({ scene }: { scene: VideoScene }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[3%] px-[6%] text-center text-white">
      <h3 className="animate-fade-up font-display text-[clamp(1.1rem,4.2vw,2.6rem)] font-extrabold leading-tight drop-shadow">{scene.heading}</h3>
      {scene.big && <div className="animate-pop text-[clamp(3rem,13vw,8rem)] leading-none drop-shadow-lg [animation-delay:150ms]">{scene.big}</div>}
      {scene.body && <p className="max-w-[90%] animate-fade-up rounded-2xl bg-black/20 px-4 py-2 text-[clamp(0.9rem,2.6vw,1.5rem)] font-semibold backdrop-blur [animation-delay:200ms]">{scene.body}</p>}
      {scene.bullets && (
        <ul className="space-y-[1.2%] text-left">
          {scene.bullets.map((b, i) => (
            <li key={b} className="flex animate-fade-up items-center gap-2 text-[clamp(0.85rem,2.4vw,1.35rem)] font-semibold" style={{ animationDelay: `${200 + i * 160}ms` }}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" /> {b}
            </li>
          ))}
        </ul>
      )}
      {scene.examples && (
        <div className="grid w-full max-w-[92%] gap-[1.5%] sm:grid-cols-2">
          {scene.examples.map((e, i) => (
            <div key={e.en} className="animate-fade-up rounded-xl bg-white/15 px-3 py-[1.2%] text-left backdrop-blur" style={{ animationDelay: `${200 + i * 160}ms` }}>
              <div className="text-[clamp(0.85rem,2.3vw,1.3rem)] font-bold">{e.en}</div>
              {e.ru && <div className="text-[clamp(0.7rem,1.7vw,0.95rem)] text-white/75">{e.ru}</div>}
            </div>
          ))}
        </div>
      )}
      {scene.table && (
        <table className="animate-fade-up overflow-hidden rounded-xl bg-white/15 text-[clamp(0.7rem,2vw,1.1rem)] backdrop-blur [animation-delay:200ms]">
          <thead>
            <tr>
              {scene.table.headers.map((h) => (
                <th key={h} className="bg-black/20 px-3 py-1.5 text-left font-bold sm:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scene.table.rows.map((r, i) => (
              <tr key={i} className="border-t border-white/10">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-1 font-semibold sm:px-5">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

/**
 * Built-in "video": animated scenes narrated by the browser voice.
 * Works like a video player — play, pause, seek by scene, captions, speed and fullscreen.
 */
export function VideoPlayer({ lesson, onEnded }: { lesson: VideoLesson; onEnded?: () => void }) {
  const [scene, setScene] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [ended, setEnded] = useState(false)
  const [full, setFull] = useState(false)
  const token = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const box = useRef<HTMLDivElement>(null)
  const total = lesson.scenes.length

  const halt = useCallback(() => {
    token.current++
    window.clearTimeout(timer.current)
    stopSpeaking()
  }, [])

  useEffect(() => halt, [halt])

  const playScene = useCallback(
    (i: number) => {
      halt()
      const my = token.current
      setScene(i)
      setPlaying(true)
      speak(lesson.scenes[i].narration, {
        role: 'narrator',
        speed,
        onEnd: () => {
          if (my !== token.current) return
          timer.current = window.setTimeout(() => {
            if (my !== token.current) return
            if (i + 1 < total) playScene(i + 1)
            else {
              setPlaying(false)
              setEnded(true)
              onEnded?.()
            }
          }, 900)
        },
      })
    },
    [halt, lesson.scenes, speed, total, onEnded],
  )

  const toggle = () => {
    if (playing) {
      halt()
      setPlaying(false)
    } else if (ended) {
      setEnded(false)
      playScene(0)
    } else playScene(scene)
  }

  const go = (i: number) => {
    const target = Math.max(0, Math.min(total - 1, i))
    if (playing) playScene(target)
    else {
      halt()
      setScene(target)
    }
  }

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void box.current?.requestFullscreen?.()
  }

  const current = lesson.scenes[scene]

  return (
    <div ref={box} className={cn('overflow-hidden rounded-3xl bg-slate-950 shadow-lift', full && 'flex flex-col justify-center rounded-none')}>
      <div className={cn('relative aspect-video w-full overflow-hidden bg-gradient-to-br', lesson.gradient)}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(0,0,0,0.25),transparent_50%)]" />
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 animate-float rounded-full bg-white/10 blur-2xl" />
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
          <span className={cn('h-2 w-2 rounded-full', playing ? 'animate-pulse bg-rose-500' : 'bg-white/60')} /> Stepwise · {lesson.category}
        </div>
        <div key={scene} className="absolute inset-0">
          <SceneView scene={current} />
        </div>
        {!playing && (
          <button onClick={toggle} className="absolute inset-0 z-10 grid place-items-center bg-black/25 transition hover:bg-black/15" aria-label={ended ? 'Replay' : 'Play'}>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-slate-900 shadow-lift transition hover:scale-105 sm:h-20 sm:w-20">
              {ended ? <RotateCcw size={30} /> : <Play size={32} className="ml-1 fill-current" />}
            </span>
          </button>
        )}
        {captions && playing && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-3">
            <p className="max-w-[92%] rounded-lg bg-black/70 px-3 py-1.5 text-center text-[clamp(0.75rem,1.9vw,1rem)] font-medium text-white">{current.narration}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 bg-slate-900 px-2 py-2 text-white sm:gap-2 sm:px-3">
        <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
        </button>
        <button onClick={() => go(scene - 1)} className="hidden h-10 w-9 place-items-center rounded-xl hover:bg-white/10 sm:grid" aria-label="Previous scene">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => go(scene + 1)} className="hidden h-10 w-9 place-items-center rounded-xl hover:bg-white/10 sm:grid" aria-label="Next scene">
          <ChevronRight size={20} />
        </button>
        <div className="mx-1 flex flex-1 gap-1">
          {lesson.scenes.map((s, i) => (
            <button key={i} onClick={() => go(i)} className="group flex h-6 flex-1 items-center" aria-label={`Scene ${i + 1}: ${s.heading}`} title={s.heading}>
              <span className={cn('h-1.5 w-full rounded-full transition-all group-hover:h-2.5', i < scene || ended ? 'bg-white' : i === scene ? 'bg-rose-400' : 'bg-white/25')} />
            </button>
          ))}
        </div>
        <span className="hidden w-12 text-center text-xs font-semibold tabular-nums text-white/70 sm:block">
          {scene + 1}/{total}
        </span>
        <button onClick={() => setSpeed((s) => (s === 1 ? 0.75 : 1))} className="h-10 rounded-xl px-2 text-xs font-bold hover:bg-white/10" aria-label="Playback speed">
          {speed === 1 ? '1×' : '0.75×'}
        </button>
        <button onClick={() => setCaptions((c) => !c)} className={cn('grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10', captions ? 'text-white' : 'text-white/40')} aria-label="Captions" aria-pressed={captions}>
          <Captions size={20} />
        </button>
        <button onClick={fullscreen} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10" aria-label="Fullscreen">
          {full ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  )
}
