import confetti from 'canvas-confetti'

const COLORS = ['#6d5dfc', '#b14bf4', '#22c55e', '#f59e0b', '#f43f5e', '#06b6d4']

function reduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function celebrate() {
  if (reduced()) return
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 9999 }
  void confetti({ ...base, particleCount: 90, spread: 75, origin: { y: 0.65 } })
  window.setTimeout(() => void confetti({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 180)
  window.setTimeout(() => void confetti({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 300)
}

export function sparkle(x = 0.5, y = 0.6) {
  if (reduced()) return
  void confetti({ colors: COLORS, particleCount: 24, spread: 50, startVelocity: 25, scalar: 0.7, ticks: 90, origin: { x, y }, zIndex: 9999 })
}
