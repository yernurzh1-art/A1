import { Link } from 'react-router-dom'
import { ArrowRight, Crown, RefreshCw, Zap } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { ALL_WORDS } from '@/data/vocabulary'
import { SKILLS, BOOK_META } from '@/lib/skills'
import { isDue } from '@/lib/srs'
import { dayKey } from '@/lib/date'
import { PageHeader, SectionTitle } from '@/components/ui/PageHeader'
import { IconTile } from '@/components/ui/IconTile'
import { RandomQuestion } from '@/components/home/RandomQuestion'

const GAMES = [
  { to: '/games/match', emoji: '🃏', title: 'Word Match Sprint', text: 'Match 8 pairs as fast as you can.', tone: 'from-violet-500 to-fuchsia-500' },
  { to: '/games/spelling', emoji: '🐝', title: 'Spelling Bee', text: 'Listen to a word and spell it.', tone: 'from-amber-400 to-orange-500' },
  { to: '/games/builder', emoji: '🧱', title: 'Sentence Builder', text: 'Build correct sentences from words.', tone: 'from-sky-500 to-indigo-500' },
]

export default function Practice() {
  const allMistakes = useProgress((s) => s.mistakes)
  const mistakes = allMistakes.filter((m) => !m.resolved)
  const words = useProgress((s) => s.words)
  const challenge = useProgress((s) => s.challenges[dayKey()])
  const due = ALL_WORDS.filter((w) => isDue(words[w.id])).length
  const week = mistakes.filter((m) => Date.now() - m.createdAt < 7 * 86400000).length
  const skills = [SKILLS.speaking, SKILLS.listening, SKILLS.reading, SKILLS.writing, SKILLS.grammar, SKILLS.vocabulary, SKILLS.video]

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Practice" title="Practise every skill" subtitle="Review your mistakes, play mini-games, take the daily challenge or choose a skill center." />

      <section className="grid gap-4 lg:grid-cols-3">
        <Link to="/review" className="card card-hover group relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-4 -top-4 text-8xl opacity-10">♻️</div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-500">
            <RefreshCw size={14} /> Review mistakes
          </div>
          <div className="mt-3 text-4xl font-extrabold">{mistakes.length}</div>
          <p className="text-muted">{week > 0 ? `You made ${week} mistakes this week.` : 'No open mistakes — great job!'}</p>
          <div className="mt-4 flex items-center gap-1 font-bold text-brand-600 dark:text-brand-300">
            Practice again <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
        <Link to="/challenge" className="card card-hover group relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-4 -top-4 text-8xl opacity-10">⚡</div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-fuchsia-500">
            <Zap size={14} /> Daily challenge
          </div>
          <div className="mt-3 text-2xl font-extrabold">{challenge !== undefined ? `Done · ${challenge}%` : '6 questions · +30 XP'}</div>
          <p className="text-muted">A new mix of grammar, words, reading and dictation every day.</p>
          <div className="mt-4 flex items-center gap-1 font-bold text-brand-600 dark:text-brand-300">
            {challenge !== undefined ? 'Play again' : 'Start'} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
        <Link to="/vocabulary/review" className="card card-hover group relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-4 -top-4 text-8xl opacity-10">🧠</div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500">Spaced repetition</div>
          <div className="mt-3 text-4xl font-extrabold">{due}</div>
          <p className="text-muted">{due ? 'words are ready for review.' : 'No words due now. Practise any time!'}</p>
          <div className="mt-4 flex items-center gap-1 font-bold text-brand-600 dark:text-brand-300">
            Review words <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      <section>
        <SectionTitle title="🎮 Mini-games" subtitle="Quick, fun and good for your memory." />
        <div className="grid gap-4 sm:grid-cols-3">
          {GAMES.map((g) => (
            <Link key={g.to} to={g.to} className="card card-hover group overflow-hidden">
              <div className={`grid h-28 place-items-center bg-gradient-to-br text-6xl ${g.tone}`}>
                <span className="transition duration-300 group-hover:-rotate-6 group-hover:scale-110">{g.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-extrabold">{g.title}</h3>
                <p className="text-sm text-muted">{g.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Skill centers" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...skills, BOOK_META].map((s) => (
            <Link key={s.path} to={s.path} className="card card-hover flex items-center gap-3 p-4">
              <IconTile icon={s.icon} gradient={s.tone.gradient} size="sm" />
              <span className="font-bold">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <RandomQuestion />
        <div className="grid gap-4">
          <Link to="/pronunciation" className="card card-hover p-5">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-rose-500">👄 Pronunciation practice</div>
            <h3 className="mt-2 text-lg font-extrabold">Minimal pairs: ship / sheep, think / sink</h3>
            <p className="text-sm text-muted">Listen, choose the word you hear, then say it yourself.</p>
          </Link>
          <Link to="/leaderboard" className="card card-hover flex items-center gap-4 p-5">
            <Crown className="text-yellow-500" size={32} />
            <div>
              <h3 className="font-extrabold">Weekly league</h3>
              <p className="text-sm text-muted">See how you rank this week (demo).</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
