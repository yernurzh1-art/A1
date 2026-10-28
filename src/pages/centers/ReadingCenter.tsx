import { Clock } from 'lucide-react'
import { READING_TASKS } from '@/data/reading'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { CenterHeader } from '@/components/common/CenterHeader'
import { TaskCard } from '@/components/common/TaskCard'

export default function ReadingCenter() {
  const activities = useProgress((s) => s.activities)
  const done = READING_TASKS.filter((t) => activities[`reading:${t.id}`]).length
  return (
    <div>
      <CenterHeader
        icon={SKILLS.reading.icon}
        gradient={SKILLS.reading.tone.gradient}
        title="Reading"
        subtitle="Short A1 texts. 🔊 Listen to the text, tap underlined words for a translation, then do True/False, matching and ordering tasks."
        done={done}
        total={READING_TASKS.length}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {READING_TASKS.map((t, i) => {
          const rec = activities[`reading:${t.id}`]
          return (
            <TaskCard
              key={t.id}
              index={i}
              to={`/reading/${t.id}`}
              emoji={t.emoji}
              title={t.title}
              subtitle={t.intro}
              accent="bg-emerald-500/10"
              done={!!rec}
              best={rec?.bestAccuracy}
              chips={
                <>
                  <span className="chip bg-surface-2">{t.topic}</span>
                  <span className="chip bg-surface-2">
                    <Clock size={12} /> {t.minutes} min
                  </span>
                </>
              }
            />
          )
        })}
      </div>
    </div>
  )
}
