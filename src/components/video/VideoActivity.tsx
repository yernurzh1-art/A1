import { useState } from 'react'
import { ArrowRight, CircleCheck, Lock } from 'lucide-react'
import type { VideoLesson } from '@/types'
import { videoMinutes } from '@/data/videos'
import { ExerciseRunner, type RunnerResult } from '@/components/exercises/ExerciseRunner'
import { Button } from '@/components/ui/Button'
import { VideoPlayer } from './VideoPlayer'

export function VideoActivity({ lesson, path, onDone }: { lesson: VideoLesson; path: string; onDone: (accuracy: number, mistakes: number) => void }) {
  const [watched, setWatched] = useState(false)
  const [quiz, setQuiz] = useState(false)
  const [result, setResult] = useState<RunnerResult | null>(null)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
      <div className="space-y-4">
        {lesson.youtubeId || lesson.videoUrl ? (
          <div className="overflow-hidden rounded-3xl bg-black shadow-lift">
            {lesson.youtubeId ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="aspect-video w-full" src={lesson.videoUrl} controls onEnded={() => setWatched(true)} />
            )}
          </div>
        ) : (
          <VideoPlayer lesson={lesson} onEnded={() => setWatched(true)} />
        )}
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="chip bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300">{lesson.category}</span>
            <span className="chip bg-surface-2">Beginner • A1</span>
            <span className="chip bg-surface-2">⏱ {videoMinutes(lesson)} min</span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold">
            {lesson.emoji} {lesson.title}
          </h2>
          <p className="mt-1 text-muted">{lesson.description}</p>
          {!watched && (
            <button onClick={() => setWatched(true)} className="mt-3 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
              I’ve watched it — go to the questions
            </button>
          )}
        </div>
      </div>

      <div className="card p-4 sm:p-6 xl:sticky xl:top-24">
        {result ? (
          <div className="py-10 text-center">
            <div className="text-5xl">🎬</div>
            <h3 className="mt-3 text-2xl font-extrabold">Video lesson done!</h3>
            <p className="mt-1 text-muted">
              {result.correct} of {result.total} correct.
            </p>
            <Button className="mt-6" size="lg" onClick={() => onDone(result.accuracy, result.wrong)} iconRight={<ArrowRight size={18} />}>
              Finish
            </Button>
          </div>
        ) : quiz ? (
          <ExerciseRunner embedded exercises={lesson.quiz} skill="video" source={{ label: `Video: ${lesson.title}`, path }} onFinish={setResult} title="After watching" />
        ) : (
          <div className="py-8 text-center">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl ${watched ? 'bg-emerald-500/10' : 'bg-surface-2'}`}>{watched ? <CircleCheck className="text-emerald-500" size={30} /> : <Lock className="text-muted" size={28} />}</div>
            <h3 className="mt-4 text-xl font-extrabold">{lesson.quiz.length} questions after the video</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{watched ? 'Great! Now check what you remember and earn XP.' : 'Watch the video to the end to unlock the questions.'}</p>
            <Button className="mt-6" size="lg" disabled={!watched} onClick={() => setQuiz(true)}>
              Start the quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
