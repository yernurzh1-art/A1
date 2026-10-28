import { Link } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { GRAMMAR_TOPICS } from '@/data/grammar'
import { UNITS } from '@/data/units'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { CenterHeader } from '@/components/common/CenterHeader'

export default function GrammarCenter() {
  const activities = useProgress((s) => s.activities)
  const done = GRAMMAR_TOPICS.filter((t) => activities[`grammar-test:${t.id}`]).length
  return (
    <div>
      <CenterHeader
        icon={SKILLS.grammar.icon}
        gradient={SKILLS.grammar.tone.gradient}
        title="Grammar Center"
        subtitle="All 15 A1 topics. Each one has a very simple explanation (in English and Russian), a table, examples, interactive practice and a mini-test."
        done={done}
        total={GRAMMAR_TOPICS.length}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GRAMMAR_TOPICS.map((t, i) => {
          const test = activities[`grammar-test:${t.id}`]
          const practice = activities[`grammar-practice:${t.id}`]
          const unit = UNITS.find((u) => u.grammar.includes(t.id))
          return (
            <Link key={t.id} to={`/grammar/${t.id}`} className="card card-hover group flex animate-fade-up flex-col p-5" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-2xl transition group-hover:scale-110">{t.emoji}</span>
                <span className="text-xs font-bold text-faint">#{i + 1}</span>
              </div>
              <h3 className="mt-4 font-extrabold">{t.title}</h3>
              <div className="text-sm text-muted">{t.titleRu}</div>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-2">{t.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {unit && <span className="chip bg-surface-2">Unit {unit.number}</span>}
                {practice && <span className="chip bg-blue-500/10 text-blue-700 dark:text-blue-300">Practice ✓</span>}
                {test ? (
                  <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <CircleCheck size={12} /> Test {Math.round(test.bestAccuracy * 100)}%
                  </span>
                ) : (
                  <span className="chip bg-amber-400/15 text-amber-700 dark:text-amber-300">Mini-test</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
