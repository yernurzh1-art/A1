import { useState } from 'react'
import type { GrammarTopic } from '@/types'
import { useProgress } from '@/store/progress'
import { ListenButton } from '@/components/ui/ListenButton'
import { Segmented } from '@/components/ui/Segmented'

/** Explanation (EN / RU), tables, examples and common mistakes for a grammar topic. */
export function GrammarTheory({ topic }: { topic: GrammarTopic }) {
  const showRu = useProgress((s) => s.settings.showRussian)
  const [lang, setLang] = useState<'en' | 'ru'>('en')
  const lines = lang === 'en' ? topic.explanation : topic.explanationRu

  return (
    <div className="space-y-5">
      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold">💡 The rule — very simply</h3>
          {showRu && (
            <Segmented
              size="sm"
              value={lang}
              onChange={setLang}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ru', label: 'По-русски' },
              ]}
            />
          )}
        </div>
        <ol className="space-y-3">
          {lines.map((l, i) => (
            <li key={`${lang}-${i}`} className="flex animate-fade-up gap-3" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-500/10 text-sm font-extrabold text-blue-600 dark:text-blue-300">{i + 1}</span>
              <span className="pt-0.5 leading-relaxed">{l}</span>
            </li>
          ))}
        </ol>
      </section>

      {topic.tables.map((t, i) => (
        <section key={i} className="card overflow-hidden">
          {t.caption && <div className="border-b border-line bg-surface-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-muted">{t.caption}</div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-[15px]">
              <thead>
                <tr className="bg-blue-500/5">
                  {t.headers.map((h) => (
                    <th key={h} className="px-5 py-3 font-extrabold text-blue-700 dark:text-blue-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r, ri) => (
                  <tr key={ri} className="border-t border-line transition-colors hover:bg-surface-2">
                    {r.map((c, ci) => (
                      <td key={ci} className={ci === 0 ? 'px-5 py-3 font-bold' : 'px-5 py-3'}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="card p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-extrabold">🗣️ Examples</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {topic.examples.map((e) => (
            <li key={e.en} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold">{e.en}</div>
                {showRu && <div className="text-sm text-muted">{e.ru}</div>}
              </div>
              <ListenButton text={e.en} size="sm" />
            </li>
          ))}
        </ul>
      </section>

      {topic.mistakes.length > 0 && (
        <section className="card p-5 sm:p-6">
          <h3 className="mb-4 text-lg font-extrabold">⚠️ Common mistakes</h3>
          <ul className="space-y-2">
            {topic.mistakes.map((m) => (
              <li key={m.wrong} className="grid gap-2 sm:grid-cols-2">
                <span className="rounded-xl bg-rose-500/10 px-3 py-2 text-rose-700 line-through decoration-rose-400/70 dark:text-rose-300">✗ {m.wrong}</span>
                <span className="rounded-xl bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-300">✓ {m.right}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
