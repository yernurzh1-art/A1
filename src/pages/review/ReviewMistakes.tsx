import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Trash } from 'lucide-react'
import type { Skill } from '@/types'
import { useProgress } from '@/store/progress'
import { ALL_WORDS } from '@/data/vocabulary'
import { SKILLS } from '@/lib/skills'
import { exerciseTitle } from '@/lib/exercises'
import { timeAgo } from '@/lib/date'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink, Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Segmented } from '@/components/ui/Segmented'
import { WordVisual } from '@/components/vocabulary/WordVisual'

export default function ReviewMistakes() {
  const mistakes = useProgress((s) => s.mistakes)
  const words = useProgress((s) => s.words)
  const fixed = useProgress((s) => s.stats.mistakesFixed)
  const clearResolved = useProgress((s) => s.clearResolvedMistakes)
  const [filter, setFilter] = useState<'all' | Skill>('all')

  const open = mistakes.filter((m) => !m.resolved)
  const week = open.filter((m) => Date.now() - m.createdAt < 7 * 86400000).length
  const bySkill = open.reduce<Partial<Record<Skill, number>>>((acc, m) => ({ ...acc, [m.skill]: (acc[m.skill] ?? 0) + 1 }), {})
  const shown = (filter === 'all' ? open : open.filter((m) => m.skill === filter)).slice(0, 60)
  const hardWords = ALL_WORDS.filter((w) => (words[w.id]?.wrong ?? 0) > 0).sort((a, b) => (words[b.id]?.wrong ?? 0) - (words[a.id]?.wrong ?? 0)).slice(0, 12)

  return (
    <div>
      <PageHeader eyebrow="Review" title="♻️ Review Mistakes" subtitle="Every mistake is saved here. Practise them again until they are fixed — and earn hearts back." />

      <section className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lift sm:p-8">
          <div className="pointer-events-none absolute -right-6 -top-6 text-[9rem] leading-none opacity-20">♻️</div>
          <div className="relative">
            <div className="text-5xl font-extrabold">{week}</div>
            <p className="mt-1 text-lg font-semibold">{week === 1 ? 'mistake' : 'mistakes'} this week · {open.length} open in total</p>
            <p className="mt-2 max-w-md text-white/90">Correct answers in review fix the mistake and give you +1 ❤️.</p>
            {open.length > 0 ? (
              <ButtonLink to="/review/practice" variant="white" size="lg" className="mt-6" iconRight={<ArrowRight size={18} />}>
                Practice again
              </ButtonLink>
            ) : (
              <div className="mt-6 inline-block rounded-2xl bg-white/20 px-4 py-2 font-bold">Nothing to fix — well done! 🎉</div>
            )}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-extrabold">By skill</h3>
          <ul className="mt-3 space-y-2">
            {(Object.keys(SKILLS) as Skill[])
              .filter((k) => bySkill[k])
              .map((k) => {
                const S = SKILLS[k]
                return (
                  <li key={k} className="flex items-center gap-3">
                    <span className={cn('grid h-8 w-8 place-items-center rounded-lg', S.tone.soft)}>
                      <S.icon size={16} className={S.tone.text} />
                    </span>
                    <span className="flex-1 font-semibold">{S.label}</span>
                    <span className="font-extrabold">{bySkill[k]}</span>
                  </li>
                )
              })}
            {open.length === 0 && <li className="text-sm text-muted">No open mistakes.</li>}
          </ul>
          <div className="mt-4 border-t border-line pt-3 text-sm text-muted">✅ {fixed} mistakes fixed so far</div>
        </div>
      </section>

      {hardWords.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">🧠 Difficult words</h2>
            <Link to="/vocabulary/review" className="text-sm font-bold text-brand-600 hover:underline dark:text-brand-300">
              Review with flashcards →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {hardWords.map((w) => (
              <span key={w.id} className="flex items-center gap-2 rounded-2xl border border-line bg-surface py-1.5 pl-1.5 pr-3 shadow-soft">
                <WordVisual emoji={w.emoji} size="sm" />
                <span>
                  <span className="block text-sm font-bold">{w.en}</span>
                  <span className="block text-xs text-muted">{w.ru}</span>
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Your mistakes</h2>
          {mistakes.some((m) => m.resolved) && (
            <Button size="sm" variant="ghost" icon={<Trash size={14} />} onClick={clearResolved}>
              Clear fixed
            </Button>
          )}
        </div>
        {open.length > 0 && (
          <Segmented
            className="mb-4"
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[{ value: 'all', label: `All (${open.length})` }, ...(Object.keys(bySkill) as Skill[]).map((k) => ({ value: k, label: `${SKILLS[k].label} (${bySkill[k]})` }))]}
          />
        )}
        {open.length === 0 ? (
          <EmptyState emoji="🎯" title="No mistakes to review" body="When you answer something wrong, it appears here so you can practise it again." action={<ButtonLink to="/learn">Continue learning</ButtonLink>} />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {shown.map((m) => (
              <li key={m.id} className="card p-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <Link to={m.path} className={cn('chip', SKILLS[m.skill].tone.soft, SKILLS[m.skill].tone.text)}>
                    {m.source}
                  </Link>
                  <span className="text-faint">{timeAgo(m.createdAt)}</span>
                </div>
                <p className="mt-3 font-bold">{exerciseTitle(m.exercise)}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="text-rose-600 dark:text-rose-300">
                    ✗ Your answer: <span className="line-through">{m.given}</span>
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300">
                    ✓ Correct: <b>{m.correct}</b>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
