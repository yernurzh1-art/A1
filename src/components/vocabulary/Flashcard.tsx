import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'
import type { Word } from '@/types'
import { ListenButton } from '@/components/ui/ListenButton'
import { speak } from '@/lib/speech'
import { cn } from '@/lib/cn'
import { WordVisual } from './WordVisual'

/** A card that flips: English on the front, translation + example on the back. */
export function Flashcard({ word, flipped, onFlip, autoSpeak = true }: { word: Word; flipped: boolean; onFlip: () => void; autoSpeak?: boolean }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(false)
    const t = window.setTimeout(() => setReady(true), 50)
    if (autoSpeak) speak(word.en)
    return () => window.clearTimeout(t)
  }, [word, autoSpeak])

  return (
    <div className="perspective mx-auto w-full max-w-md">
      <div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), onFlip())}
        aria-label={flipped ? 'Show front' : 'Flip the card'}
        className={cn('preserve-3d relative h-80 w-full cursor-pointer duration-500 sm:h-96', ready && 'transition-transform', flipped && 'rotate-y-180')}
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-4xl border border-line bg-surface p-6 shadow-lift">
          <WordVisual emoji={word.emoji} size="xl" plain />
          <div className="mt-5 text-4xl font-extrabold sm:text-5xl">{word.en}</div>
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <ListenButton text={word.en} label="Listen" />
          </div>
          <div className="absolute bottom-5 flex items-center gap-1.5 text-sm font-semibold text-faint">
            <RotateCw size={14} /> Tap to flip
          </div>
        </div>
        {/* Back */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-4xl border border-brand-300/50 bg-gradient-to-br from-brand-500 to-violet-600 p-6 text-center text-white shadow-lift">
          <div className="text-3xl font-extrabold sm:text-4xl">{word.ru}</div>
          <div className="mt-2 font-mono text-lg text-white/80">{word.ipa}</div>
          <div className="mt-6 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
            <div className="font-semibold">“{word.example}”</div>
            <div className="mt-1 text-sm text-white/75">{word.exampleRu}</div>
          </div>
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <ListenButton text={word.example} label="Example" variant="plain" className="bg-white/15 text-white hover:bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  )
}
