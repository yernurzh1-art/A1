import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  ActivityRecord,
  AppNotification,
  Exercise,
  FinalTestResult,
  Mistake,
  Skill,
  WordProgress,
} from '@/types'
import { dayKey, yesterdayKey } from '@/lib/date'
import { xpForActivity } from '@/lib/levels'
import { reviewWord, type Grade } from '@/lib/srs'
import { uid } from '@/lib/random'
import { ACHIEVEMENTS } from '@/data/achievements'
import { pushToast } from './toasts'
import { sfx } from '@/lib/sound'

export const MAX_HEARTS = 5
/** One heart comes back every 15 minutes. */
export const HEART_REFILL_MS = 15 * 60 * 1000

export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  theme: Theme
  sound: boolean
  /** Unlock every unit and step (handy for teachers and demos). */
  unlockAll: boolean
  unlimitedHearts: boolean
  speechRate: number
  voiceURI?: string
  showRussian: boolean
}

export interface Profile {
  name: string
  avatar: string
  dailyGoal: number
  onboarded: boolean
  joinedAt: number
}

export interface Stats {
  lessonsCompleted: number
  perfectLessons: number
  speakingAttempts: number
  listeningSessions: number
  mistakesFixed: number
  videosWatched: number
  goalDays: number
}

export interface ProgressData {
  profile: Profile
  settings: Settings
  xp: number
  xpByDay: Record<string, number>
  skillXpByDay: Record<string, Partial<Record<Skill, number>>>
  streak: { current: number; best: number; lastDay: string | null }
  hearts: { count: number; updatedAt: number }
  activities: Record<string, ActivityRecord>
  words: Record<string, WordProgress>
  mistakes: Mistake[]
  achievements: Record<string, number>
  notifications: AppNotification[]
  challenges: Record<string, number>
  chapters: Record<string, number>
  finalTest: FinalTestResult | null
  stats: Stats
}

export interface CompleteInput {
  id: string
  skill: Skill
  accuracy: number
  baseXp?: number
}

interface Actions {
  completeActivity: (input: CompleteInput) => { xp: number; isRepeat: boolean }
  addXp: (amount: number, skill: Skill) => void
  recordMistake: (m: { exercise: Exercise; skill: Skill; source: string; path: string; given: string; correct: string }) => void
  resolveMistake: (exerciseId: string) => void
  clearResolvedMistakes: () => void
  loseHeart: () => void
  gainHeart: (n?: number) => void
  syncHearts: () => void
  gradeWord: (wordId: string, grade: Grade) => void
  markWordsSeen: (wordIds: string[]) => void
  markChapterRead: (chapterId: string, score: number) => void
  saveChallenge: (score: number) => void
  saveFinalTest: (result: FinalTestResult) => void
  bumpStat: (key: keyof Stats, by?: number) => void
  notify: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationsRead: () => void
  setSettings: (s: Partial<Settings>) => void
  setProfile: (p: Partial<Profile>) => void
  checkAchievements: () => void
  loadDemoProgress: () => void
  resetProgress: () => void
}

export type ProgressState = ProgressData & Actions

function initialData(): ProgressData {
  const now = Date.now()
  return {
    profile: { name: '', avatar: '🦊', dailyGoal: 45, onboarded: false, joinedAt: now },
    settings: { theme: 'system', sound: true, unlockAll: false, unlimitedHearts: false, speechRate: 0.95, showRussian: true },
    xp: 0,
    xpByDay: {},
    skillXpByDay: {},
    streak: { current: 0, best: 0, lastDay: null },
    hearts: { count: MAX_HEARTS, updatedAt: now },
    activities: {},
    words: {},
    mistakes: [],
    achievements: {},
    notifications: [
      {
        id: 'welcome',
        title: 'Welcome to Stepwise! 👋',
        body: 'Start Unit 1 — Hello! and earn your first XP.',
        icon: '👋',
        createdAt: now,
        read: false,
        path: '/learn/u1',
      },
    ],
    challenges: {},
    chapters: {},
    finalTest: null,
    stats: { lessonsCompleted: 0, perfectLessons: 0, speakingAttempts: 0, listeningSessions: 0, mistakesFixed: 0, videosWatched: 0, goalDays: 0 },
  }
}

