import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CircleCheck, Eye, Lock, MapPin, Play } from 'lucide-react'
import { BOOK } from '@/data/book'
import { useProgress } from '@/store/progress'
import { pushToast } from '@/store/toasts'
import { cn } from '@/lib/cn'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ListenButton } from '@/components/ui/ListenButton'
import { InlineExercise } from '@/components/grammar/InlineExercise'
import { BookCover } from '@/components/book/BookCover'
import { TrailerPlayer } from '@/components/book/TrailerPlayer'
import { mc } from '@/data/helpers'

export default function BookTrailer() {
  const chapters = useProgress((s) => s.chapters)
  const watchedBefore = useProgress((s) => !!s.activities['book:trailer'])
  const [open, setOpen] = useState(false)
  const [watched, setWatched] = useState(watchedBefore)
  const [guess, setGuess] = useState('')
  const [showSample, setShowSample] = useState(false)

  const onFinished = useCallback(() => {
    setWatched(true)
    if (!useProgress.getState().activities['book:trailer']) {
      const { xp } = useProgress.getState().completeActivity({ id: 'book:trailer', skill: 'reading', accuracy: 1, baseXp: 10 })
      pushToast({ icon: '🎬', title: `Trailer watched! +${xp} XP`, body: 'Now answer the questions below.' })
    }
  }, [])

  const choiceQs = BOOK.afterWatching.filter((q) => q.options)
  const openQ = BOOK.afterWatching.find((q) => !q.options)!
  const read = BOOK.chapters.filter((c) => chapters[c.id] !== undefined).length
  const nextChapter = BOOK.chapters.find((c) => chapters[c.id] === undefined) ?? BOOK.chapters[0]

  return (
    <div className="space-y-10">
      {/* Cinematic hero */}
      <section className="relative overflow-hidden rounded-4xl bg-[#07091a] text-white shadow-lift">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(124,58,237,0.45),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(245,158,11,0.25),transparent_45%)]" />
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white/70" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 19) % 100}%`, animationDelay: `${(i % 8) * 0.35}s` }} />
        ))}
        <div className="relative grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[16rem_1fr] lg:grid-cols-[19rem_1fr] lg:p-14">
          <BookCover className="mx-auto w-52 -rotate-3 transition duration-500 hover:rotate-0 hover:scale-105 sm:w-60 md:w-full" />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">🎬 Book trailer</div>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{BOOK.title}</h1>
            <p className="mt-3 font-serif text-xl italic text-white/80">{BOOK.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-white/10 px-3 py-1">{BOOK.genre}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{BOOK.level}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{BOOK.chapters.length} short chapters</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{BOOK.author}</span>
            </div>
            <p className="mt-5 max-w-xl text-white/85">{BOOK.logline} {BOOK.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" variant="white" onClick={() => setOpen(true)} icon={<Play size={18} className="fill-current" />}>
                Watch Book Trailer
              </Button>
              <ButtonLink to={`/book/chapter/${nextChapter.id}`} size="lg" variant="ghost" className="border border-white/25 text-white hover:bg-white/10 hover:text-white" icon={<BookOpen size={18} />}>
                {read > 0 ? 'Continue Reading' : 'Start Reading'}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <TrailerPlayer scenes={BOOK.trailer} open={open} onClose={() => setOpen(false)} onFinished={onFinished} />

      {/* Vocabulary before watching */}
      <section>
        <h2 className="text-xl font-extrabold">📝 Vocabulary before watching</h2>
        <p className="mb-4 text-muted">Learn these words first — you will hear them in the trailer and the story.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BOOK.vocabulary.map((w, i) => (
            <div key={w.en} className="card animate-fade-up p-4 text-center" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="text-3xl">{w.emoji}</div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="font-extrabold">{w.en}</span>
                <ListenButton text={w.en.replace(/\s*\(.*\)/, '')} size="sm" variant="plain" />
              </div>
              <div className="font-mono text-xs text-muted">{w.ipa}</div>
              <div className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300">{w.ru}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & characters */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold">📖 About the story</h2>
          <p className="mt-3 leading-relaxed text-ink-2">{BOOK.description}</p>
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface-2 p-3 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0 text-rose-500" /> {BOOK.setting}
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-extrabold">🎭 Characters</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {BOOK.characters.map((c) => (
              <div key={c.name} className="card flex gap-4 p-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-3xl">{c.emoji}</div>
                <div>
                  <div className="font-extrabold">{c.name}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">{c.role}</div>
                  <p className="mt-1 text-sm text-muted">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* After watching */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">🎯 After watching</h2>
            <p className="text-muted">Answer the questions about the trailer.</p>
          </div>
          {!watched && (
            <Button variant="secondary" icon={<Play size={16} />} onClick={() => setOpen(true)}>
              Watch the trailer first
            </Button>
          )}
        </div>
        <div className={cn('grid gap-4 lg:grid-cols-2', !watched && 'opacity-70')}>
          {choiceQs.map((q, i) => (
            <InlineExercise key={q.id} number={i + 1} exercise={mc(q.id, q.question, q.options!, q.answer!)} skill="reading" source={{ label: 'Book trailer', path: '/book' }} />
          ))}
          <div className="card p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-sm font-extrabold text-muted">{choiceQs.length + 1}</span>
              <span className="font-bold text-ink-2">{openQ.question}</span>
            </div>
            <textarea value={guess} onChange={(e) => setGuess(e.target.value)} rows={3} placeholder="I think…" className="w-full rounded-2xl border-2 border-line bg-surface p-3 outline-none focus:border-brand-500" aria-label="Your prediction" />
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary" icon={<Eye size={14} />} onClick={() => setShowSample(true)} disabled={guess.trim().split(/\s+/).length < 3}>
                Compare with an example
              </Button>
            </div>
            {showSample && <p className="mt-3 animate-fade-up rounded-2xl bg-indigo-500/10 p-3 text-sm">💡 {openQ.sample} <span className="text-muted">Read the book to find out!</span></p>}
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section>
        <h2 className="text-xl font-extrabold">📚 Start reading</h2>
        <p className="mb-4 text-muted">
          {BOOK.chapters.length} short chapters with audio and questions · {read} / {BOOK.chapters.length} read
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BOOK.chapters.map((c, i) => {
            const score = chapters[c.id]
            const locked = i > 0 && chapters[BOOK.chapters[i - 1].id] === undefined && !useProgress.getState().settings.unlockAll
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.emoji}</span>
                  {score !== undefined ? <CircleCheck className="text-emerald-500" size={20} /> : locked ? <Lock className="text-faint" size={18} /> : null}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">Chapter {c.number}</div>
                <div className="font-serif text-lg font-bold">{c.title}</div>
                {score !== undefined && <div className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{Math.round(score * 100)}% correct</div>}
              </>
            )
            return locked ? (
              <div key={c.id} className="card p-5 opacity-60">
                {body}
              </div>
            ) : (
              <Link key={c.id} to={`/book/chapter/${c.id}`} className="card card-hover p-5">
                {body}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
