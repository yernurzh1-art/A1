import { UNITS } from '@/data/units'
import { GRAMMAR_TOPICS } from '@/data/grammar'
import { ALL_WORDS, VOCAB_CATEGORIES } from '@/data/vocabulary'
import { READING_TASKS } from '@/data/reading'
import { LISTENING_TASKS } from '@/data/listening'
import { SPEAKING_TASKS } from '@/data/speaking'
import { WRITING_TASKS } from '@/data/writing'
import { VIDEO_LESSONS } from '@/data/videos'
import { BOOK } from '@/data/book'

export type SearchGroup = 'Pages' | 'Units' | 'Grammar' | 'Words' | 'Reading' | 'Listening' | 'Speaking' | 'Writing' | 'Videos' | 'Book'

export interface SearchItem {
  group: SearchGroup
  title: string
  subtitle: string
  emoji: string
  path: string
  /** Lower-case text that is searched. */
  haystack: string
}

const item = (group: SearchGroup, title: string, subtitle: string, emoji: string, path: string, extra = ''): SearchItem => ({
  group,
  title,
  subtitle,
  emoji,
  path,
  haystack: `${title} ${subtitle} ${extra}`.toLowerCase(),
})

let index: SearchItem[] | null = null

export function searchIndex(): SearchItem[] {
  if (index) return index
  index = [
    item('Pages', 'Learn — course map', 'All 10 units from zero to A1', '🗺️', '/learn', 'course path units'),
    item('Pages', 'Practice', 'Skill centers, games and daily challenge', '🎯', '/practice', 'games'),
    item('Pages', 'Review Mistakes', 'Practise what you got wrong', '♻️', '/review', 'errors'),
    item('Pages', 'Progress', 'Stats, XP and weekly chart', '📊', '/progress', 'dashboard statistics'),
    item('Pages', 'Profile & achievements', 'Settings, badges and goals', '👤', '/profile', 'settings dark mode'),
    item('Pages', 'Leaderboard', 'Weekly league (demo)', '👑', '/leaderboard'),
    item('Pages', 'Daily Challenge', '6 quick questions every day', '⚡', '/challenge'),
    item('Pages', 'Pronunciation Practice', 'TH, ship / sheep, V / W', '👄', '/pronunciation'),
    item('Pages', 'Final A1 Test', 'Six sections and a certificate', '🏆', '/final-test', 'exam'),
    item('Pages', 'Book Trailer', BOOK.title, '🎬', '/book', 'story'),
    item('Pages', 'Word Match Sprint', 'Mini-game', '🎮', '/games/match', 'game'),
    item('Pages', 'Spelling Bee', 'Mini-game: listen and spell', '🐝', '/games/spelling', 'game'),
    ...UNITS.map((u) => item('Units', `Unit ${u.number} — ${u.title}`, u.subtitle, u.emoji, `/learn/${u.id}`, u.goals.join(' '))),
    ...GRAMMAR_TOPICS.map((t) => item('Grammar', t.title, t.summary, t.emoji, `/grammar/${t.id}`, t.titleRu)),
    ...VOCAB_CATEGORIES.map((c) => item('Words', `${c.title} (category)`, `${c.words.length} words · ${c.titleRu}`, c.emoji, `/vocabulary/${c.id}`)),
    ...ALL_WORDS.map((w) => item('Words', w.en, w.ru, w.emoji.startsWith('#') ? '🎨' : w.emoji, `/vocabulary/${w.category}?word=${w.id}`, w.example)),
    ...READING_TASKS.map((r) => item('Reading', r.title, r.topic, r.emoji, `/reading/${r.id}`)),
    ...LISTENING_TASKS.map((l) => item('Listening', l.title, l.topic, l.emoji, `/listening/${l.id}`)),
    ...SPEAKING_TASKS.map((s) => item('Speaking', s.title, s.description, s.emoji, `/speaking/${s.id}`, s.type)),
    ...WRITING_TASKS.map((w) => item('Writing', w.title, w.prompt, w.emoji, `/writing/${w.id}`)),
    ...VIDEO_LESSONS.map((v) => item('Videos', v.title, `${v.category} · ${v.description}`, v.emoji, `/videos/${v.id}`)),
    ...BOOK.chapters.map((c) => item('Book', `Chapter ${c.number}: ${c.title}`, BOOK.title, c.emoji, `/book/chapter/${c.id}`)),
  ]
  return index
}

export function search(query: string, limit = 30): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const words = q.split(/\s+/)
  const scored = searchIndex()
    .filter((it) => words.every((w) => it.haystack.includes(w)))
    .map((it) => {
      const t = it.title.toLowerCase()
      const score = t === q ? 0 : t.startsWith(q) ? 1 : t.includes(q) ? 2 : 3
      return { it, score }
    })
    .sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((s) => s.it)
}
