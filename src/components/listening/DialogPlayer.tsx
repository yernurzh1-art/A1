import { useEffect } from 'react'
import { Pause, Play, RotateCcw, Turtle } from 'lucide-react'
import type { DialogLine } from '@/types'
import { useDialogPlayer } from '@/hooks/useDialogPlayer'
import { cn } from '@/lib/cn'

const AVATAR_TONES = ['from-cyan-400 to-sky-600', 'from-fuchsia-400 to-violet-600']

/** Audio player for dialogues: ▶ Play, ⏸ Pause, 🔁 Replay, 🐢 Slow mode. Text stays hidden. */
export function DialogPlayer({ lines, title, onPlayed }: { lines: DialogLine[]; title?: string; onPlayed?: () => void }) {
  const p = useDialogPlayer(lines)
  const speaking = p.current >= 0 ? lines[p.current].speaker : null
  const progress = p.current >= 0 ? (p.current + 1) / lines.length : p.plays > 0 ? 1 : 0

  useEffect(() => {
    if (p.plays > 0) onPlayed?.()
  }, [p.plays, onPlayed])

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lift sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">🎧 Listening</div>
          {title && <div className="mt-0.5 font-display text-lg font-bold">{title}</div>}
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          {p.plays > 0 ? `Played ${p.plays}×` : `${lines.length} lines`}
        </div>
      </div>

      {/* Speakers */}
      <div className="my-6 flex items-center justify-center gap-8 sm:gap-14">
        {p.speakers.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br text-2xl font-extrabold transition-all duration-300 sm:h-20 sm:w-20',
                AVATAR_TONES[i % 2],
                speaking === s ? 'scale-110 ring-4 ring-white/40' : 'opacity-60',
              )}
            >
              {s[0]}
            </div>
            <span className="text-sm font-semibold text-white/80">{s}</span>
            <span className={cn('flex h-4 items-end gap-[3px] transition-opacity', speaking === s ? 'opacity-100' : 'opacity-0')}>
              {[0, 1, 2, 3, 4].map((k) => (
                <span key={k} className="w-[3px] origin-bottom animate-wave rounded-full bg-cyan-300" style={{ height: '100%', animationDelay: `${k * 0.1}s` }} />
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* Line progress */}
      <div className="mb-5 flex gap-1" aria-hidden>
        {lines.map((_, i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i < Math.round(progress * lines.length) ? 'bg-cyan-300' : 'bg-white/15')} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {p.playing ? (
          <button onClick={p.pause} className="flex h-12 items-center gap-2 rounded-2xl bg-white px-5 font-bold text-slate-900 transition hover:bg-cyan-50 active:scale-95">
            <Pause size={18} className="fill-current" /> Pause
          </button>
        ) : (
          <button onClick={p.play} className="flex h-12 items-center gap-2 rounded-2xl bg-white px-5 font-bold text-slate-900 transition hover:bg-cyan-50 active:scale-95">
            <Play size={18} className="fill-current" /> {p.current > 0 ? 'Resume' : 'Play'}
          </button>
        )}
        <button onClick={p.replay} className="flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-4 font-semibold transition hover:bg-white/20 active:scale-95">
          <RotateCcw size={18} /> Replay
        </button>
        <button
          onClick={() => p.setSlow(!p.slow)}
          aria-pressed={p.slow}
          className={cn('flex h-12 items-center gap-2 rounded-2xl px-4 font-semibold transition active:scale-95', p.slow ? 'bg-cyan-300 text-slate-900' : 'bg-white/10 hover:bg-white/20')}
        >
          <Turtle size={18} /> Slow{p.slow ? ' on' : ''}
        </button>
      </div>
    </div>
  )
}
