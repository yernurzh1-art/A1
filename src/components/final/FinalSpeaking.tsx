import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { SpeakingItem } from '@/types'
import { evaluateOpenAnswer, type OpenAnswerResult } from '@/lib/text'
import { Button } from '@/components/ui/Button'
import { ListenButton } from '@/components/ui/ListenButton'
import { SpeakInput } from '@/components/speaking/SpeakInput'
import { OpenFeedback } from '@/components/speaking/SpeechFeedback'

export function FinalSpeaking({ items, onDone }: { items: SpeakingItem[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [attempt, setAttempt] = useState<{ said: string; r: OpenAnswerResult } | null>(null)
  const item = items[i]
  const last = i === items.length - 1

  const next = () => {
    const all = [...scores, attempt?.r.score ?? 0]
    if (last) onDone(all.reduce((a, b) => a + b, 0) / items.length)
    else {
      setScores(all)
      setI(i + 1)
      setAttempt(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div key={i} className="card animate-fade-up p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-muted">
          Question {i + 1} of {items.length} · answer aloud
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="text-2xl font-extrabold">{item.prompt}</p>
          <ListenButton text={item.prompt} />
        </div>
        <div className="mt-6">
          <SpeakInput key={i} onResult={(said) => setAttempt({ said, r: evaluateOpenAnswer(said, item.keywords, item.minWords ?? 5) })} />
        </div>
        {attempt && (
          <div className="mt-5">
            <OpenFeedback said={attempt.said} result={attempt.r} sample={item.sample} minWords={item.minWords ?? 5} />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end">
        <Button size="lg" disabled={!attempt} onClick={next} iconRight={<ArrowRight size={18} />}>
          {last ? 'See my results' : 'Next question'}
        </Button>
      </div>
    </div>
  )
}
