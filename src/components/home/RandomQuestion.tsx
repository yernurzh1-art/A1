import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { RANDOM_QUESTIONS } from '@/data/speaking'
import { evaluateOpenAnswer, type OpenAnswerResult } from '@/lib/text'
import { useProgress } from '@/store/progress'
import { ListenButton } from '@/components/ui/ListenButton'
import { SpeakInput } from '@/components/speaking/SpeakInput'
import { OpenFeedback } from '@/components/speaking/SpeechFeedback'

/** "Random Speaking Question" — answer aloud, get feedback and a little XP. */
export function RandomQuestion() {
  const [i, setI] = useState(() => Math.floor(Math.random() * RANDOM_QUESTIONS.length))
  const [res, setRes] = useState<{ said: string; r: OpenAnswerResult } | null>(null)
  const [key, setKey] = useState(0)
  const q = RANDOM_QUESTIONS[i]

  const shuffle = () => {
    setI((x) => (x + 1 + Math.floor(Math.random() * (RANDOM_QUESTIONS.length - 1))) % RANDOM_QUESTIONS.length)
    setRes(null)
    setKey((k) => k + 1)
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-rose-500">🎲 Random speaking question</div>
        <button onClick={shuffle} className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink" aria-label="Another question">
          <Shuffle size={17} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-extrabold">{q.q}</p>
          <p className="text-sm text-muted">{q.ru}</p>
        </div>
        <ListenButton text={q.q} size="sm" />
      </div>
      <div className="mt-4">
        <SpeakInput
          key={key}
          compact
          onResult={(said) => {
            const r = evaluateOpenAnswer(said, q.keywords, 4)
            setRes({ said, r })
            if (r.score >= 0.5) useProgress.getState().addXp(5, 'speaking')
          }}
        />
      </div>
      {res && (
        <div className="mt-4">
          <OpenFeedback said={res.said} result={res.r} sample={q.sample} minWords={4} />
        </div>
      )}
    </div>
  )
}
