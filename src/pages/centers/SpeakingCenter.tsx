import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SpeakingType } from '@/types'
import { SPEAKING_TASKS, SPEAKING_TYPES } from '@/data/speaking'
import { useProgress } from '@/store/progress'
import { SKILLS } from '@/lib/skills'
import { recognitionSupported } from '@/lib/speech'
import { CenterHeader } from '@/components/common/CenterHeader'
import { TaskCard } from '@/components/common/TaskCard'
import { Segmented } from '@/components/ui/Segmented'
import { RandomQuestion } from '@/components/home/RandomQuestion'

export default function SpeakingCenter() {
  const activities = useProgress((s) => s.activities)
  const [filter, setFilter] = useState<'all' | SpeakingType>('all')
  const tasks = SPEAKING_TASKS.filter((t) => filter === 'all' || t.type === filter)
  const done = SPEAKING_TASKS.filter((t) => activities[`speaking:${t.id}`]).length

  return (
    <div>
      <CenterHeader icon={SKILLS.speaking.icon} gradient={SKILLS.speaking.tone.gradient} title="Speaking" subtitle="Press 🎤 Speak, say it aloud and get instant feedback: what you said, your score and the words to practise." done={done} total={SPEAKING_TASKS.length} />
      {!recognitionSupported() && (
        <p className="mb-6 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          🎤 Your browser has no speech recognition. Open Stepwise in <b>Chrome</b>, <b>Edge</b> or <b>Safari</b> for voice feedback — here you can type what you say.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <Segmented
            className="mb-5"
            value={filter}
            onChange={setFilter}
            options={[{ value: 'all', label: 'All' }, ...(Object.keys(SPEAKING_TYPES) as SpeakingType[]).map((k) => ({ value: k, label: `${SPEAKING_TYPES[k].emoji} ${SPEAKING_TYPES[k].label}` }))]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {tasks.map((t, i) => {
              const rec = activities[`speaking:${t.id}`]
              return (
                <TaskCard
                  key={t.id}
                  index={i}
                  to={`/speaking/${t.id}`}
                  emoji={t.emoji}
                  title={t.title}
                  subtitle={t.description}
                  accent="bg-rose-500/10"
                  done={!!rec}
                  best={rec?.bestAccuracy}
                  chips={<span className="chip bg-surface-2">{SPEAKING_TYPES[t.type].label}</span>}
                />
              )
            })}
          </div>
        </div>
        <aside className="space-y-4">
          <RandomQuestion />
          <Link to="/pronunciation" className="card card-hover block p-5">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-rose-500">👄 Pronunciation practice</div>
            <h3 className="mt-2 text-lg font-extrabold">TH, ship / sheep, V / W…</h3>
            <p className="text-sm text-muted">Train the sounds that are hard for Russian speakers.</p>
          </Link>
        </aside>
      </div>
    </div>
  )
}
