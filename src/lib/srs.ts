import type { WordProgress } from '@/types'

/** Leitner-style spaced repetition. Box 0 = new, box 5 = mastered. */
const DAY = 24 * 60 * 60 * 1000
export const BOX_INTERVALS = [0, 1 * DAY, 2 * DAY, 4 * DAY, 8 * DAY, 16 * DAY]

export type Grade = 'again' | 'good' | 'easy'

export function emptyWordProgress(): WordProgress {
  return { box: 0, due: 0, seen: 0, right: 0, wrong: 0 }
}

export function reviewWord(prev: WordProgress | undefined, grade: Grade, now: number = Date.now()): WordProgress {
  const p = prev ?? emptyWordProgress()
  let box = p.box
  if (grade === 'again') box = Math.max(0, box - 2)
  if (grade === 'good') box = Math.min(5, box + 1)
  if (grade === 'easy') box = Math.min(5, box + 2)
  // "again" brings the word back very soon (10 minutes).
  const due = grade === 'again' ? now + 10 * 60 * 1000 : now + BOX_INTERVALS[Math.max(1, box)]
  return {
    box,
    due,
    seen: p.seen + 1,
    right: p.right + (grade === 'again' ? 0 : 1),
    wrong: p.wrong + (grade === 'again' ? 1 : 0),
    learnedAt: p.learnedAt ?? (box >= 1 ? now : undefined),
  }
}

export function isLearned(p: WordProgress | undefined): boolean {
  return !!p && p.box >= 1
}

export function isDue(p: WordProgress | undefined, now: number = Date.now()): boolean {
  return !!p && p.box >= 1 && p.due <= now
}

export function strengthLabel(p: WordProgress | undefined): { label: string; tone: 'new' | 'weak' | 'ok' | 'strong' } {
  if (!p || p.seen === 0) return { label: 'New', tone: 'new' }
  if (p.box <= 1) return { label: 'Learning', tone: 'weak' }
  if (p.box <= 3) return { label: 'Familiar', tone: 'ok' }
  return { label: 'Mastered', tone: 'strong' }
}
