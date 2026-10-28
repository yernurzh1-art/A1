import type { AnswerValue, Exercise, Word } from '@/types'
import { compareSentence, normalize } from './text'
import { sample, shuffle } from './random'

/** Is the learner's answer correct? (match exercises report a boolean themselves) */
export function checkAnswer(ex: Exercise, value: AnswerValue): boolean {
  switch (ex.kind) {
    case 'choice':
      return value === ex.answer
    case 'truefalse':
      return value === ex.answer
    case 'fill':
      return typeof value === 'string' && ex.answers.some((a) => normalize(a) === normalize(value))
    case 'order': {
      if (!Array.isArray(value)) return false
      const given = normalize(value.join(' '))
      return [ex.items, ...(ex.alternatives ?? [])].some((order) => normalize(order.join(' ')) === given)
    }
    case 'match':
      return value === true
    case 'listen':
      if (typeof ex.answer === 'number') return value === ex.answer
      if (typeof value !== 'string') return false
      if (normalize(value) === normalize(ex.answer)) return true
      // Dictation of a whole sentence: allow one small slip.
      return ex.answer.split(' ').length > 3 && compareSentence(ex.answer, value).score >= 0.85
  }
}

/** Is there enough input to press "Check"? */
export function isAnswerReady(ex: Exercise, value: AnswerValue): boolean {
  if (value === null || value === undefined) return false
  if (ex.kind === 'fill' || (ex.kind === 'listen' && typeof ex.answer === 'string')) {
    return typeof value === 'string' && value.trim().length > 0
  }
  if (ex.kind === 'order') return Array.isArray(value) && value.length === ex.items.length
  return true
}

export function correctAnswerText(ex: Exercise): string {
  switch (ex.kind) {
    case 'choice':
      return ex.options[ex.answer]
    case 'truefalse':
      return ex.answer ? 'True' : 'False'
    case 'fill':
      return ex.text.replace('___', ex.answers[0])
    case 'order':
      return ex.layout === 'lines' ? ex.items.join(' → ') : ex.items.join(' ')
    case 'match':
      return ex.pairs.map(([a, b]) => `${a} = ${b}`).join(', ')
    case 'listen':
      return typeof ex.answer === 'number' ? (ex.options?.[ex.answer] ?? '') : ex.answer
  }
}

export function givenAnswerText(ex: Exercise, value: AnswerValue): string {
  if (value === null || value === undefined) return '—'
  switch (ex.kind) {
    case 'choice':
      return typeof value === 'number' ? ex.options[value] : String(value)
    case 'listen':
      return typeof value === 'number' ? (ex.options?.[value] ?? '') : String(value)
    case 'truefalse':
      return value ? 'True' : 'False'
    case 'order':
      return Array.isArray(value) ? value.join(ex.layout === 'lines' ? ' → ' : ' ') : String(value)
    case 'match':
      return 'some pairs were mixed up'
    default:
      return String(value)
  }
}

/** One-line description of the question (for the mistakes list and search). */
export function exerciseTitle(ex: Exercise): string {
  switch (ex.kind) {
    case 'choice':
      return ex.question
    case 'truefalse':
      return ex.statement
    case 'fill':
      return ex.text
    case 'order':
      return ex.prompt ?? 'Put in the correct order'
    case 'match':
      return ex.prompt ?? 'Match the pairs'
    case 'listen':
      return ex.prompt ?? 'Listen and answer'
  }
}

/* ------------------------------------------------------------------ */
/* Generators                                                         */
/* ------------------------------------------------------------------ */

function distractors(word: Word, pool: Word[], count: number, rand: () => number, key: 'en' | 'ru' = 'en'): string[] {
  const sameCat = pool.filter((w) => w.id !== word.id && w.category === word.category && w[key] !== word[key])
  const other = pool.filter((w) => w.id !== word.id && w.category !== word.category && w[key] !== word[key])
  const picked = sample(sameCat, count, rand)
  if (picked.length < count) picked.push(...sample(other, count - picked.length, rand))
  return [...new Set(picked.map((w) => w[key]))].slice(0, count)
}