/** Streak after doing something today. */
function nextStreak(streak: ProgressData['streak']): ProgressData['streak'] {
  const today = dayKey()
  if (streak.lastDay === today) return streak
  const current = streak.lastDay === yesterdayKey() ? streak.current + 1 : 1
  return { current, best: Math.max(streak.best, current), lastDay: today }
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialData(),

      addXp: (amount, skill) => {
        if (amount <= 0) return
        const today = dayKey()
        const before = get()
        const beforeToday = before.xpByDay[today] ?? 0
        const prevStreak = before.streak
        const streak = nextStreak(prevStreak)
        set((s) => ({
          xp: s.xp + amount,
          xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + amount },
          skillXpByDay: {
            ...s.skillXpByDay,
            [today]: { ...s.skillXpByDay[today], [skill]: (s.skillXpByDay[today]?.[skill] ?? 0) + amount },
          },
          streak,
        }))
        if (streak.current !== prevStreak.current && streak.current > 1) {
          get().notify({ title: `🔥 ${streak.current} day streak!`, body: 'You practised English again today. Keep it going!', icon: '🔥', path: '/progress' })
        }
        const goal = before.profile.dailyGoal
        if (beforeToday < goal && beforeToday + amount >= goal) {
          set((s) => ({ stats: { ...s.stats, goalDays: s.stats.goalDays + 1 } }))
          pushToast({ icon: '🎯', title: 'Daily goal reached!', body: `${goal} XP today — great work.` })
          get().notify({ title: 'Daily goal reached 🎯', body: `You earned ${goal} XP today.`, icon: '🎯', path: '/progress' })
        }
        get().checkAchievements()
      },

      completeActivity: ({ id, skill, accuracy, baseXp }) => {
        const prev = get().activities[id]
        const isRepeat = !!prev
        const xp = xpForActivity(baseXp ?? 20, accuracy, isRepeat)
        set((s) => ({
          activities: {
            ...s.activities,
            [id]: {
              skill,
              bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
              times: (prev?.times ?? 0) + 1,
              lastAt: Date.now(),
            },
          },
          stats: {
            ...s.stats,
            lessonsCompleted: s.stats.lessonsCompleted + 1,
            perfectLessons: s.stats.perfectLessons + (accuracy >= 0.999 ? 1 : 0),
            speakingAttempts: s.stats.speakingAttempts + (skill === 'speaking' ? 1 : 0),
            listeningSessions: s.stats.listeningSessions + (skill === 'listening' ? 1 : 0),
            videosWatched: s.stats.videosWatched + (skill === 'video' ? 1 : 0),
          },
        }))
        get().addXp(xp, skill)
        return { xp, isRepeat }
      },

      recordMistake: ({ exercise, skill, source, path, given, correct }) => {
        set((s) => {
          const existing = s.mistakes.find((m) => m.exercise.id === exercise.id && !m.resolved)
          if (existing) {
            return { mistakes: s.mistakes.map((m) => (m === existing ? { ...m, given, createdAt: Date.now() } : m)) }
          }
          const m: Mistake = { id: uid(), exercise, skill, source, path, given, correct, createdAt: Date.now(), resolved: false }
          return { mistakes: [m, ...s.mistakes].slice(0, 300) }
        })
      },

      resolveMistake: (exerciseId) => {
        const had = get().mistakes.some((m) => m.exercise.id === exerciseId && !m.resolved)
        if (!had) return
        set((s) => ({
          mistakes: s.mistakes.map((m) => (m.exercise.id === exerciseId ? { ...m, resolved: true } : m)),
          stats: { ...s.stats, mistakesFixed: s.stats.mistakesFixed + 1 },
        }))
        get().checkAchievements()
      },

      clearResolvedMistakes: () => set((s) => ({ mistakes: s.mistakes.filter((m) => !m.resolved) })),

      syncHearts: () => {
        const { hearts } = get()
        if (hearts.count >= MAX_HEARTS) return
        const gained = Math.floor((Date.now() - hearts.updatedAt) / HEART_REFILL_MS)
        if (gained <= 0) return
        const count = Math.min(MAX_HEARTS, hearts.count + gained)
        set({ hearts: { count, updatedAt: count >= MAX_HEARTS ? Date.now() : hearts.updatedAt + gained * HEART_REFILL_MS } })
      },

      loseHeart: () => {
        if (get().settings.unlimitedHearts) return
        get().syncHearts()
        set((s) => ({
          hearts: {
            count: Math.max(0, s.hearts.count - 1),
            // the refill timer starts when you drop below the maximum
            updatedAt: s.hearts.count >= MAX_HEARTS ? Date.now() : s.hearts.updatedAt,
          },
        }))
      },

      gainHeart: (n = 1) => {
        set((s) => {
          const count = Math.min(MAX_HEARTS, s.hearts.count + n)
          return { hearts: { count, updatedAt: count >= MAX_HEARTS ? Date.now() : s.hearts.updatedAt } }
        })
      },

      gradeWord: (wordId, grade) => {
        set((s) => ({ words: { ...s.words, [wordId]: reviewWord(s.words[wordId], grade) } }))
        get().checkAchievements()
      },

      markWordsSeen: (wordIds) => {
        set((s) => {
          const words = { ...s.words }
          for (const id of wordIds) {
            const p = words[id]
            // Seeing a word in a lesson puts it into box 1 ("learning").
            if (!p || p.box === 0) words[id] = reviewWord(p, 'good')
          }
          return { words }
        })
        get().checkAchievements()
      },

      markChapterRead: (chapterId, score) => {
        set((s) => ({ chapters: { ...s.chapters, [chapterId]: Math.max(score, s.chapters[chapterId] ?? 0) } }))
        get().checkAchievements()
      },

      saveChallenge: (score) => {
        set((s) => ({ challenges: { ...s.challenges, [dayKey()]: Math.max(score, s.challenges[dayKey()] ?? 0) } }))
      },

      saveFinalTest: (result) => {
        set((s) => ({ finalTest: !s.finalTest || result.total >= s.finalTest.total ? result : s.finalTest }))
        if (result.passed) {
          get().notify({ title: '🏆 A1 Level Completed!', body: `Final test score: ${result.total}%. Congratulations!`, icon: '🏆', path: '/final-test' })
        }
        get().checkAchievements()
      },

      bumpStat: (key, by = 1) => {
        set((s) => ({ stats: { ...s.stats, [key]: s.stats[key] + by } }))
        get().checkAchievements()
      },

      notify: (n) => {
        set((s) => ({ notifications: [{ ...n, id: uid(), createdAt: Date.now(), read: false }, ...s.notifications].slice(0, 40) }))
      },

      markNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      checkAchievements: () => {
        const state = get()
        const unlocked: string[] = []
        for (const a of ACHIEVEMENTS) {
          if (!state.achievements[a.id] && a.check(state)) unlocked.push(a.id)
        }
        if (!unlocked.length) return
        const now = Date.now()
        set((s) => ({ achievements: { ...s.achievements, ...Object.fromEntries(unlocked.map((id) => [id, now])) } }))
        for (const id of unlocked) {
          const a = ACHIEVEMENTS.find((x) => x.id === id)!
          pushToast({ icon: a.icon, title: 'Achievement unlocked!', body: a.title, tone: 'achievement' })
          get().notify({ title: `Achievement: ${a.title}`, body: a.description, icon: a.icon, path: '/profile' })
          if (state.settings.sound) sfx.achievement()
        }
      },

      loadDemoProgress: () => {
        const base = initialData()
        const now = Date.now()
        const xpByDay: Record<string, number> = {}
        const skillXpByDay: ProgressData['skillXpByDay'] = {}
        const pattern = [55, 40, 70, 35, 90, 60, 48]
        const skills: Skill[] = ['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing']
        pattern.forEach((xp, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          xpByDay[dayKey(d)] = xp
          skillXpByDay[dayKey(d)] = { [skills[i % skills.length]]: Math.round(xp * 0.6), vocabulary: Math.round(xp * 0.4) }
        })
        const activities: ProgressData['activities'] = {}
        const steps = ['vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'video', 'quiz'] as const
        for (const unit of ['u1', 'u2']) {
          for (const step of steps) activities[`unit:${unit}:${step}`] = { skill: step, bestAccuracy: 0.86, times: 1, lastAt: now - 86400000 }
        }
        for (const step of steps.slice(0, 5)) activities[`unit:u3:${step}`] = { skill: step, bestAccuracy: 0.8, times: 1, lastAt: now - 3600000 }
        set({
          ...base,
          profile: { ...get().profile, onboarded: true, name: get().profile.name || 'Alex' },
          settings: get().settings,
          xp: 1240,
          xpByDay,
          skillXpByDay,
          streak: { current: 7, best: 7, lastDay: dayKey() },
          activities,
          stats: { lessonsCompleted: 21, perfectLessons: 3, speakingAttempts: 4, listeningSessions: 3, mistakesFixed: 6, videosWatched: 2, goalDays: 6 },
        })
        // words learned in units 1–3
        void import('@/data/units').then(({ UNITS }) => {
          const ids = UNITS.slice(0, 3).flatMap((u) => u.words)
          get().markWordsSeen(ids)
          get().checkAchievements()
        })
      },

      resetProgress: () => {
        const { settings } = get()
        set({ ...initialData(), settings: { ...settings, unlockAll: false, unlimitedHearts: false } })
      },
    }),
    {
      name: 'stepwise-progress-v1',
      storage: createJSONStorage(() => {
        try {
          const probe = '__stepwise_probe__'
          window.localStorage.setItem(probe, '1')
          window.localStorage.removeItem(probe)
          return window.localStorage
        } catch {
          // Private mode / blocked storage: keep progress in memory only.
          const mem = new Map<string, string>()
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          }
        }
      }),
      version: 1,
      partialize: (s) => {
        // Only persist data, never functions.
        const data: Partial<ProgressData> = {}
        for (const k of Object.keys(initialData()) as (keyof ProgressData)[]) {
          ;(data as Record<string, unknown>)[k] = s[k]
        }
        return data as ProgressData
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressData>
        const init = initialData()
        return {
          ...current,
          ...p,
          profile: { ...init.profile, ...p.profile },
          settings: { ...init.settings, ...p.settings },
          stats: { ...init.stats, ...p.stats },
        }
      },
    },
  ),
)

/* ------------------------------------------------------------------ */
/* Selectors                                                          */
/* ------------------------------------------------------------------ */

/** Streak shown to the user (0 if a day was missed). */
export function displayStreak(s: Pick<ProgressData, 'streak'>): number {
  const { lastDay, current } = s.streak
  if (!lastDay) return 0
  return lastDay === dayKey() || lastDay === yesterdayKey() ? current : 0
}

export function todayXp(s: Pick<ProgressData, 'xpByDay'>): number {
  return s.xpByDay[dayKey()] ?? 0
}

export function activityDone(s: Pick<ProgressData, 'activities'>, id: string): boolean {
  return !!s.activities[id]
}
