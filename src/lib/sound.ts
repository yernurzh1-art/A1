/** Tiny synthesized sound effects (Web Audio) — no audio files needed. */

let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function audio(): AudioContext | null {
  if (!enabled || typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx ??= new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + start)
  g.gain.setValueAtTime(0.0001, ac.currentTime + start)
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + duration + 0.05)
}

export const sfx = {
  correct() {
    tone(660, 0, 0.12, 'sine')
    tone(990, 0.09, 0.22, 'sine')
  },
  wrong() {
    tone(220, 0, 0.18, 'triangle', 0.1)
    tone(180, 0.12, 0.25, 'triangle', 0.1)
  },
  tap() {
    tone(520, 0, 0.06, 'sine', 0.05)
  },
  complete() {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.1))
  },
  achievement() {
    ;[784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.08, 0.35, 'triangle', 0.08))
  },
}
