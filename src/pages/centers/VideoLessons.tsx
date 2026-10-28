import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, Play } from 'lucide-react'
import type { VideoCategory } from '@/types'
import { VIDEO_CATEGORIES, VIDEO_LESSONS, videoMinutes } from '@/data/videos'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { cn } from '@/lib/cn'
import { CenterHeader } from '@/components/common/CenterHeader'
import { Segmented } from '@/components/ui/Segmented'

export default function VideoLessons() {
  const activities = useProgress((s) => s.activities)
  const [cat, setCat] = useState<'All' | VideoCategory>('All')
  const list = VIDEO_LESSONS.filter((v) => cat === 'All' || v.category === cat)
  const done = VIDEO_LESSONS.filter((v) => activities[`video:${v.id}`]).length

  return (
    <div>
      <CenterHeader
        icon={SKILLS.video.icon}
        gradient={SKILLS.video.tone.gradient}
        title="Video Lessons"
        subtitle="Short animated lessons with narration and captions. Watch to the end, answer 3–4 questions and earn XP."
        done={done}
        total={VIDEO_LESSONS.length}
      />
      <Segmented className="mb-6" value={cat} onChange={setCat} options={(['All', ...VIDEO_CATEGORIES] as const).map((c) => ({ value: c, label: c }))} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v, i) => {
          const rec = activities[`video:${v.id}`]
          return (
            <Link key={v.id} to={`/videos/${v.id}`} className="card card-hover group animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
              <div className={cn('relative grid aspect-video place-items-center bg-gradient-to-br', v.gradient)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                <span className="text-6xl drop-shadow-lg transition duration-300 group-hover:scale-110">{v.emoji}</span>
                <span className="absolute grid h-14 w-14 place-items-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-lift transition duration-300 group-hover:opacity-100">
                  <Play size={24} className="ml-1 fill-current" />
                </span>
                <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-0.5 text-xs font-bold text-white">⏱ {videoMinutes(v)} min</span>
                {rec && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                    <CircleCheck size={12} /> Watched
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-fuchsia-600 dark:text-fuchsia-300">{v.category}</span>
                  <span className="text-faint">·</span>
                  <span className="text-muted">Beginner • A1</span>
                </div>
                <h3 className="mt-1 text-lg font-extrabold">▶ {v.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{v.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
