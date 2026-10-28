import { Link } from 'react-router-dom'
import { Brain, RefreshCw, Sparkles } from 'lucide-react'
import { VOCAB_CATEGORIES, ALL_WORDS } from '@/data/vocabulary'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { isDue } from '@/lib/srs'
import { CenterHeader } from '@/components/common/CenterHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ButtonLink } from '@/components/ui/Button'
import { WordOfTheDay } from '@/components/home/WordOfTheDay'

export default function VocabularyCenter() {
  const words = useProgress((s) => s.words)
  const learned = ALL_WORDS.filter((w) => (words[w.id]?.box ?? 0) >= 1).length
  const mastered = ALL_WORDS.filter((w) => (words[w.id]?.box ?? 0) >= 4).length
  const due = ALL_WORDS.filter((w) => isDue(words[w.id])).length
  const weak = ALL_WORDS.filter((w) => (words[w.id]?.wrong ?? 0) > 0 && (words[w.id]?.box ?? 0) <= 2).length

  return (
    <div>
      <CenterHeader
        icon={SKILLS.vocabulary.icon}
        gradient={SKILLS.vocabulary.tone.gradient}
        title="Vocabulary Trainer"
        subtitle="15 topics, 200 words with pictures, transcription and audio. Learn, flip flashcards, play matching games — spaced repetition brings words back right before you forget them."
        done={learned}
        total={ALL_WORDS.length}
      />
      <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <Sparkles className="text-violet-500" />
            <div className="mt-3 text-3xl font-extrabold">{learned}</div>
            <div className="text-sm text-muted">words learned</div>
          </div>
          <div className="card p-5">
            <Brain className="text-emerald-500" />
            <div className="mt-3 text-3xl font-extrabold">{mastered}</div>
            <div className="text-sm text-muted">words mastered</div>
          </div>
          <div className="card flex flex-col p-5">
            <RefreshCw className="text-amber-500" />
            <div className="mt-3 text-3xl font-extrabold">{due + weak}</div>
            <div className="text-sm text-muted">to review now</div>
            <ButtonLink to="/vocabulary/review" size="sm" className="mt-3" variant={due + weak ? 'primary' : 'secondary'}>
              Review with flashcards
            </ButtonLink>
          </div>
        </div>
        <WordOfTheDay />
      </div>

      <h2 className="mb-4 text-lg font-extrabold">Categories</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {VOCAB_CATEGORIES.map((c, i) => {
          const n = c.words.filter((w) => (words[w.id]?.box ?? 0) >= 1).length
          return (
            <Link key={c.id} to={`/vocabulary/${c.id}`} className="card card-hover group animate-fade-up p-4" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="text-4xl transition group-hover:scale-110">{c.emoji}</div>
              <h3 className="mt-3 font-extrabold">{c.title}</h3>
              <div className="text-xs text-muted">{c.titleRu}</div>
              <ProgressBar value={n / c.words.length} size="xs" className="mt-3" barClassName="bg-violet-500" />
              <div className="mt-1 text-xs font-semibold text-muted">
                {n} / {c.words.length} learned
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
