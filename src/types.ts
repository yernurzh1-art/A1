/* Shared content & progress types for the whole app. */

export type Skill =
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'
  | 'video'
  | 'quiz'

/** The eight steps of every unit, in order. */
export const STEP_ORDER = [
  'vocabulary',
  'grammar',
  'listening',
  'reading',
  'speaking',
  'writing',
  'video',
  'quiz',
] as const satisfies readonly Skill[]

export type StepKey = (typeof STEP_ORDER)[number]

/* ------------------------------------------------------------------ */
/* Exercises                                                          */
/* ------------------------------------------------------------------ */

interface BaseExercise {
  id: string
  /** Instruction shown above the task, e.g. "Choose the correct answer". */
  prompt?: string
  /** Short explanation shown after answering. */
  explanation?: string
}

export interface ChoiceExercise extends BaseExercise {
  kind: 'choice'
  question: string
  /** Optional big emoji / picture shown with the question. */
  emoji?: string
  /** Optional text spoken by the 🔊 button. */
  audio?: string
  options: string[]
  answer: number
}

export interface TrueFalseExercise extends BaseExercise {
  kind: 'truefalse'
  statement: string
  answer: boolean
}

export interface FillExercise extends BaseExercise {
  kind: 'fill'
  /** Sentence with a single `___` gap. */
  text: string
  /** Accepted answers (case-insensitive). */
  answers: string[]
  /** When given, the learner picks from these chips instead of typing. */
  options?: string[]
  hint?: string
}

export interface OrderExercise extends BaseExercise {
  kind: 'order'
  /** Items in the correct order. */
  items: string[]
  /** "words" builds a sentence, "lines" orders sentences / dialogue lines. */
  layout?: 'words' | 'lines'
  /** Optional translation / meaning to help. */
  translation?: string
  /** Other accepted orders. */
  alternatives?: string[][]
}

export interface MatchExercise extends BaseExercise {
  kind: 'match'
  pairs: [string, string][]
}

export interface ListenExercise extends BaseExercise {
  kind: 'listen'
  /** Text that is spoken aloud. */
  audio: string
  /** With options: choose. Without options: type what you hear. */
  options?: string[]
  answer: number | string
}

export type Exercise =
  | ChoiceExercise
  | TrueFalseExercise
  | FillExercise
  | OrderExercise
  | MatchExercise
  | ListenExercise

export type AnswerValue = number | boolean | string | string[] | null

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

export interface Word {
  id: string
  en: string
  ru: string
  emoji: string
  ipa: string
  example: string
  exampleRu: string
  category: string
}

export interface VocabCategory {
  id: string
  title: string
  titleRu: string
  emoji: string
  description: string
  words: Word[]
}

export interface GrammarTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

export interface GrammarTopic {
  id: string
  title: string
  titleRu: string
  emoji: string
  summary: string
  /** Very simple explanation in English (short bullet points). */
  explanation: string[]
  /** The same idea explained in Russian. */
  explanationRu: string[]
  tables: GrammarTable[]
  examples: { en: string; ru: string }[]
  mistakes: { wrong: string; right: string }[]
  practice: Exercise[]
  test: Exercise[]
}

export interface ReadingTask {
  id: string
  title: string
  emoji: string
  topic: string
  minutes: number
  intro: string
  paragraphs: string[]
  glossary: Record<string, string>
  exercises: Exercise[]
}

export interface DialogLine {
  speaker: string
  text: string
}

export interface ListeningTask {
  id: string
  title: string
  emoji: string
  topic: string
  description: string
  lines: DialogLine[]
  exercises: Exercise[]
}

export type SpeakingType = 'introduce' | 'repeat' | 'answer' | 'describe' | 'dialogue' | 'roleplay'

export interface SpeakingItem {
  /** What the learner sees / hears (a question, a sentence to repeat, an AI line). */
  prompt: string
  promptRu?: string
  /** For "repeat": the exact sentence to say. */
  target?: string
  /** For open answers: groups of alternatives, at least one word per group should be used. */
  keywords?: string[][]
  minWords?: number
  /** A model answer. */
  sample: string
  /** Optional sentence starter shown as a hint, e.g. "I get up at…". */
  starter?: string
  /** For role plays: what the AI partner says after the learner answers. `{name}` is replaced. */
  reply?: string
}

export interface SpeakingTask {
  id: string
  title: string
  type: SpeakingType
  emoji: string
  description: string
  instructions: string
  /** For "describe the picture": emojis that build the scene. */
  scene?: { items: string[]; caption: string }
  hints?: string[]
  items: SpeakingItem[]
}

export interface WritingCheck {
  label: string
  pattern: string
}

export interface WritingTask {
  id: string
  title: string
  emoji: string
  prompt: string
  promptRu: string
  minWords: number
  minSentences: number
  hints: string[]
  checks: WritingCheck[]
  keywords: string[]
  example: string
}

export type VideoCategory = 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Speaking' | 'Everyday English'

export interface VideoScene {
  heading: string
  narration: string
  big?: string
  body?: string
  bullets?: string[]
  examples?: { en: string; ru?: string }[]
  table?: GrammarTable
}

export interface VideoLesson {
  id: string
  title: string
  category: VideoCategory
  emoji: string
  description: string
  gradient: string
  scenes: VideoScene[]
  quiz: Exercise[]
  /** Optional real video that replaces the built-in animated lesson. */
  youtubeId?: string
  videoUrl?: string
}

export interface Unit {
  id: string
  number: number
  title: string
  subtitle: string
  emoji: string
  /** Tailwind gradient classes, e.g. "from-violet-500 to-fuchsia-500". */
  gradient: string
  description: string
  goals: string[]
  words: string[]
  grammar: string[]
  listening: string
  reading: string
  speaking: string
  writing: string
  video: string
  quiz: Exercise[]
}

/* ------------------------------------------------------------------ */
/* Progress                                                           */
/* ------------------------------------------------------------------ */

export interface Mistake {
  id: string
  exercise: Exercise
  skill: Skill
  source: string
  path: string
  given: string
  correct: string
  createdAt: number
  resolved: boolean
}

export interface ActivityRecord {
  skill: Skill
  bestAccuracy: number
  times: number
  lastAt: number
}

export interface WordProgress {
  box: number
  due: number
  seen: number
  right: number
  wrong: number
  learnedAt?: number
}

export interface AppNotification {
  id: string
  title: string
  body: string
  icon: string
  createdAt: number
  read: boolean
  path?: string
}

export type FinalSection = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'writing' | 'speaking'

export interface FinalTestResult {
  scores: Record<FinalSection, number>
  total: number
  passed: boolean
  date: number
}
