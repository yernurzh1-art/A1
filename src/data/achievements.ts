import type { ProgressData } from '@/store/progress'
import { GRAMMAR_TOPICS } from './grammar'
import { UNITS } from './units'
import { BOOK } from './book'
import { STEP_ORDER } from '@/types'
import { displayStreak } from '@/store/progress'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  /** Tailwind gradient for the badge. */
  gradient: string
  check: (s: ProgressData) => boolean
  /** Optional 0..1 progress for the badge. */
  progress?: (s: ProgressData) => number
}

const learnedWords = (s: ProgressData) => Object.values(s.words).filter((w) => w.box >= 1).length

const unitsCompleted = (s: ProgressData) =>
  UNITS.filter((u) => STEP_ORDER.every((step) => s.activities[`unit:${u.id}:${step}`])).length

function grammarTopicsDone(s: ProgressData): number {
  const done = new Set<string>()
  for (const t of GRAMMAR_TOPICS) if (s.activities[`grammar-test:${t.id}`]) done.add(t.id)
  for (const u of UNITS) if (s.activities[`unit:${u.id}:grammar`]) u.grammar.forEach((g) => done.add(g))
  return done.size
}

const count = (s: ProgressData, prefix: string) => Object.keys(s.activities).filter((k) => k.startsWith(prefix)).length
const speakingDone = (s: ProgressData) => count(s, 'speaking:') + Object.keys(s.activities).filter((k) => /^unit:.+:speaking$/.test(k)).length
const listeningDone = (s: ProgressData) => count(s, 'listening:') + Object.keys(s.activities).filter((k) => /^unit:.+:listening$/.test(k)).length
const ratio = (a: number, b: number) => Math.min(1, a / b)

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Lesson',
    description: 'Complete your very first lesson.',
    icon: '🎓',
    gradient: 'from-violet-500 to-indigo-500',
    check: (s) => s.stats.lessonsCompleted >= 1,
    progress: (s) => ratio(s.stats.lessonsCompleted, 1),
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Learn 3 days in a row.',
    icon: '🔥',
    gradient: 'from-orange-400 to-red-500',
    check: (s) => s.streak.best >= 3,
    progress: (s) => ratio(Math.max(s.streak.best, displayStreak(s)), 3),
  },
  {
    id: 'streak-7',
    title: '7 Day Streak',
    description: 'Learn 7 days in a row.',
    icon: '📅',
    gradient: 'from-amber-400 to-orange-500',
    check: (s) => s.streak.best >= 7,
    progress: (s) => ratio(s.streak.best, 7),
  },
  {
    id: 'words-25',
    title: 'Word Collector',
    description: 'Learn 25 words.',
    icon: '🧩',
    gradient: 'from-fuchsia-500 to-purple-500',
    check: (s) => learnedWords(s) >= 25,
    progress: (s) => ratio(learnedWords(s), 25),
  },
  {
    id: 'words-100',
    title: '100 Words Learned',
    description: 'Learn 100 English words.',
    icon: '📚',
    gradient: 'from-purple-500 to-pink-500',
    check: (s) => learnedWords(s) >= 100,
    progress: (s) => ratio(learnedWords(s), 100),
  },
  {
    id: 'grammar-master',
    title: 'Grammar Master',
    description: 'Finish all 15 A1 grammar topics.',
    icon: '🧠',
    gradient: 'from-blue-500 to-indigo-600',
    check: (s) => grammarTopicsDone(s) >= GRAMMAR_TOPICS.length,
    progress: (s) => ratio(grammarTopicsDone(s), GRAMMAR_TOPICS.length),
  },
  {
    id: 'speaking-beginner',
    title: 'Speaking Beginner',
    description: 'Complete 3 speaking tasks.',
    icon: '🎤',
    gradient: 'from-rose-500 to-pink-500',
    check: (s) => speakingDone(s) >= 3,
    progress: (s) => ratio(speakingDone(s), 3),
  },
  {
    id: 'sharp-ears',
    title: 'Sharp Ears',
    description: 'Complete 5 listening tasks.',
    icon: '🎧',
    gradient: 'from-cyan-500 to-sky-600',
    check: (s) => listeningDone(s) >= 5,
    progress: (s) => ratio(listeningDone(s), 5),
  },
  {
    id: 'perfect',
    title: 'Perfectionist',
    description: 'Finish a lesson with 100% accuracy.',
    icon: '💯',
    gradient: 'from-emerald-500 to-teal-500',
    check: (s) => s.stats.perfectLessons >= 1,
    progress: (s) => ratio(s.stats.perfectLessons, 1),
  },
  {
    id: 'goal-getter',
    title: 'Goal Getter',
    description: 'Reach your daily XP goal.',
    icon: '🎯',
    gradient: 'from-lime-500 to-emerald-500',
    check: (s) => s.stats.goalDays >= 1,
    progress: (s) => ratio(s.stats.goalDays, 1),
  },
  {
    id: 'mistake-fixer',
    title: 'Mistake Fixer',
    description: 'Correct 10 mistakes in Review.',
    icon: '♻️',
    gradient: 'from-teal-500 to-cyan-500',
    check: (s) => s.stats.mistakesFixed >= 10,
    progress: (s) => ratio(s.stats.mistakesFixed, 10),
  },
  {
    id: 'movie-night',
    title: 'Movie Night',
    description: 'Watch 3 video lessons.',
    icon: '🎬',
    gradient: 'from-fuchsia-500 to-rose-500',
    check: (s) => s.stats.videosWatched >= 3,
    progress: (s) => ratio(s.stats.videosWatched, 3),
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: `Read all ${BOOK.chapters.length} chapters of "${BOOK.title}".`,
    icon: '📖',
    gradient: 'from-indigo-500 to-slate-700',
    check: (s) => BOOK.chapters.every((c) => s.chapters[c.id] !== undefined),
    progress: (s) => ratio(BOOK.chapters.filter((c) => s.chapters[c.id] !== undefined).length, BOOK.chapters.length),
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    description: 'Complete 5 units.',
    icon: '⛰️',
    gradient: 'from-sky-500 to-indigo-500',
    check: (s) => unitsCompleted(s) >= 5,
    progress: (s) => ratio(unitsCompleted(s), 5),
  },
  {
    id: 'xp-1000',
    title: 'XP Hunter',
    description: 'Earn 1000 XP.',
    icon: '⭐',
    gradient: 'from-yellow-400 to-amber-500',
    check: (s) => s.xp >= 1000,
    progress: (s) => ratio(s.xp, 1000),
  },
  {
    id: 'a1-champion',
    title: 'A1 Champion',
    description: 'Pass the Final A1 Test.',
    icon: '🏆',
    gradient: 'from-amber-400 to-yellow-600',
    check: (s) => !!s.finalTest?.passed,
    progress: (s) => (s.finalTest?.passed ? 1 : 0),
  },
]
