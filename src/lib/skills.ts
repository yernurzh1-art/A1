import {
  BookOpen,
  Clapperboard,
  Film,
  Headphones,
  Languages,
  Mic,
  PenLine,
  Puzzle,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import type { Skill } from '@/types'

export interface SkillMeta {
  key: Skill
  label: string
  labelRu: string
  icon: LucideIcon
  /** Route of the practice center. */
  path: string
  /** XP for completing a full activity of this kind. */
  baseXp: number
  description: string
  /** Static Tailwind class sets (kept literal so Tailwind can see them). */
  tone: {
    text: string
    soft: string
    solid: string
    gradient: string
    ring: string
    bar: string
  }
}

export const SKILLS: Record<Skill, SkillMeta> = {
  vocabulary: {
    key: 'vocabulary',
    label: 'Vocabulary',
    labelRu: 'Словарь',
    icon: Languages,
    path: '/vocabulary',
    baseXp: 20,
    description: 'Flashcards, matching and spaced repetition',
    tone: {
      text: 'text-violet-600 dark:text-violet-300',
      soft: 'bg-violet-500/10 dark:bg-violet-400/15',
      solid: 'bg-violet-500',
      gradient: 'from-violet-500 to-purple-600',
      ring: 'ring-violet-500/30',
      bar: 'bg-violet-500',
    },
  },
  grammar: {
    key: 'grammar',
    label: 'Grammar',
    labelRu: 'Грамматика',
    icon: Puzzle,
    path: '/grammar',
    baseXp: 25,
    description: '15 A1 topics with tables, examples and tests',
    tone: {
      text: 'text-blue-600 dark:text-blue-300',
      soft: 'bg-blue-500/10 dark:bg-blue-400/15',
      solid: 'bg-blue-500',
      gradient: 'from-blue-500 to-indigo-600',
      ring: 'ring-blue-500/30',
      bar: 'bg-blue-500',
    },
  },
  listening: {
    key: 'listening',
    label: 'Listening',
    labelRu: 'Аудирование',
    icon: Headphones,
    path: '/listening',
    baseXp: 25,
    description: 'Short dialogues with play, pause and slow mode',
    tone: {
      text: 'text-cyan-600 dark:text-cyan-300',
      soft: 'bg-cyan-500/10 dark:bg-cyan-400/15',
      solid: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-sky-600',
      ring: 'ring-cyan-500/30',
      bar: 'bg-cyan-500',
    },
  },
  reading: {
    key: 'reading',
    label: 'Reading',
    labelRu: 'Чтение',
    icon: BookOpen,
    path: '/reading',
    baseXp: 25,
    description: 'A1 texts with audio and comprehension tasks',
    tone: {
      text: 'text-emerald-600 dark:text-emerald-300',
      soft: 'bg-emerald-500/10 dark:bg-emerald-400/15',
      solid: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-600',
      ring: 'ring-emerald-500/30',
      bar: 'bg-emerald-500',
    },
  },
  speaking: {
    key: 'speaking',
    label: 'Speaking',
    labelRu: 'Говорение',
    icon: Mic,
    path: '/speaking',
    baseXp: 30,
    description: 'Speech recognition, role plays and feedback',
    tone: {
      text: 'text-rose-600 dark:text-rose-300',
      soft: 'bg-rose-500/10 dark:bg-rose-400/15',
      solid: 'bg-rose-500',
      gradient: 'from-rose-500 to-pink-600',
      ring: 'ring-rose-500/30',
      bar: 'bg-rose-500',
    },
  },
  writing: {
    key: 'writing',
    label: 'Writing',
    labelRu: 'Письмо',
    icon: PenLine,
    path: '/writing',
    baseXp: 30,
    description: 'Guided writing with instant automatic checks',
    tone: {
      text: 'text-orange-600 dark:text-orange-300',
      soft: 'bg-orange-500/10 dark:bg-orange-400/15',
      solid: 'bg-orange-500',
      gradient: 'from-orange-500 to-amber-500',
      ring: 'ring-orange-500/30',
      bar: 'bg-orange-500',
    },
  },
  video: {
    key: 'video',
    label: 'Video Lessons',
    labelRu: 'Видеоуроки',
    icon: Clapperboard,
    path: '/videos',
    baseXp: 20,
    description: 'Animated lessons with a quiz after watching',
    tone: {
      text: 'text-fuchsia-600 dark:text-fuchsia-300',
      soft: 'bg-fuchsia-500/10 dark:bg-fuchsia-400/15',
      solid: 'bg-fuchsia-500',
      gradient: 'from-fuchsia-500 to-pink-500',
      ring: 'ring-fuchsia-500/30',
      bar: 'bg-fuchsia-500',
    },
  },
  quiz: {
    key: 'quiz',
    label: 'Quiz',
    labelRu: 'Тест',
    icon: Trophy,
    path: '/practice',
    baseXp: 50,
    description: 'Check what you learned in the unit',
    tone: {
      text: 'text-amber-600 dark:text-amber-300',
      soft: 'bg-amber-500/10 dark:bg-amber-400/15',
      solid: 'bg-amber-500',
      gradient: 'from-amber-400 to-orange-500',
      ring: 'ring-amber-500/30',
      bar: 'bg-amber-500',
    },
  },
}

/** Tile shown on the home page next to the eight skills. */
export const BOOK_META = {
  label: 'Book Trailer',
  icon: Film,
  path: '/book',
  description: 'A cinematic story for beginners',
  tone: {
    text: 'text-indigo-600 dark:text-indigo-300',
    soft: 'bg-indigo-500/10 dark:bg-indigo-400/15',
    gradient: 'from-slate-800 to-indigo-900',
  },
}
