import { LISTENING_TASKS } from '@/data/listening'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { CenterHeader } from '@/components/common/CenterHeader'
import { TaskCard } from '@/components/common/TaskCard'

export default function ListeningCenter() {
  const activities = useProgress((s) => s.activities)
  const done = LISTENING_TASKS.filter((t) => activities[`listening:${t.id}`]).length
  return (
    <div>
      <CenterHeader
        icon={SKILLS.listening.icon}
        gradient={SKILLS.listening.tone.gradient}
        title="Listening Center"
        subtitle="Short A1 dialogues with ▶ Play, ⏸ Pause, 🔁 Replay and 🐢 Slow mode. The transcript opens only after you answer!"
        done={done}
        total={LISTENING_TASKS.length}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LISTENING_TASKS.map((t, i) => {
          const rec = activities[`listening:${t.id}`]
          return (
            <TaskCard
              key={t.id}
              index={i}
              to={`/listening/${t.id}`}
              emoji={t.emoji}
              title={t.title}
              subtitle={t.description}
              accent="bg-cyan-500/10"
              done={!!rec}
              best={rec?.bestAccuracy}
              chips={
                <>
                  <span className="chip bg-surface-2">{t.topic}</span>
                  <span className="chip bg-surface-2">{t.exercises.length} tasks</span>
                </>
              }
            />
          )
        })}
      </div>
    </div>
  )
}
