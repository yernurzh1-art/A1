import { describe, expect, it } from 'vitest'
import { checkAnswer, correctAnswerText, isAnswerReady } from '../exercises'
import { levelFromXp, xpForActivity } from '../levels'
import { isDue, reviewWord } from '../srs'
import { dailyChallenge, unitQuiz, wordExercises } from '../course'
import { UNITS } from '@/data/units'
import { getWords, ALL_WORDS } from '@/data/vocabulary'
import { GRAMMAR_TOPICS } from '@/data/grammar'
import type { Exercise } from '@/types'

describe('checkAnswer', () => {
  it('checks every exercise kind', () => {
    const fill: Exercise = { kind: 'fill', id: 'f', text: 'I ___ a student.', answers: ['am'], options: ['am', 'is'] }
    expect(checkAnswer(fill, 'am')).toBe(true)
    expect(checkAnswer(fill, 'is')).toBe(false)
    const order: Exercise = { kind: 'order', id: 'o', items: ['Are', 'you', 'a', 'student?'] }
    expect(checkAnswer(order, ['Are', 'you', 'a', 'student'])).toBe(true)
    expect(isAnswerReady(order, ['Are'])).toBe(false)
    const listen: Exercise = { kind: 'listen', id: 'l', audio: "Hello! What's your name?", answer: "Hello! What's your name?" }
    expect(checkAnswer(listen, 'hello whats your name')).toBe(true)
    expect(correctAnswerText(fill)).toBe('I am a student.')
  })
})

describe('content integrity', () => {
  it('every unit points at existing words', () => {
    for (const u of UNITS) expect(getWords(u.words).length, u.id).toBe(u.words.length)
  })
  it('has at least the required amount of content', () => {
    expect(UNITS.length).toBe(10)
    expect(GRAMMAR_TOPICS.length).toBe(15)
    expect(GRAMMAR_TOPICS.flatMap((t) => [...t.practice, ...t.test]).length).toBeGreaterThanOrEqual(20)
    expect(ALL_WORDS.length).toBeGreaterThanOrEqual(150)
  })
  it('exercise ids are unique and choice answers valid', () => {
    const all = [...GRAMMAR_TOPICS.flatMap((t) => [...t.practice, ...t.test]), ...UNITS.flatMap((u) => u.quiz)]
    const ids = all.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of all) {
      if (e.kind === 'choice') expect(e.options[e.answer], e.id).toBeDefined()
      if (e.kind === 'fill' && e.options) expect(e.options, e.id).toContain(e.answers[0])
      if (e.kind === 'fill') expect(e.text, e.id).toContain('___')
    }
  })
  it('builds unit quizzes, word exercises and a stable daily challenge', () => {
    for (const u of UNITS.slice(0, 9)) expect(unitQuiz(u).length).toBeGreaterThanOrEqual(8)
    expect(wordExercises(getWords(UNITS[0].words), 'x').length).toBeGreaterThan(5)
    const d = new Date(2026, 0, 5)
    expect(dailyChallenge(d).map((e) => e.id)).toEqual(dailyChallenge(d).map((e) => e.id))
  })
})

describe('levels & XP', () => {
  it('maps XP to levels', () => {
    expect(levelFromXp(0).level).toBe(1)
    expect(levelFromXp(1240).level).toBe(6)
    expect(levelFromXp(99).toNext).toBe(1)
  })
  it('halves XP for repeats', () => {
    expect(xpForActivity(50, 1, false)).toBe(50)
    expect(xpForActivity(50, 1, true)).toBe(25)
  })
})

describe('spaced repetition', () => {
  it('moves words between boxes', () => {
    const now = 1_000_000
    let p = reviewWord(undefined, 'good', now)
    expect(p.box).toBe(1)
    p = reviewWord(p, 'easy', now)
    expect(p.box).toBe(3)
    p = reviewWord(p, 'again', now)
    expect(p.box).toBe(1)
    expect(isDue(p, now)).toBe(false)
    expect(isDue(p, now + 11 * 60 * 1000)).toBe(true)
  })
})
