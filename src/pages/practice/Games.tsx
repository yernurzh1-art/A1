import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_WORDS } from '@/data/vocabulary'
import { GRAMMAR_TOPICS } from '@/data/grammar'
import { useProgress } from '@/store/progress'
import { sample } from '@/lib/random'
import { normalize } from '@/lib/text'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { MatchBoard } from '@/components/games/MatchBoard'
import { BackLink } from '@/components/common/BackLink'
import { Button } from '@/components/ui/Button'
import { ListenButton } from '@/components/ui/ListenButton'
import { WordVisual } from '@/components/vocabulary/WordVisual'

/** Prefer words the learner has seen; fall back to everything. */
function gameWords(n: number) {
  const seen = useProgress.getState().words
  const known = ALL_WORDS.filter((w) => (seen[w.id]?.box ?? 0) >= 1 && !w.en.includes(' '))
  return sample(known.length >= n ? known : ALL_WORDS.filter((w) => !w.en.includes(' ')), n)
}

export function MatchGame() {
  const navigate = useNavigate()
  const words = useMemo(() => gameWords(8), [])
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink to="/practice" label="Practice" />
      <h1 className="mb-1 text-2xl font-extrabold">🃏 Word Match Sprint</h1>
      <p className="mb-6 text-muted">Tap an English word, then its translation. Be quick and careful!</p>
      <ActivityFlow id="game:match" skill="vocabulary" baseXp={15} completeTitle="Sprint finished! 🏁" onContinue={() => navigate('/practice')} continueLabel="Back to Practice">
        {(finish) => <MatchBoard words={words} onFinish={({ mistakes }) => finish(Math.max(0, 1 - mistakes / 16), { mistakes })} />}
      </ActivityFlow>
    </div>
  )
}

export function SpellingBee() {
  const navigate = useNavigate()
  const words = useMemo(() => gameWords(8), [])
  const [i, setI] = useState(0)
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const score = useRef(0)
  const sound = useProgress((s) => s.settings.sound)

  return (
    <div className="mx-auto max-w-xl">
      <BackLink to="/practice" label="Practice" />
      <h1 className="mb-1 text-2xl font-extrabold">🐝 Spelling Bee</h1>
      <p className="mb-6 text-muted">Listen and type the word. The picture helps!</p>
      <ActivityFlow id="game:spelling" skill="vocabulary" baseXp={15} completeTitle="Bee-autiful spelling! 🐝" onContinue={() => navigate('/practice')} continueLabel="Back to Practice">
        {(finish) => {
          const w = words[i]
          const check = () => {
            if (state !== 'idle') {
              if (i + 1 >= words.length) finish(score.current / words.length)
              else {
                setI(i + 1)
                setValue('')
                setState('idle')
              }
              return
            }
            const ok = normalize(value) === normalize(w.en)
            if (ok) score.current++
            setState(ok ? 'right' : 'wrong')
            if (sound) (ok ? sfx.correct : sfx.wrong)()
          }
          return (
            <div className="card p-6 text-center sm:p-8">
              <div className="mb-4 text-sm font-bold text-muted">
                Word {i + 1} of {words.length} · score {score.current}
              </div>
              <WordVisual emoji={w.emoji} size="xl" className="mx-auto" />
              <div className="mt-5 flex justify-center gap-2">
                <ListenButton key={w.id} text={w.en} label="Listen" variant="solid" size="lg" />
                <ListenButton text={w.en} slow size="lg" />
              </div>
              <form
                className="mt-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (value.trim() || state !== 'idle') check()
                }}
              >
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={state !== 'idle'}
                  autoFocus
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Type the word…"
                  aria-label="Type the word"
                  className={cn(
                    'w-full rounded-2xl border-2 bg-surface px-5 py-4 text-center text-2xl font-extrabold tracking-wide outline-none',
                    state === 'idle' && 'border-line focus:border-brand-500',
                    state === 'right' && 'border-emerald-500 text-emerald-600',
                    state === 'wrong' && 'animate-shake border-rose-500 text-rose-600',
                  )}
                />
                {state === 'wrong' && (
                  <p className="mt-3 text-rose-600 dark:text-rose-300">
                    Correct spelling: <b>{w.en}</b> — {w.ru}
                  </p>
                )}
                {state === 'right' && <p className="mt-3 font-bold text-emerald-600 dark:text-emerald-400">✅ Correct! {w.en} — {w.ru}</p>}
                <Button type="submit" size="lg" className="mt-5" block disabled={state === 'idle' && !value.trim()}>
                  {state === 'idle' ? 'Check' : i + 1 >= words.length ? 'Finish' : 'Next word'}
                </Button>
              </form>
            </div>
          )
        }}
      </ActivityFlow>
    </div>
  )
}

export function SentenceBuilder() {
  const navigate = useNavigate()
  const exercises = useMemo(() => sample(GRAMMAR_TOPICS.flatMap((t) => [...t.practice, ...t.test]).filter((e) => e.kind === 'order'), 8), [])
  return (
    <div className="mx-auto max-w-2xl">
      <ActivityFlow id="game:builder" skill="grammar" baseXp={20} completeTitle="Great sentences! 🧱" onContinue={() => navigate('/practice')} continueLabel="Back to Practice">
        {(finish) => (
          <ExerciseRunner exercises={exercises} skill="grammar" title="🧱 Sentence Builder" source={{ label: 'Sentence Builder', path: '/games/builder' }} onExit={() => navigate('/practice')} onFinish={(r) => finish(r.accuracy, { mistakes: r.wrong })} />
        )}
      </ActivityFlow>
    </div>
  )
}
