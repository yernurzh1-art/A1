import type { Skill } from '@/types'

/** Daily quests shown in the "Daily Goal" card. */
export const DAILY_QUESTS: { skill: Skill; xp: number; label: string; path: string; emoji: string }[] = [
  { skill: 'speaking', xp: 20, label: 'Speaking', path: '/speaking', emoji: '🎤' },
  { skill: 'grammar', xp: 15, label: 'Grammar', path: '/grammar', emoji: '🧩' },
  { skill: 'vocabulary', xp: 10, label: 'Vocabulary', path: '/vocabulary', emoji: '📚' },
]