function choiceFrom(id: string, correct: string, wrong: string[], rand: () => number) {
  const options = shuffle([correct, ...wrong], rand)
  return { options, answer: options.indexOf(correct), id }
}

/** Build a varied set of vocabulary exercises for a list of words. */
export function vocabularyExercises(words: Word[], pool: Word[], rand: () => number, count = 10): Exercise[] {
  const out: Exercise[] = []
  const list = shuffle(words, rand)
  const makers = [
    (w: Word): Exercise => {
      const c = choiceFrom(`v-pic-${w.id}`, w.en, distractors(w, pool, 3, rand), rand)
      return { kind: 'choice', prompt: 'What is this?', question: 'Choose the right word', emoji: w.emoji, ...c, explanation: `${w.emoji} = ${w.en} — ${w.ru}` }
    },
    (w: Word): Exercise => {
      const c = choiceFrom(`v-ru-${w.id}`, w.ru, distractors(w, pool, 3, rand, 'ru'), rand)
      return { kind: 'choice', prompt: 'Choose the translation', question: w.en, audio: w.en, ...c, explanation: `${w.en} — ${w.ru}` }
    },
    (w: Word): Exercise => {
      const c = choiceFrom(`v-listen-${w.id}`, w.en, distractors(w, pool, 3, rand), rand)
      return { kind: 'listen', prompt: 'Listen and choose the word you hear', audio: w.en, options: c.options, answer: c.answer, id: c.id, explanation: `You heard "${w.en}" ${w.ipa}` }
    },
    (w: Word): Exercise => {
      const c = choiceFrom(`v-en-${w.id}`, w.en, distractors(w, pool, 3, rand), rand)
      return { kind: 'choice', prompt: 'How do you say it in English?', question: w.ru, ...c, explanation: `${w.ru} — ${w.en}` }
    },
    (w: Word): Exercise => {
      const gapped = gapSentence(w)
      if (gapped) return { kind: 'fill', id: `v-fill-${w.id}`, prompt: 'Complete the sentence', text: gapped, answers: [w.en], options: shuffle([w.en, ...distractors(w, pool, 2, rand)], rand), hint: w.ru, explanation: w.example }
      return { kind: 'listen', id: `v-spell-${w.id}`, prompt: 'Listen and type the word', audio: w.en, answer: w.en, explanation: `${w.en} — ${w.ru}` }
    },
  ]
  list.forEach((w, i) => {
    if (out.length < count) out.push(makers[i % makers.length](w))
  })
  // Add a matching exercise in the middle for variety.
  if (words.length >= 4) {
    const pairs = sample(words, Math.min(5, words.length), rand).map((w) => [`${w.emoji} ${w.en}`, w.ru] as [string, string])
    out.splice(Math.min(4, out.length), 0, { kind: 'match', id: `v-match-${words[0].id}`, prompt: 'Match the words with the translations', pairs })
  }
  return out.slice(0, count)
}

/** Replace the word in its example sentence with a gap (if it appears as-is). */
export function gapSentence(w: Word): string | null {
  const re = new RegExp(`\\b${w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  if (!re.test(w.example)) return null
  return w.example.replace(re, '___')
}

/** Spelling / listening practice for a list of words. */
export function listeningWordExercises(words: Word[], pool: Word[], rand: () => number): Exercise[] {
  return shuffle(words, rand).map((w, i) => {
    if (i % 3 === 2) return { kind: 'listen', id: `v-type-${w.id}`, prompt: 'Listen and type the word', audio: w.en, answer: w.en, explanation: `${w.en} — ${w.ru}` }
    const c = choiceFrom(`v-hear-${w.id}`, `${w.emoji} ${w.en}`, distractors(w, pool, 3, rand).map((d) => `${pool.find((p) => p.en === d)?.emoji ?? ''} ${d}`), rand)
    return { kind: 'listen', prompt: 'What did you hear?', audio: w.en, options: c.options, answer: c.answer, id: c.id, explanation: `${w.en} ${w.ipa} — ${w.ru}` }
  })
}
