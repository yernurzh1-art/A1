import { WRITING_TASKS } from '@/data/writing'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { CenterHeader } from '@/components/common/CenterHeader'
import { TaskCard } from '@/components/common/TaskCard'

export default function WritingCenter() {
  const activities = useProgress((s) => s.activities)
  const done = WRITING_TASKS.filter((t) => activities[`writing:${t.id}`]).length
  return (
    <div>
      <CenterHeader
        icon={SKILLS.writing.icon}
        gradient={SKILLS.writing.tone.gradient}
        title="Writing"
        subtitle="Write short texts with hints, a word counter and an automatic check of length, punctuation, key structures and typical A1 mistakes."
        done={done}
        total={WRITING_TASKS.length}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WRITING_TASKS.map((t, i) => {
          const rec = activities[`writing:${t.id}`]
          return (
            <TaskCard
              key={t.id}
              index={i}
              to={`/writing/${t.id}`}
              emoji={t.emoji}
              title={t.title}
              subtitle={t.prompt}
              accent="bg-orange-500/10"
              done={!!rec}
              best={rec?.bestAccuracy}
              chips={<span className="chip bg-surface-2">{t.minWords}+ words</span>}
            />
          )
        })}
      </div>
    </div>
  )
}
