/**
 * Text-to-speech built on the browser's Web Speech API (no audio files needed).
 * Every "🔊 Listen" button, dialogue and video narration goes through here.
 */

export type VoiceRole = 'A' | 'B' | 'narrator'

let cachedVoices: SpeechSynthesisVoice[] = []
const listeners = new Set<() => void>()

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

function loadVoices() {
  if (!ttsSupported()) return
  const all = window.speechSynthesis.getVoices()
  if (all.length) {
    cachedVoices = all.filter((v) => v.lang.toLowerCase().startsWith('en'))
    listeners.forEach((l) => l())
  }
}

if (ttsSupported()) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

export function englishVoices(): SpeechSynthesisVoice[] {
  if (!cachedVoices.length) loadVoices()
  return cachedVoices
}

export function onVoicesChanged(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

const FEMALE_HINTS = /(female|samantha|victoria|karen|moira|tessa|serena|susan|zira|aria|jenny|libby|sonia|emma|ava|allison|kate|google us english|google uk english female)/i
const MALE_HINTS = /(male|daniel|alex|fred|tom|oliver|george|guy|ryan|david|mark|arthur|james|google uk english male)/i

/** Settings set by the store (preferred voice and base speed). */
const prefs = { voiceURI: '' as string | undefined, rate: 0.95 }

export function setSpeechPrefs(next: { voiceURI?: string; rate?: number }) {
  if ('voiceURI' in next) prefs.voiceURI = next.voiceURI
  if (typeof next.rate === 'number') prefs.rate = next.rate
}

function rank(v: SpeechSynthesisVoice): number {
  let score = 0
  if (/en-(us|gb)/i.test(v.lang)) score += 3
  if (/google|natural|neural|premium|enhanced/i.test(v.name)) score += 2
  if (v.localService) score += 1
  return score
}

export function pickVoice(role: VoiceRole = 'narrator'): SpeechSynthesisVoice | undefined {
  const voices = englishVoices()
  if (!voices.length) return undefined
  const preferred = prefs.voiceURI ? voices.find((v) => v.voiceURI === prefs.voiceURI) : undefined
  const sorted = voices.slice().sort((a, b) => rank(b) - rank(a))
  if (role === 'narrator' || role === 'A') {
    if (preferred) return preferred
    return sorted.find((v) => FEMALE_HINTS.test(v.name)) ?? sorted[0]
  }
  // Role B: try to find a different (preferably male) voice.
  const primary = preferred ?? sorted.find((v) => FEMALE_HINTS.test(v.name)) ?? sorted[0]
  return sorted.find((v) => v !== primary && MALE_HINTS.test(v.name)) ?? sorted.find((v) => v !== primary) ?? primary
}

export interface SpeakOptions {
  role?: VoiceRole
  /** Multiplier on top of the user's base rate (e.g. 0.7 for slow mode). */
  speed?: number
  onStart?: () => void
  onEnd?: () => void
  onBoundary?: (charIndex: number) => void
}

let keepAlive: number | undefined

/** Speak a text. Cancels anything currently being spoken. */
export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!ttsSupported() || !text.trim()) {
    // No TTS: still call the callbacks so UIs never get stuck.
    opts.onStart?.()
    window.setTimeout(() => opts.onEnd?.(), Math.min(4000, 300 + text.length * 45))
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(opts.role)
  if (voice) u.voice = voice
  u.lang = voice?.lang ?? 'en-US'
  const rate = Math.max(0.5, Math.min(1.6, prefs.rate * (opts.speed ?? 1)))
  u.rate = rate
  // If there's only one voice, change the pitch so two speakers sound different.
  const voices = englishVoices()
  u.pitch = opts.role === 'B' && (voices.length < 2 || pickVoice('B') === pickVoice('A')) ? 0.75 : 1
  let ended = false
  // Safety net: some browsers never fire "end" (e.g. no voices installed).
  const fallback = window.setTimeout(() => finish(), 2500 + (text.length * 90) / rate)
  const finish = () => {
    if (ended) return
    ended = true
    window.clearTimeout(fallback)
    window.clearInterval(keepAlive)
    opts.onEnd?.()
  }
  u.onstart = () => opts.onStart?.()
  u.onend = finish
  u.onerror = finish
  u.onboundary = (e) => opts.onBoundary?.(e.charIndex)
  // Desktop Chrome stops long utterances after ~15s unless nudged
  // (Android does not support pause/resume, so skip it there).
  window.clearInterval(keepAlive)
  if (!/android/i.test(navigator.userAgent)) keepAlive = window.setInterval(() => {
    if (!synth.speaking) window.clearInterval(keepAlive)
    else if (!synth.paused) {
      synth.pause()
      synth.resume()
    }
  }, 10000)
  // A tiny delay after cancel() avoids a Chrome bug where the new utterance is dropped.
  window.setTimeout(() => synth.speak(u), 30)
}

export function stopSpeaking(): void {
  window.clearInterval(keepAlive)
  if (ttsSupported()) window.speechSynthesis.cancel()
}

/** Speak a list of texts one after another. Returns a cancel function. */
export function speakSequence(
  parts: { text: string; role?: VoiceRole }[],
  opts: { speed?: number; onItem?: (index: number) => void; onDone?: () => void; gapMs?: number } = {},
): () => void {
  let cancelled = false
  let timer: number | undefined
  const run = (i: number) => {
    if (cancelled) return
    if (i >= parts.length) {
      opts.onDone?.()
      return
    }
    opts.onItem?.(i)
    speak(parts[i].text, {
      role: parts[i].role,
      speed: opts.speed,
      onEnd: () => {
        if (cancelled) return
        timer = window.setTimeout(() => run(i + 1), opts.gapMs ?? 350)
      },
    })
  }
  run(0)
  return () => {
    cancelled = true
    window.clearTimeout(timer)
    stopSpeaking()
  }
}

/* ------------------------------------------------------------------ */
/* Speech recognition                                                 */
/* ------------------------------------------------------------------ */

// Minimal typings for the (still prefixed) Web Speech recognition API.
export interface RecognitionAlternative {
  transcript: string
  confidence: number
}
export interface RecognitionResultEvent {
  resultIndex: number
  results: ArrayLike<ArrayLike<RecognitionAlternative> & { isFinal: boolean }>
}
export interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: RecognitionResultEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

type RecognitionCtor = new () => SpeechRecognitionLike

export function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function recognitionSupported(): boolean {
  return recognitionCtor() !== null
}
