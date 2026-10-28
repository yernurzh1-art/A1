import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_WORDS } from '@/data/vocabulary'
import { useProgress } from '@/store/progress'
import { isDue } from '@/lib/srs'
import { sample } from '@/lib/random'
import { BackLink } from '@/components/common/BackLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { FlashcardDeck } from '@/components/vocabulary/FlashcardDeck'

/** Spaced-repetition review: words that are due, plus difficult ones. */
export default function VocabReview() {
  const navigate = useNavigate()
  const [snapshot] = useState(() => useProgress.getState().words)
  const words = useMemo(() => {
    const due = ALL_WORDS.filter((w) => isDue(snapshot[w.id]))
    const weak = ALL_WORDS.filter((w) => !due.includes(w) && (snapshot[w.id]?.wrong ?? 0) > 0 && (snapshot[w.id]?.box ?? 0) <= 2)
    const list = [...due, ...weak]
    if (list.length) return list.slice(0, 20)
    // Nothing due: practise some learned words.
    const learned = ALL_WORDS.filter((w) => (snapshot[w.id]?.box ?? 0) >= 1)
    return sample(learned, Math.min(10, learned.length))
  }, [snapshot])

  return (
    <div>
      <BackLink to="/vocabulary" label="Vocabulary" />
      <h1 className="mb-1 text-2xl font-extrabold sm:text-3xl">🔁 Spaced repetition</h1>
      <p className="mb-6 text-muted">Words come back just before you forget them. Be honest: Again, Good or Easy.</p>
      {words.length === 0 ? (
        <EmptyState emoji="🌱" title="No words to review yet" body="Learn some words first — start with Unit 1 or any vocabulary category." action={<ButtonLink to="/vocabulary">Choose a category</ButtonLink>} />
      ) : (
        <ActivityFlow id="vocab-review" skill="vocabulary" baseXp={20} completeTitle="Review complete!" onContinue={() => navigate('/vocabulary')} continueLabel="Back to Vocabulary">
          {(finish) => <FlashcardDeck words={words} onFinish={(a) => finish(a)} />}
        </ActivityFlow>
      )}
    </div>
  )
}
