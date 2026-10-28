import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { GrammarTopic } from '@/types'
import { GrammarTheory } from './GrammarTheory'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { Button } from '@/components/ui/Button'
import { Segmented } from '@/components/ui/Segmented'

/** Unit grammar step: read the rule(s), then practise. */
export function GrammarLesson({ topics, path, useHearts, onDone, onExit }: { topics: GrammarTopic[]; path: string; useHearts?: boolean; onDone: (accuracy: number, mistakes: number) => void; onExit: () => void }) {
  const [tab, setTab] = useState(topics[0].id)
  const [practice, setPractice] = useState(false)
  const topic = topics.find((t) => t.id === tab) ?? topics[0]

  if (practice) {
    return (
      <ExerciseRunner
        exercises={topics.flatMap((t) => t.practice)}
        skill="grammar"
        source={{ label: `Grammar: ${topics.map((t) => t.title).join(' & ')}`, path }}
        useHearts={useHearts}
        onExit={onExit}
        onFinish={(r) => onDone(r.accuracy, r.wrong)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {topics.length > 1 && (
        <Segmented value={tab} onChange={setTab} options={topics.map((t) => ({ value: t.id, label: `${t.emoji} ${t.title}` }))} />
      )}
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-3xl">{topic.emoji}</div>
        <div>
          <h2 className="text-2xl font-extrabold">{topic.title}</h2>
          <p className="text-muted">{topic.summary}</p>
        </div>
      </div>
      <GrammarTheory topic={topic} />
      <div className="sticky bottom-0 -mx-4 border-t border-line bg-bg/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-3xl sm:border">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{topics.reduce((n, t) => n + t.practice.length, 0)} practice questions</span>
          <Button size="lg" onClick={() => setPractice(true)} iconRight={<ArrowRight size={18} />}>
            Start practice
          </Button>
        </div>
      </div>
    </div>
  )
}
