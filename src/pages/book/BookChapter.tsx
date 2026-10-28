import { useNavigate, useParams } from 'react-router-dom'
import { BOOK } from '@/data/book'
import { useProgress } from '@/store/progress'
import { BackLink } from '@/components/common/BackLink'
import { ReadingText } from '@/components/reading/ReadingText'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import NotFound from '../NotFound'

export default function BookChapter() {
  const { chapterId = '' } = useParams()
  const navigate = useNavigate()
  const index = BOOK.chapters.findIndex((c) => c.id === chapterId)
  const chapter = BOOK.chapters[index]
  if (!chapter) return <NotFound />
  const next = BOOK.chapters[index + 1]

  return (
    <div>
      <BackLink to="/book" label={BOOK.title} />
      <ActivityFlow
        key={chapter.id}
        id={`book:${chapter.id}`}
        skill="reading"
        completeTitle={next ? `Chapter ${chapter.number} complete!` : '📖 You finished the book!'}
        onContinue={() => navigate(next ? `/book/chapter/${next.id}` : '/book')}
        continueLabel={next ? `Chapter ${next.number}: ${next.title}` : 'Back to the book'}
      >
        {(finish) => (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-500">
                Chapter {chapter.number} of {BOOK.chapters.length}
              </div>
              <ReadingText title={`${chapter.emoji} ${chapter.title}`} paragraphs={chapter.paragraphs} glossary={chapter.glossary} className="font-serif" />
            </div>
            <div className="card p-4 sm:p-6">
              <ExerciseRunner
                embedded
                exercises={chapter.questions}
                skill="reading"
                source={{ label: `${BOOK.title}: chapter ${chapter.number}`, path: `/book/chapter/${chapter.id}` }}
                title="Questions"
                onFinish={(r) => {
                  useProgress.getState().markChapterRead(chapter.id, r.accuracy)
                  finish(r.accuracy, { mistakes: r.wrong })
                }}
              />
            </div>
          </div>
        )}
      </ActivityFlow>
    </div>
  )
}
