import { STEP_ORDER, type Exercise, type StepKey, type Unit, type Word } from '@/types'
import type { ProgressData } from '@/store/progress'
import { UNITS } from '@/data/units'
import { ALL_WORDS, PICTURE_CATEGORIES, getWords } from '@/data/vocabulary'
import { GRAMMAR_TOPICS, getGrammarTopic } from '@/data/grammar'
import { READING_TASKS } from '@/data/reading'
import { LISTENING_TASKS } from '@/data/listening'
import { dayKey } from './date'
import { pick, sample, seeded, shuffle } from './random'
import { vocabularyExercises } from './exercises'

type P = Pick<ProgressData, 'activities' | 'settings'>

export const stepId = (unitId: string, step: StepKey) => `unit:${unitId}:${step}`

export function stepDone(p: Pick<ProgressData, 'activities'>, unitId: string, step: StepKey): boolean {
  return !!p.activities[stepId(unitId, step)]
}

export function unitProgress(p: Pick<ProgressData, 'activities'>, unit: Unit): number {
  return STEP_ORDER.filter((s) => stepDone(p, unit.id, s)).length / STEP_ORDER.length
}

export function unitComplete(p: Pick<ProgressData, 'activities'>, unit: Unit): boolean {
  return STEP_ORDER.every((s) => stepDone(p, unit.id, s))
}

export function unitUnlocked(p: P, index: number): boolean {
  if (index <= 0 || p.settings.unlockAll) return true
  return unitComplete(p, UNITS[index - 1])
}

export function stepUnlocked(p: P, unitIndex: number, step: StepKey): boolean {
  if (p.settings.unlockAll) return true
  if (!unitUnlocked(p, unitIndex)) return false
  const i = STEP_ORDER.indexOf(step)
  return i === 0 || stepDone(p, UNITS[unitIndex].id, STEP_ORDER[i - 1])
}

export function courseProgress(p: Pick<ProgressData, 'activities'>): number {
  const total = UNITS.length * STEP_ORDER.length
  const done = UNITS.reduce((n, u) => n + STEP_ORDER.filter((s) => stepDone(p, u.id, s)).length, 0)
  return done / total
}

export function unitsCompleted(p: Pick<ProgressData, 'activities'>): number {
  return UNITS.filter((u) => unitComplete(p, u)).length
}

/** The next thing to do in the course ("Continue learning"). */
export function nextStep(p: Pick<ProgressData, 'activities'>): { unit: Unit; unitIndex: number; step: StepKey } | null {
  for (let i = 0; i < UNITS.length; i++) {
    const unit = UNITS[i]
    for (const step of STEP_ORDER) {
      if (!stepDone(p, unit.id, step)) return { unit, unitIndex: i, step }
    }
  }
  return null
}

export function wordsLearned(p: Pick<ProgressData, 'words'>): number {
  return Object.values(p.words).filter((w) => w.box >= 1).length
}

const canPicture = (w: Word) => PICTURE_CATEGORIES.has(w.category)

/** Vocabulary exercises for a set of words (picture questions only for clear emojis). */
export function wordExercises(words: Word[], seed: string, count = 10): Exercise[] {
  const rand = seeded(seed)
  return vocabularyExercises(words, ALL_WORDS, rand, count).filter((ex) => {
    if (ex.kind === 'choice' && ex.emoji && ex.id.startsWith('v-pic-')) {
      const w = words.find((x) => ex.id === `v-pic-${x.id}`)
      return !w || canPicture(w)
    }
    return true
  })
}

/** Unit quiz = hand-written situational questions + grammar test items + vocabulary. */
export function unitQuiz(unit: Unit): Exercise[] {
  const rand = seeded(`quiz-${unit.id}`)
  const grammar = unit.grammar.flatMap((id) => getGrammarTopic(id)?.test ?? [])
  const vocab = wordExercises(getWords(unit.words), `quiz-v-${unit.id}`, 6).filter((e) => e.kind !== 'match')
  return [...unit.quiz, ...sample(grammar, 2, rand), ...sample(vocab, 2, rand)]
}

/* ------------------------------------------------------------------ */
/* Daily content                                                       */
/* ------------------------------------------------------------------ */

export function wordOfTheDay(date: Date = new Date()): Word {
  return pick(ALL_WORDS, seeded(`wotd-${dayKey(date)}`))
}

/** Six mixed questions that are the same for everybody on the same day. */
export function dailyChallenge(date: Date = new Date()): Exercise[] {
  const rand = seeded(`challenge-${dayKey(date)}`)
  const grammar = sample(GRAMMAR_TOPICS.flatMap((t) => t.practice.filter((e) => e.kind === 'fill' || e.kind === 'choice')), 2, rand)
  const words = sample(ALL_WORDS, 4, rand)
  const vocab = vocabularyExercises(words, ALL_WORDS, rand, 4).filter((e) => e.kind !== 'match').slice(0, 2)
  const reading = sample(READING_TASKS.flatMap((r) => r.exercises.filter((e) => e.kind === 'truefalse')), 1, rand)
  const listening = LISTENING_TASKS.flatMap((l) => l.lines.slice(0, 4).map((line, i) => ({ line, id: `${l.id}-${i}` })))
  const pickLine = pick(listening, rand)
  const dictation: Exercise = { kind: 'listen', id: `dc-${pickLine.id}`, prompt: 'Listen and type what you hear', audio: pickLine.line.text, answer: pickLine.line.text }
  return shuffle([...grammar, ...vocab, ...reading], rand).concat(dictation)
}
