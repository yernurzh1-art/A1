import type { WritingTask } from '@/types'
import { splitSentences, wordCount } from './text'

export type CheckStatus = 'pass' | 'warn' | 'fail'

export interface WritingFeedbackItem {
  status: CheckStatus
  title: string
  detail?: string
}

export interface WritingResult {
  score: number
  words: number
  sentences: number
  items: WritingFeedbackItem[]
  grammarIssues: { found: string; tip: string }[]
}

/** Typical A1 mistakes with a short, friendly tip. */
const COMMON_MISTAKES: { re: RegExp; tip: string }[] = [
  { re: /\bi\b/g, tip: 'Always write "I" with a capital letter.' },
  { re: /(?<!\b(?:does|did|can|will|could|would|should|must|doesn't|didn't|does not|did not)\s)\b(he|she|it)\s+(have)\b/gi, tip: 'He / she / it → "has", not "have".' },
  { re: /\b(i|you|we|they)\s+(has)\b/gi, tip: 'I / you / we / they → "have", not "has".' },
  { re: /\bi\s+(is|are)\b/gi, tip: 'Use "I am" (I\'m).' },
  { re: /\b(he|she|it)\s+(am|are)\b/gi, tip: 'He / she / it → "is".' },
  { re: /\b(you|we|they)\s+(am|is)\b/gi, tip: 'You / we / they → "are".' },
  { re: /(?<!\b(?:does|did|can|will|could|would|should|must|doesn't|didn't|does not|did not|to|let)\s)\b(he|she|it)\s+(like|live|work|go|want|play|love|eat|drink|watch|read|speak|get|study)\b/gi, tip: 'Present Simple: he / she / it + verb + s (she likes, he lives).' },
  { re: /\b(he|she|it)\s+don'?t\b/gi, tip: 'He / she / it → "doesn\'t".' },
  { re: /\b(doesn'?t|don'?t|didn'?t)\s+(\w+s)\b/gi, tip: 'After don\'t / doesn\'t / didn\'t use the base verb (she doesn\'t like).' },
  { re: /\ba\s+(apple|orange|egg|umbrella|hour|old|actor|engineer|artist|ice|elephant|english|uncle|onion)\b/gi, tip: 'Use "an" before a vowel sound (an apple, an engineer).' },
  { re: /\ban\s+(b|c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)\w*/gi, tip: 'Use "a" before a consonant sound (a banana, a teacher).' },
  { re: /\b(i|you|we|they|he|she)\s+not\s+(like|have|go|live|work|play)\b/gi, tip: 'Negative: I don\'t like / she doesn\'t like.' },
  { re: /\b(childs|mans|womans|peoples|mouses|foots|tooths)\b/gi, tip: 'Irregular plural: children, men, women, people, mice, feet, teeth.' },
  { re: /\b(\w+)\s+\1\b/gi, tip: 'The same word is written twice.' },
  { re: /\b(in|on)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/g, tip: 'Days of the week start with a capital letter (Monday).' },
]

function findMistakes(text: string): { found: string; tip: string }[] {
  const issues: { found: string; tip: string }[] = []
  for (const { re, tip } of COMMON_MISTAKES) {
    re.lastIndex = 0
    let m: RegExpExecArray | null
    const isLowerI = tip.startsWith('Always write "I"')
    while ((m = re.exec(text))) {
      if (isLowerI && m[0] !== 'i') continue
      issues.push({ found: m[0], tip })
      break
    }
  }
  return issues
}

export function checkWriting(text: string, task: Pick<WritingTask, 'minWords' | 'minSentences' | 'checks' | 'keywords'>): WritingResult {
  const trimmed = text.trim()
  const words = wordCount(trimmed)
  const sentenceList = splitSentences(trimmed).filter((s) => wordCount(s) > 0)
  const sentences = sentenceList.length
  const items: WritingFeedbackItem[] = []
  let points = 0
  let max = 0

  // 1. Length
  max += 2
  if (words >= task.minWords) {
    points += 2
    items.push({ status: 'pass', title: `Length: ${words} words`, detail: `Goal: at least ${task.minWords} words.` })
  } else {
    if (words >= task.minWords * 0.6) points += 1
    items.push({ status: words >= task.minWords * 0.6 ? 'warn' : 'fail', title: `Length: ${words} / ${task.minWords} words`, detail: 'Write a little more.' })
  }

  // 2. Sentences
  max += 2
  if (sentences >= task.minSentences) {
    points += 2
    items.push({ status: 'pass', title: `${sentences} sentences`, detail: `Goal: ${task.minSentences} or more.` })
  } else {
    if (sentences >= task.minSentences - 1 && sentences > 0) points += 1
    items.push({ status: sentences > 0 ? 'warn' : 'fail', title: `${sentences} / ${task.minSentences} sentences`, detail: 'Finish each sentence with a full stop (.)' })
  }

  // 3. Capital letters
  max += 1
  const lowerStarts = sentenceList.filter((s) => /^[a-z]/.test(s.replace(/^["“'(]+/, '')))
  if (sentences > 0 && lowerStarts.length === 0) {
    points += 1
    items.push({ status: 'pass', title: 'Capital letters', detail: 'Every sentence starts with a capital letter.' })
  } else if (sentences > 0) {
    items.push({ status: 'warn', title: 'Capital letters', detail: `Start sentences with a capital letter: "${lowerStarts[0].slice(0, 30)}…"` })
  }

  // 4. Punctuation
  max += 1
  if (/[.!?]["”’)]?$/.test(trimmed)) {
    points += 1
    items.push({ status: 'pass', title: 'Punctuation', detail: 'Your text ends with a punctuation mark.' })
  } else if (trimmed) {
    items.push({ status: 'warn', title: 'Punctuation', detail: 'End the last sentence with . ! or ?' })
  }

  // 5. Task-specific structures
  for (const check of task.checks) {
    max += 2
    const ok = new RegExp(check.pattern, 'i').test(trimmed)
    if (ok) points += 2
    items.push({ status: ok ? 'pass' : 'fail', title: check.label, detail: ok ? 'Used ✓' : 'Try to use this structure.' })
  }

  // 6. Topic vocabulary
  if (task.keywords.length) {
    max += 2
    const lower = trimmed.toLowerCase()
    const used = task.keywords.filter((k) => new RegExp(`\\b${k.toLowerCase()}`, 'i').test(lower))
    const enough = Math.min(3, task.keywords.length)
    points += Math.min(2, (used.length / enough) * 2)
    items.push({
      status: used.length >= enough ? 'pass' : used.length > 0 ? 'warn' : 'fail',
      title: `Topic words: ${used.length}`,
      detail: used.length ? `You used: ${used.slice(0, 6).join(', ')}` : `Try words like: ${task.keywords.slice(0, 5).join(', ')}`,
    })
  }

  // 7. Common grammar mistakes
  const grammarIssues = findMistakes(trimmed)
  max += 2
  if (grammarIssues.length === 0 && words > 0) {
    points += 2
    items.push({ status: 'pass', title: 'Grammar check', detail: 'No common A1 mistakes found.' })
  } else if (words > 0) {
    points += grammarIssues.length === 1 ? 1 : 0
    items.push({ status: 'warn', title: `Grammar check: ${grammarIssues.length} tip${grammarIssues.length > 1 ? 's' : ''}`, detail: grammarIssues[0]?.tip })
  }

  const score = words === 0 ? 0 : Math.round((points / max) * 100)
  return { score, words, sentences, items, grammarIssues }
}
