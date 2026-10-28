import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BookOpen, Ear, Gamepad2, Layers, ClipboardCheck } from 'lucide-react'
import { getCategory, ALL_WORDS } from '@/data/vocabulary'
import { useProgress } from '@/store/progress'
import { strengthLabel } from '@/lib/srs'
import { listeningWordExercises } from '@/lib/exercises'
import { wordExercises } from '@/lib/course'
import { sample, seeded } from '@/lib/random'
import { cn } from '@/lib/cn'
import { Segmented } from '@/components/ui/Segmented'
import { ListenButton } from '@/components/ui/ListenButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { BackLink } from '@/components/common/BackLink'
import { WordVisual } from '@/components/vocabulary/WordVisual'
import { FlashcardDeck } from '@/components/vocabulary/FlashcardDeck'
import { MatchBoard } from '@/components/games/MatchBoard'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import NotFound from '../NotFound'

type Mode = 'learn' | 'flashcards' | 'match' | 'listen' | 'test'

export default function VocabularyCategory() {
  const { categoryId = '' } = useParams()
  const [params] = useSearchParams()
  const cat = getCategory(categoryId)
  const progress = useProgress((s) => s.words)
  const showRu = useProgress((s) => s.settings.showRussian)
  const [mode, setMode] = useState<Mode>('learn')
  const [round, setRound] = useState(0)
  const highlight = params.get('word')

  const listenEx = useMemo(() => (cat ? listeningWordExercises(cat.words.slice(0, 10), ALL_WORDS, seeded(`${cat.id}-${round}`)) : []), [cat, round])
  const testEx = useMemo(() => (cat ? wordExercises(cat.words, `${cat.id}-test-${round}`, 10) : []), [cat, round])
  const matchWords = useMemo(() => (cat ? sample(cat.words, 6) : []), [cat, round])

  useEffect(() => {
    if (highlight) document.getElementById(highlight)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlight])

  if (!cat) return <NotFound />
  const learned = cat.words.filter((w) => (progress[w.id]?.box ?? 0) >= 1).length
  const back = () => {
    setRound((r) => r + 1)
    setMode('learn')
  }

  return (
    <div>
      <BackLink to="/vocabulary" label="Vocabulary" />
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-500/10 text-4xl">{cat.emoji}</div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{cat.title}</h1>
          <p className="text-muted">
            {cat.titleRu} · {cat.description}
          </p>
        </div>
        <div className="w-full sm:w-56">
          <div className="mb-1 text-sm font-bold">
            {learned} / {cat.words.length} learned
          </div>
          <ProgressBar value={learned / cat.words.length} size="sm" barClassName="bg-violet-500" />
        </div>
      </header>

      <Segmented
        className="mb-6"
        value={mode}
        onChange={(m) => {
          setRound((r) => r + 1)
          setMode(m)
        }}
        options={[
          { value: 'learn', label: 'Learn', icon: <BookOpen size={16} /> },
          { value: 'flashcards', label: 'Flashcards', icon: <Layers size={16} /> },
          { value: 'match', label: 'Match', icon: <Gamepad2 size={16} /> },
          { value: 'listen', label: 'Listen', icon: <Ear size={16} /> },
          { value: 'test', label: 'Test', icon: <ClipboardCheck size={16} /> },
        ]}
      />

      {mode === 'learn' && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cat.words.map((w, i) => {
              const st = strengthLabel(progress[w.id])
              return (
                <div key={w.id} id={w.id} className={cn('card animate-fade-up p-4', highlight === w.id && 'ring-2 ring-brand-500')} style={{ animationDelay: `${i * 25}ms` }}>
                  <div className="flex items-center gap-3">
                    <WordVisual emoji={w.emoji} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-lg font-extrabold">{w.en}</span>
                        <ListenButton text={w.en} size="sm" variant="plain" />
                      </div>
                      <div className="font-mono text-xs text-muted">{w.ipa}</div>
                      <div className="text-sm font-semibold text-violet-600 dark:text-violet-300">{w.ru}</div>
                    </div>
                    <span className={cn('chip shrink-0 text-[10px]', st.tone === 'new' ? 'bg-surface-2 text-muted' : st.tone === 'strong' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-400/15 text-amber-600')}>{st.label}</span>
                  </div>
                  <div className="mt-3 flex items-start gap-1 rounded-xl bg-surface-2 px-3 py-2 text-sm">
                    <div className="flex-1">
                      <div>“{w.example}”</div>
                      {showRu && <div className="text-xs text-muted">{w.exampleRu}</div>}
                    </div>
                    <ListenButton text={w.example} size="sm" variant="plain" />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => setMode('flashcards')} icon={<Layers size={18} />}>
              Practise with flashcards
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setMode('test')} icon={<ClipboardCheck size={18} />}>
              Take the test
            </Button>
          </div>
        </>
      )}

      {mode === 'flashcards' && (
        <ActivityFlow key={`f${round}`} id={`vocab-flash:${cat.id}`} skill="vocabulary" baseXp={15} completeTitle="Deck complete!" onContinue={back} continueLabel="Back to the words">
          {(finish) => <FlashcardDeck words={cat.words} onFinish={(a) => finish(a)} />}
        </ActivityFlow>
      )}

      {mode === 'match' && (
        <ActivityFlow key={`m${round}`} id={`vocab-match:${cat.id}`} skill="vocabulary" baseXp={15} completeTitle="All pairs matched!" onContinue={back} continueLabel="Back to the words">
          {(finish) => (
            <div className="mx-auto max-w-3xl">
              <MatchBoard words={matchWords} onFinish={({ mistakes }) => finish(Math.max(0, 1 - mistakes / (matchWords.length * 2)), { mistakes })} />
            </div>
          )}
        </ActivityFlow>
      )}

      {mode === 'listen' && (
        <ActivityFlow key={`l${round}`} id={`vocab-listen:${cat.id}`} skill="vocabulary" baseXp={15} onContinue={back} continueLabel="Back to the words">
          {(finish) => (
            <div className="mx-auto max-w-2xl">
              <ExerciseRunner exercises={listenEx} skill="vocabulary" source={{ label: `Vocabulary: ${cat.title}`, path: `/vocabulary/${cat.id}` }} onExit={back} onFinish={(r) => finish(r.accuracy, { mistakes: r.wrong })} />
            </div>
          )}
        </ActivityFlow>
      )}

      {mode === 'test' && (
        <ActivityFlow key={`t${round}`} id={`vocab-test:${cat.id}`} skill="vocabulary" onContinue={back} continueLabel="Back to the words">
          {(finish) => (
            <div className="mx-auto max-w-2xl">
              <ExerciseRunner
                exercises={testEx}
                skill="vocabulary"
                source={{ label: `Vocabulary: ${cat.title}`, path: `/vocabulary/${cat.id}` }}
                onExit={back}
                onFinish={(r) => {
                  useProgress.getState().markWordsSeen(cat.words.map((w) => w.id))
                  finish(r.accuracy, { mistakes: r.wrong })
                }}
              />
            </div>
          )}
        </ActivityFlow>
      )}
    </div>
  )
}
