import type { Word } from '@/types'
import { useProgress } from '@/store/progress'
import { strengthLabel } from '@/lib/srs'
import { ListenButton } from '@/components/ui/ListenButton'
import { cn } from '@/lib/cn'
import { WordVisual } from './WordVisual'

const TONE = {
  new: 'bg-surface-2 text-muted',
  weak: 'bg-amber-400/15 text-amber-700 dark:text-amber-300',
  ok: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  strong: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
}

/** Full word card: picture, word, IPA, translation, example — all with audio. */
export function WordCard({ word, className, big }: { word: Word; className?: string; big?: boolean }) {
  const progress = useProgress((s) => s.words[word.id])
  const showRu = useProgress((s) => s.settings.showRussian)
  const strength = strengthLabel(progress)
  return (
    <div className={cn('card flex flex-col items-center p-6 text-center', big && 'sm:p-10', className)}>
      <span className={cn('chip mb-4 self-end', TONE[strength.tone])}>{strength.label}</span>
      <WordVisual emoji={word.emoji} size={big ? 'xl' : 'lg'} />
      <h3 className={cn('mt-5 font-extrabold uppercase tracking-wide', big ? 'text-4xl sm:text-5xl' : 'text-3xl')}>{word.en}</h3>
      <div className="mt-2 flex items-center gap-2 text-muted">
        <span className="font-mono text-lg">{word.ipa}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <ListenButton text={word.en} label="Listen" />
        <ListenButton text={word.en} slow />
      </div>
      <div className="mt-5 text-xl font-bold text-brand-600 dark:text-brand-300">{word.ru}</div>
      <div className="mt-5 w-full rounded-2xl bg-surface-2 p-4 text-left">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">Example</div>
        <div className="flex items-center gap-2">
          <p className="flex-1 font-semibold">“{word.example}”</p>
          <ListenButton text={word.example} size="sm" variant="plain" />
        </div>
        {showRu && <p className="mt-1 text-sm text-muted">{word.exampleRu}</p>}
      </div>
    </div>
  )
}
