import type { ChoiceExercise, Exercise, FillExercise, ListenExercise, MatchExercise, OrderExercise, TrueFalseExercise } from '@/types'

/* Tiny builders that keep the content files short and readable. */

export const mc = (
  id: string,
  question: string,
  options: string[],
  answer: number,
  explanation?: string,
  extra: Partial<ChoiceExercise> = {},
): ChoiceExercise => ({ kind: 'choice', id, prompt: 'Choose the correct answer', question, options, answer, explanation, ...extra })

/** Gap with answer chips. `answer` must be one of `options`. */
export const gap = (id: string, text: string, options: string[], answer: string, explanation?: string, prompt = 'Choose the missing word'): FillExercise => ({
  kind: 'fill',
  id,
  prompt,
  text,
  options,
  answers: [answer],
  explanation,
})

/** Gap the learner types. */
export const typeIn = (id: string, text: string, answers: string[], hint?: string, explanation?: string): FillExercise => ({
  kind: 'fill',
  id,
  prompt: 'Type the missing word',
  text,
  answers,
  hint,
  explanation,
})

export const tf = (id: string, statement: string, answer: boolean, explanation?: string): TrueFalseExercise => ({
  kind: 'truefalse',
  id,
  prompt: 'True or false?',
  statement,
  answer,
  explanation,
})

/** Build a sentence from word tiles. Pass the sentence; it is split into words. */
export const build = (id: string, sentence: string, translation?: string, explanation?: string): OrderExercise => ({
  kind: 'order',
  id,
  prompt: 'Put the words in the correct order',
  items: sentence.split(' '),
  layout: 'words',
  translation,
  explanation,
})

/** Order whole sentences / dialogue lines. */
export const orderLines = (id: string, items: string[], prompt = 'Put the sentences in the correct order', explanation?: string): OrderExercise => ({
  kind: 'order',
  id,
  prompt,
  items,
  layout: 'lines',
  explanation,
})

export const match = (id: string, pairs: [string, string][], prompt = 'Match the pairs'): MatchExercise => ({ kind: 'match', id, prompt, pairs })

export const listenChoose = (id: string, audio: string, options: string[], answer: number, prompt = 'What did you hear?', explanation?: string): ListenExercise => ({
  kind: 'listen',
  id,
  prompt,
  audio,
  options,
  answer,
  explanation,
})

export const listenType = (id: string, audio: string, answer: string, prompt = 'Listen and type what you hear', explanation?: string): ListenExercise => ({
  kind: 'listen',
  id,
  prompt,
  audio,
  answer,
  explanation,
})

export type { Exercise }
