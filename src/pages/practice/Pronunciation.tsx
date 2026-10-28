import { useState } from 'react'
import { Ear, Mic } from 'lucide-react'
import { PRONUNCIATION_SETS } from '@/data/extras'
import { useProgress } from '@/store/progress'
import { speak } from '@/lib/speech'
import { sfx } from '@/lib/sound'
import { compareSentence } from '@/lib/text'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { ListenButton } from '@/components/ui/ListenButton'
import { Button } from '@/components/ui/Button'
import { SpeakInput } from '@/components/speaking/SpeakInput'

export default function Pronunciation() {
  const [setId, setSetId] = useState(PRONUNCIATION_SETS[0].id)
  const set = PRONUNCIATION_SETS.find((s) => s.id === setId)!
  const showRu = useProgress((s) => s.settings.showRussian)
  const sound = useProgress((s) => s.settings.sound)
  const [quiz, setQuiz] = useState<{ pair: number; word: string; answered?: string } | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const [sayTarget, setSayTarget] = useState<string | null>(null)
  const [sayResult, setSayResult] = useState<{ said: string; ok: boolean } | null>(null)

  const newQuiz = () => {
    const pair = Math.floor(Math.random() * set.pairs.length)
    const word = set.pairs[pair][Math.round(Math.random())]
    setQuiz({ pair, word })
    speak(word)
  }

  const answer = (w: string) => {
    if (!quiz || quiz.answered) return
    const ok = w === quiz.word
    setQuiz({ ...quiz, answered: w })
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }))
    if (sound) (ok ? sfx.correct : sfx.wrong)()
    if (ok && (score.right + 1) % 5 === 0) useProgress.getState().addXp(10, 'speaking')
  }

  return (
    <div>
      <PageHeader eyebrow="Speaking" title="👄 Pronunciation Practice" subtitle="Sounds that are tricky for Russian speakers. Listen to minimal pairs, test your ears, then say the words yourself." back={{ to: '/speaking', label: 'Speaking' }} />
      <Segmented
        className="mb-6"
        value={setId}
        onChange={(v) => {
          setSetId(v)
          setQuiz(null)
          setSayTarget(null)
          setSayResult(null)
        }}
        options={PRONUNCIATION_SETS.map((s) => ({ value: s.id, label: `${s.emoji} ${s.title}` }))}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">
              {set.emoji} {set.title}
            </h2>
            <span className="font-mono text-lg text-muted">{set.sound}</span>
          </div>
          <p className="mt-2 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm">
            💡 {set.tip}
            {showRu && <span className="mt-1 block text-muted">{set.tipRu}</span>}
          </p>
          <div className="mt-5 space-y-3">
            {set.pairs.map(([a, b]) => (
              <div key={a + b} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                {[a, b].map((w, k) => (
                  <div key={w} className={cn('flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface-2 py-2 pl-4 pr-2', k === 1 && 'col-start-3')}>
                    <span className="text-lg font-extrabold">{w}</span>
                    <span className="flex">
                      <ListenButton text={w} size="sm" variant="plain" />
                      <button
                        onClick={() => {
                          setSayTarget(w)
                          setSayResult(null)
                        }}
                        className="grid h-8 w-8 place-items-center rounded-xl text-muted hover:bg-surface hover:text-rose-500"
                        aria-label={`Say ${w}`}
                      >
                        <Mic size={15} />
                      </button>
                    </span>
                  </div>
                ))}
                <span className="col-start-2 row-start-1 text-sm font-bold text-faint">vs</span>
              </div>
            ))}
          </div>
          {sayTarget && (
            <div className="mt-6 animate-fade-up rounded-3xl border border-line p-5 text-center">
              <div className="text-sm font-bold text-muted">Say this word:</div>
              <div className="my-2 text-3xl font-extrabold">{sayTarget}</div>
              <SpeakInput
                key={sayTarget}
                compact
                pickBest={(alts) => alts.find((a) => compareSentence(sayTarget, a).score === 1) ?? alts[0]}
                onResult={(said) => {
                  const ok = compareSentence(sayTarget, said).score === 1
                  setSayResult({ said, ok })
                  if (sound) (ok ? sfx.correct : sfx.wrong)()
                }}
              />
              {sayResult && (
                <p className={cn('mt-3 font-bold', sayResult.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-300')}>
                  {sayResult.ok ? `✅ Perfect! We heard “${sayResult.said}”.` : `❌ We heard “${sayResult.said}”. Listen again and try once more.`}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="card flex flex-col items-center p-6 text-center">
          <Ear className="text-rose-500" size={36} />
          <h2 className="mt-3 text-xl font-extrabold">Test your ears</h2>
          <p className="text-sm text-muted">Listen and choose the word you hear.</p>
          <div className="mt-2 text-sm font-bold">
            Score: {score.right} / {score.total}
          </div>
          {quiz ? (
            <div className="mt-6 w-full space-y-3">
              <ListenButton text={quiz.word} label="Play again" variant="solid" size="lg" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                {set.pairs[quiz.pair].map((w) => (
                  <button
                    key={w}
                    onClick={() => answer(w)}
                    className={cn(
                      'rounded-2xl border-2 px-4 py-4 text-xl font-extrabold transition',
                      !quiz.answered && 'border-line bg-surface hover:border-brand-300',
                      quiz.answered && w === quiz.word && 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
                      quiz.answered === w && w !== quiz.word && 'animate-shake border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {quiz.answered && (
                <Button block size="lg" onClick={newQuiz}>
                  Next sound
                </Button>
              )}
            </div>
          ) : (
            <Button className="mt-6" size="lg" onClick={newQuiz}>
              Start listening
            </Button>
          )}
          <p className="mt-auto pt-6 text-xs text-faint">Every 5 correct answers = +10 XP</p>
        </section>
      </div>
    </div>
  )
}
