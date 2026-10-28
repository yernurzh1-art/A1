/**
 * Text helpers used to compare what the learner said or typed with the
 * expected answer. Everything is deliberately forgiving: case, punctuation,
 * contractions and digits vs. words do not matter.
 */

const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am',
  "you're": 'you are',
  "we're": 'we are',
  "they're": 'they are',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "that's": 'that is',
  "what's": 'what is',
  "where's": 'where is',
  "who's": 'who is',
  "how's": 'how is',
  "there's": 'there is',
  "here's": 'here is',
  "let's": 'let us',
  "i've": 'i have',
  "you've": 'you have',
  "we've": 'we have',
  "they've": 'they have',
  "i'll": 'i will',
  "you'll": 'you will',
  "i'd": 'i would',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "haven't": 'have not',
  "hasn't": 'has not',
  "can't": 'can not',
  cannot: 'can not',
  "won't": 'will not',
  "wouldn't": 'would not',
  "couldn't": 'could not',
  "o'clock": 'oclock',
}

/** Contractions typed without the apostrophe ("dont", "im"). Ambiguous ones (its, were, well…) are left out. */
const LOOSE: Record<string, string> = {
  im: 'i am',
  youre: 'you are',
  theyre: 'they are',
  whats: 'what is',
  thats: 'that is',
  wheres: 'where is',
  theres: 'there is',
  shes: 'she is',
  hes: 'he is',
  ive: 'i have',
  dont: 'do not',
  doesnt: 'does not',
  didnt: 'did not',
  isnt: 'is not',
  arent: 'are not',
  wasnt: 'was not',
  cant: 'can not',
  havent: 'have not',
  hasnt: 'has not',
}

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

export function numberToWords(n: number): string {
  if (!Number.isFinite(n) || n < 0 || n > 9999) return String(n)
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '')
  if (n < 1000) {
    return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '')
  }
  return numberToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '')
}

/** Lower-case, unify apostrophes, expand contractions, digits → words, drop punctuation. */
export function normalize(input: string): string {
  let s = input.toLowerCase().replace(/[’‘`´]/g, "'")
  s = s.replace(/\b\d+\b/g, (d) => numberToWords(Number(d)))
  s = s.replace(/[a-z]+'[a-z]+|cannot/g, (w) => (Object.hasOwn(CONTRACTIONS, w) ? CONTRACTIONS[w] : w.replace("'", '')))
  s = s.replace(/-/g, ' ')
  s = s.replace(/[^a-z\s]/g, ' ')
  s = s.replace(/[a-z]+/g, (w) => (Object.hasOwn(LOOSE, w) ? LOOSE[w] : w))
  return s.replace(/\s+/g, ' ').trim()
}

export function tokens(input: string): string[] {
  const n = normalize(input)
  return n ? n.split(' ') : []
}

export function wordCount(input: string): number {
  return input.trim() ? input.trim().split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w)).length : 0
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[b.length]
}

/** Similar enough to count as the same word (small typos / recogniser slips). */
export function similarWord(a: string, b: string): boolean {
  if (a === b) return true
  const longest = Math.max(a.length, b.length)
  if (longest <= 3) return false
  return levenshtein(a, b) <= (longest >= 7 ? 2 : 1)
}

/** Normalised comparison for typed answers. */
export function sameAnswer(given: string, expected: string): boolean {
  return normalize(given) === normalize(expected)
}

export interface WordMatch {
  /** The word as written in the target sentence. */
  word: string
  ok: boolean
}

export interface CompareResult {
  words: WordMatch[]
  score: number
  missed: string[]
  extra: string[]
}

/**
 * Align the spoken text with the target sentence (longest common subsequence
 * over normalised tokens) and report which target words were said.
 */
export function compareSentence(target: string, spoken: string): CompareResult {
  const display = target.split(/\s+/).filter(Boolean)
  // flatten target into normalised tokens, remembering which display word each came from
  const flat: { token: string; index: number }[] = []
  display.forEach((w, index) => tokens(w).forEach((token) => flat.push({ token, index })))
  const said = tokens(spoken)

  const n = flat.length
  const m = said.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = similarWord(flat[i].token, said[j])
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const matchedFlat = new Array<boolean>(n).fill(false)
  const matchedSaid = new Array<boolean>(m).fill(false)
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (similarWord(flat[i].token, said[j]) && dp[i][j] === dp[i + 1][j + 1] + 1) {
      matchedFlat[i] = true
      matchedSaid[j] = true
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }

  const words: WordMatch[] = display.map((word, index) => {
    const parts = flat.map((f, k) => ({ ...f, k })).filter((f) => f.index === index)
    const ok = parts.length === 0 ? true : parts.every((p) => matchedFlat[p.k])
    return { word, ok }
  })
  const scored = words.filter((w) => tokens(w.word).length > 0)
  const score = scored.length ? scored.filter((w) => w.ok).length / scored.length : 0
  return {
    words,
    score,
    missed: words.filter((w) => !w.ok).map((w) => w.word.replace(/[^\w'’-]/g, '')),
    extra: said.filter((_, k) => !matchedSaid[k]),
  }
}

export interface OpenAnswerResult {
  score: number
  wordCount: number
  usedGroups: number
  totalGroups: number
  missingHints: string[]
}

/**
 * Evaluate a free answer: it should be long enough and use at least one word
 * from every keyword group (e.g. [["name"], ["am", "is"]]).
 */
export function evaluateOpenAnswer(spoken: string, keywords: string[][] = [], minWords = 3): OpenAnswerResult {
  const said = tokens(spoken)
  const missingHints: string[] = []
  let usedGroups = 0
  for (const group of keywords) {
    const hit = group.some((kw) => {
      const kwTokens = tokens(kw)
      if (kwTokens.length === 1) return said.some((w) => similarWord(w, kwTokens[0]))
      return normalize(spoken).includes(kwTokens.join(' '))
    })
    if (hit) usedGroups++
    else missingHints.push(group[0])
  }
  const lengthScore = Math.min(1, said.length / Math.max(1, minWords))
  const keywordScore = keywords.length ? usedGroups / keywords.length : 1
  const score = said.length === 0 ? 0 : 0.4 * lengthScore + 0.6 * keywordScore
  return { score, wordCount: said.length, usedGroups, totalGroups: keywords.length, missingHints }
}

/** Pull a name out of answers like "My name is Anna" / "I'm Anna" / "Anna". */
export function extractName(answer: string): string | null {
  const clean = answer.replace(/[.!?,]/g, ' ').trim()
  const m =
    clean.match(/\bmy name is\s+([A-Za-zА-Яа-яЁё'-]+)/i) ??
    clean.match(/\bi am\s+([A-Za-z'-]+)/i) ??
    clean.match(/\bi'?m\s+([A-Za-z'-]+)/i) ??
    clean.match(/\bcall me\s+([A-Za-z'-]+)/i)
  let name = m?.[1] ?? (clean.split(/\s+/).length === 1 ? clean : null)
  if (!name) return null
  if (/^(a|an|the|from|fine|good|ok|okay|very|so|not|years|student|teacher)$/i.test(name)) return null
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  return name
}

/** Split a paragraph into sentences (keeps the punctuation). */
export function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+["”’)]*|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? []
}
