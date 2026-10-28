import { Link, useNavigate, useParams } from 'react-router-dom'
import { VIDEO_LESSONS, getVideo } from '@/data/videos'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { VideoActivity } from '@/components/video/VideoActivity'
import { BackLink } from '@/components/common/BackLink'
import NotFound from '../NotFound'

export default function VideoLessonPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const lesson = getVideo(id)
  if (!lesson) return <NotFound />
  const more = VIDEO_LESSONS.filter((v) => v.id !== id && v.category === lesson.category).slice(0, 3)
  return (
    <div>
      <BackLink to="/videos" label="Video Lessons" />
      <ActivityFlow key={id} id={`video:${id}`} skill="video" onContinue={() => navigate('/videos')} continueLabel="More videos">
        {(finish) => <VideoActivity lesson={lesson} path={`/videos/${id}`} onDone={(a, m) => finish(a, { mistakes: m })} />}
      </ActivityFlow>
      {more.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-extrabold">More {lesson.category} lessons</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {more.map((v) => (
              <Link key={v.id} to={`/videos/${v.id}`} className="card card-hover flex items-center gap-3 p-3">
                <span className={`grid h-12 w-16 place-items-center rounded-xl bg-gradient-to-br text-2xl ${v.gradient}`}>{v.emoji}</span>
                <span className="text-sm font-bold">{v.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
