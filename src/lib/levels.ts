/** XP → level. Each level needs a little more XP than the previous one. */

export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200, 6000]

export interface LevelInfo {
  level: number
  floor: number
  next: number | null
  progress: number
  toNext: number
}

export function levelFromXp(xp: number): LevelInfo {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  const floor = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? null
  if (next === null) return { level, floor, next, progress: 1, toNext: 0 }
  return { level, floor, next, progress: (xp - floor) / (next - floor), toNext: next - xp }
}

/** XP for finishing an activity. Repeats give half XP so the first try matters. */
export function xpForActivity(baseXp: number, accuracy: number, isRepeat: boolean): number {
  const raw = baseXp * (0.5 + 0.5 * Math.max(0, Math.min(1, accuracy)))
  return Math.max(5, Math.round((isRepeat ? raw / 2 : raw) / 5) * 5)
}
