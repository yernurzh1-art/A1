import { Link } from 'react-router-dom'
import { wordOfTheDay } from '@/lib/course'
import { ListenButton } from '@/components/ui/ListenButton'
import { WordVisual } from '@/components/vocabulary/WordVisual'

export function WordOfTheDay() {
  const w = wordOfTheDay()
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10" />
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500">Word of the day</div>
      <div className="mt-3 flex items-center gap-4">
        <WordVisual emoji={w.emoji} size="lg" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-extrabold">{w.en}</h3>
            <ListenButton text={w.en} size="sm" />
          </div>
          <div className="font-mono text-sm text-muted">{w.ipa}</div>
          <div className="font-semibold text-violet-600 dark:text-violet-300">{w.ru}</div>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-surface-2 px-4 py-3 text-sm">
        “{w.example}” <span className="text-muted">— {w.exampleRu}</span>
      </p>
      <Link to={`/vocabulary/${w.category}?word=${w.id}`} className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
        More words like this →
      </Link>
    </div>
  )
}
