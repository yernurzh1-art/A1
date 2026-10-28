import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, ClipboardCheck, Dumbbell } from 'lucide-react'
import { GRAMMAR_TOPICS, getGrammarTopic } from '@/data/grammar'
import { UNITS } from '@/data/units'
import { useProgress } from '@/store/progress'
import { pushToast } from '@/store/toasts'
import { Segmented } from '@/components/ui/Segmented'
import { Button } from '@/components/ui/Button'
import { BackLink } from '@/components/common/BackLink'
import { GrammarTheory } from '@/components/grammar/GrammarTheory'
import { InlineExercise } from '@/components/grammar/InlineExercise'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import NotFound from '../NotFound'

type Tab = 'learn' | 'practice' | 'test'

export default function GrammarTopicPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const topic = getGrammarTopic(id)
  const [tab, setTab] = useState<Tab>('learn')
  const [solved, setSolved] = useState<Record<string, boolean>>({})
  const rewarded = useRef(false)
  const solvedRef = useRef<Record<string, boolean>>({})
  const test = useProgress((s) => s.activities[`grammar-test:${id}`])

  if (!topic) return <NotFound />
  const idx = GRAMMAR_TOPICS.indexOf(topic)
  const nextTopic = GRAMMAR_TOPICS[idx + 1]
  const unit = UNITS.find((u) => u.grammar.includes(topic.id))
  const path = `/grammar/${id}`

  const onSolved = (exId: string, firstTry: boolean) => {
    const next = { ...solvedRef.current, [exId]: firstTry }
    solvedRef.current = next
    setSolved(next)
    if (Object.keys(next).length === topic.practice.length && !rewarded.current) {
      rewarded.current = true
      const acc = Object.values(next).filter(Boolean).length / topic.practice.length
      const { xp } = useProgress.getState().completeActivity({ id: `grammar-practice:${id}`, skill: 'grammar', accuracy: acc, baseXp: 15 })
      pushToast({ icon: '🧩', title: `Practice complete! +${xp} XP`, body: 'Now try the mini-test.', tone: 'success' })
    }
  }

  return (
    <div>
      <BackLink to="/grammar" label="Grammar Center" />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-blue-500/10 text-4xl">{topic.emoji}</div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-blue-500">
              Topic {idx + 1} of {GRAMMAR_TOPICS.length}
              {unit && ` · Unit ${unit.number}`}
            </div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{topic.title}</h1>
            <p className="text-muted">
              {topic.titleRu} · {topic.summary}
            </p>
          </div>
        </div>
        {test && <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Best test score: {Math.round(test.bestAccuracy * 100)}%</span>}
      </header>

      <Segmented
        className="mb-6 w-fit"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'learn', label: 'Learn', icon: <BookOpen size={16} /> },
          { value: 'practice', label: `Practice (${Object.keys(solved).length}/${topic.practice.length})`, icon: <Dumbbell size={16} /> },
          { value: 'test', label: 'Mini-test', icon: <ClipboardCheck size={16} /> },
        ]}
      />

      {tab === 'learn' && (
        <div className="mx-auto max-w-3xl">
          <GrammarTheory topic={topic} />
          <div className="mt-6 flex justify-end">
            <Button size="lg" onClick={() => setTab('practice')} iconRight={<ArrowRight size={18} />}>
              Practise now
            </Button>
          </div>
        </div>
      )}

      {tab === 'practice' && (
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-muted">Choose an answer — you’ll see right away if it is correct. Wrong? Read the hint and try again.</p>
          {topic.practice.map((ex, i) => (
            <InlineExercise key={ex.id} exercise={ex} number={i + 1} skill="grammar" source={{ label: `Grammar: ${topic.title}`, path }} onSolved={(first) => onSolved(ex.id, first)} />
          ))}
          <div className="flex justify-end">
            <Button size="lg" onClick={() => setTab('test')} iconRight={<ArrowRight size={18} />}>
              Take the mini-test
            </Button>
          </div>
        </div>
      )}

      {tab === 'test' && (
        <div className="mx-auto max-w-2xl">
          <ActivityFlow
            id={`grammar-test:${id}`}
            skill="grammar"
            completeTitle="Mini-test complete!"
            onContinue={() => (nextTopic ? navigate(`/grammar/${nextTopic.id}`) : navigate('/grammar'))}
            continueLabel={nextTopic ? `Next topic: ${nextTopic.title}` : 'Back to Grammar Center'}
          >
            {(finish) => (
              <div className="card p-4 sm:p-6">
                <ExerciseRunner embedded requeue={false} exercises={topic.test} skill="grammar" source={{ label: `Grammar test: ${topic.title}`, path }} onFinish={(r) => finish(r.accuracy, { mistakes: r.wrong })} title={`Mini-test · ${topic.test.length} questions`} />
              </div>
            )}
          </ActivityFlow>
        </div>
      )}

      {nextTopic && tab !== 'test' && (
        <Link to={`/grammar/${nextTopic.id}`} className="card card-hover mx-auto mt-8 flex max-w-3xl items-center gap-4 p-4">
          <span className="text-3xl">{nextTopic.emoji}</span>
          <span className="flex-1">
            <span className="block text-xs font-bold text-muted">Next topic</span>
            <span className="font-extrabold">{nextTopic.title}</span>
          </span>
          <ArrowRight size={18} className="text-muted" />
        </Link>
      )}
    </div>
  )
}
