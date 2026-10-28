import { useEffect, useRef, useState } from 'react'
import { Keyboard, Mic, Pause, Play, Square } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useRecorder } from '@/hooks/useRecorder'
import { stopSpeaking } from '@/lib/speech'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

/** Remember "type instead" between questions during this visit. */
let preferTyping = false

/**
 * 🎤 Speak button: recognises speech, records the voice for playback and
 * falls back to typing when the browser has no speech recognition.
 */
export function SpeakInput({
  onResult,
  disabled,
  compact,
  pickBest,
}: {
  onResult: (text: string) => void
  disabled?: boolean
  compact?: boolean
  /** Choose the best of the recogniser's alternatives (e.g. closest to the target). */
  pickBest?: (alternatives: string[]) => string
}) {
  const sr = useSpeechRecognition()
  const rec = useRecorder()
  const [typing, setTypingState] = useState(!sr.supported || preferTyping)
  const setTyping = (v: boolean) => {
    preferTyping = v
    setTypingState(v)
  }
  const [typed, setTyped] = useState('')
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const reported = useRef('')

  // Report each new final transcript once.
  useEffect(() => {
    if (sr.transcript && !sr.listening && reported.current !== sr.transcript) {
      reported.current = sr.transcript
      onResult(pickBest && sr.alternatives.length ? pickBest(sr.alternatives) : sr.transcript)
    }
  }, [sr.transcript, sr.listening, sr.alternatives, onResult, pickBest])

  // Stop recording when recognition ends.
  const { recording, stop: stopRecording } = rec
  useEffect(() => {
    if (!sr.listening && recording) stopRecording()
  }, [sr.listening, recording, stopRecording])

  const toggle = () => {
    if (sr.listening) {
      sr.stop()
      return
    }
    stopSpeaking()
    reported.current = ''
    rec.reset()
    sr.start()
    void rec.start()
  }

  const play = () => {
    if (!rec.url) return
    if (playing) {
      audio.current?.pause()
      setPlaying(false)
      return
    }
    audio.current = new Audio(rec.url)
    audio.current.onended = () => setPlaying(false)
    void audio.current.play()
    setPlaying(true)
  }

  if (typing) {
    return (
      <div className="space-y-2">
        {!sr.supported && (
          <p className="rounded-2xl bg-amber-400/10 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-200">
            🎤 Speech recognition works in Chrome, Edge and Safari. Here you can say it aloud and then type what you said.
          </p>
        )}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) onResult(typed.trim())
          }}
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={disabled}
            placeholder="Type your answer…"
            aria-label="Type your answer"
            className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 py-3 font-semibold outline-none focus:border-brand-500"
          />
          <Button type="submit" disabled={disabled || !typed.trim()}>
            Check
          </Button>
        </form>
        {sr.supported && (
          <button type="button" onClick={() => setTyping(false)} className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
            <Mic size={14} className="mr-1 inline" /> Use the microphone
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center', compact ? 'gap-2' : 'gap-3')}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={sr.listening ? 'Stop' : 'Speak'}
          className={cn(
            'relative grid place-items-center rounded-full text-white shadow-lift transition-all active:scale-95 disabled:opacity-50',
            compact ? 'h-16 w-16' : 'h-20 w-20',
            sr.listening ? 'bg-rose-500' : 'bg-gradient-to-br from-rose-500 to-pink-600 hover:scale-105',
          )}
        >
          {sr.listening && <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/40" />}
          {sr.listening ? <Square size={compact ? 22 : 26} className="relative fill-current" /> : <Mic size={compact ? 26 : 32} />}
        </button>
        {rec.url && !sr.listening && (
          <button type="button" onClick={play} className="flex h-11 items-center gap-2 rounded-2xl bg-surface-2 px-4 text-sm font-semibold hover:bg-surface-3" aria-label="Play my recording">
            {playing ? <Pause size={16} /> : <Play size={16} />} My voice
          </button>
        )}
      </div>
      <div className="min-h-6 text-center text-sm">
        {sr.listening ? (
          <span className="flex items-center gap-2 font-semibold text-rose-600 dark:text-rose-300">
            <span className="flex h-4 items-end gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="w-[3px] origin-bottom animate-wave rounded-full bg-current" style={{ height: '100%', animationDelay: `${i * 0.1}s` }} />
              ))}
            </span>
            {sr.interim ? `“${sr.interim}”` : 'Listening… tap to stop'}
          </span>
        ) : sr.error ? (
          <span className="text-rose-600 dark:text-rose-300">{sr.error}</span>
        ) : (
          <span className="font-semibold text-muted">🎤 Tap and speak</span>
        )}
      </div>
      <button type="button" onClick={() => setTyping(true)} className="flex items-center gap-1.5 text-xs font-semibold text-faint hover:text-ink">
        <Keyboard size={14} /> Can’t speak now? Type instead
      </button>
    </div>
  )
}
