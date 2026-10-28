import { Link } from 'react-router-dom'
import { Award, BookCheck, Ear, Flame, GraduationCap, Languages, Mic, Star } from 'lucide-react'
import type { Skill } from '@/types'
import { useProgress, displayStreak } from '@/store/progress'
import { UNITS } from '@/data/units'
import { ACHIEVEMENTS } from '@/data/achievements'
import { FINAL_SECTIONS } from '@/data/finalTest'
import { courseProgress, unitProgress, unitsCompleted, wordsLearned } from '@/lib/course'
import { levelFromXp } from '@/lib/levels'
import { dayKey, lastDays, weekdayShort } from '@/lib/date'
import { SKILLS } from '@/lib/skills'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { WeeklyChart } from '@/components/charts/WeeklyChart'

export default function ProgressPage() {
  const s = useProgress()
  const level = levelFromXp(s.xp)
  const streak = displayStreak(s)
  const days = lastDays(7)
  const week = days.map((d, i) => ({
    label: weekdayShort(d),
    full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
    value: s.xpByDay[dayKey(d)] ?? 0,
    isToday: i === days.length - 1,
  }))
  const weekTotal = week.reduce((n, d) => n + d.value, 0)
  const activeDays = week.filter((d) => d.value > 0).length

  const skillTotals = (Object.keys(SKILLS) as Skill[]).map((k) => ({
    key: k,
    xp: Object.values(s.skillXpByDay).reduce((n, day) => n + (day[k] ?? 0), 0),
  }))
  const maxSkill = Math.max(1, ...skillTotals.map((t) => t.xp))
  const unlocked = Object.keys(s.achievements).length

  const tiles = [
    { label: 'Course progress', value: `${Math.round(courseProgress(s) * 100)}%`, icon: GraduationCap, tone: 'text-brand-500' },
    { label: 'Lessons completed', value: s.stats.lessonsCompleted, icon: BookCheck, tone: 'text-emerald-500' },
    { label: 'Words learned', value: wordsLearned(s), icon: Languages, tone: 'text-violet-500' },
    { label: 'Total XP', value: s.xp, icon: Star, tone: 'text-amber-500' },
    { label: 'Day streak', value: `${streak} 🔥`, icon: Flame, tone: 'text-orange-500', sub: `best ${s.streak.best}` },
    { label: 'Speaking practice', value: s.stats.speakingAttempts, icon: Mic, tone: 'text-rose-500', sub: 'tasks done' },
    { label: 'Listening practice', value: s.stats.listeningSessions, icon: Ear, tone: 'text-cyan-500', sub: 'dialogues' },
    { label: 'Achievements', value: `${unlocked}/${ACHIEVEMENTS.length}`, icon: Award, tone: 'text-yellow-500' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Dashboard" title="Your progress" subtitle="Everything you have done so far — saved on this device." />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-500 to-fuchsia-600 p-6 text-white shadow-lift sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-6">
            <ProgressRing value={level.progress} size={112} stroke={10} color="#ffffff" track="rgba(255,255,255,0.25)">
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Level</div>
                <div className="text-4xl font-extrabold">{level.level}</div>
              </div>
            </ProgressRing>
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">Current level</div>
              <div className="text-2xl font-extrabold sm:text-3xl">A1 · Beginner</div>
              <div className="mt-1 text-white/85">
                ⭐ {s.xp} XP · {level.next ? `${level.toNext} XP to level ${level.level + 1}` : 'max level!'}
              </div>
              <div className="mt-3 text-sm text-white/85">
                {unitsCompleted(s)} of {UNITS.length} units completed
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {tiles.slice(0, 4).map((t) => (
            <div key={t.label} className="card p-4">
              <t.icon className={t.tone} size={20} />
              <div className="mt-2 text-2xl font-extrabold tabular-nums">{t.value}</div>
              <div className="text-xs font-semibold text-muted">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.slice(4).map((t) => (
          <div key={t.label} className="card p-4">
            <t.icon className={t.tone} size={20} />
            <div className="mt-2 text-2xl font-extrabold tabular-nums">{t.value}</div>
            <div className="text-xs font-semibold text-muted">
              {t.label}
              {t.sub && <span className="text-faint"> · {t.sub}</span>}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card min-w-0 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold">XP this week</h2>
              <p className="text-sm text-muted">
                {weekTotal} XP · active {activeDays} of 7 days
              </p>
            </div>
          </div>
          <WeeklyChart data={week} goal={s.profile.dailyGoal} />
        </div>
        <div className="card min-w-0 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">XP by skill</h2>
          <p className="mb-4 text-sm text-muted">All time</p>
          <ul className="viz-root space-y-3">
            {skillTotals.map((t) => {
              const S = SKILLS[t.key]
              return (
                <li key={t.key} className="grid grid-cols-[7rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <S.icon size={16} className="text-muted" /> {S.label}
                  </span>
                  <span className="h-3 overflow-hidden rounded-full bg-surface-2">
                    <span className="block h-full rounded-r-[4px] transition-[width] duration-700" style={{ width: `${(t.xp / maxSkill) * 100}%`, background: 'var(--viz-bar)' }} />
                  </span>
                  <span className="text-right font-bold tabular-nums">{t.xp}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold">Units</h2>
          <ul className="space-y-3">
            {UNITS.map((u) => {
              const p = unitProgress(s, u)
              return (
                <li key={u.id}>
                  <Link to={`/learn/${u.id}`} className="grid grid-cols-[2rem_1fr_3rem] items-center gap-3 rounded-xl p-1 transition hover:bg-surface-2">
                    <span className="text-xl">{u.emoji}</span>
                    <span>
                      <span className="mb-1 block text-sm font-bold">
                        Unit {u.number} — {u.title}
                      </span>
                      <ProgressBar value={p} size="xs" barClassName={p >= 1 ? 'bg-emerald-500' : 'bg-brand-500'} />
                    </span>
                    <span className="text-right text-sm font-bold tabular-nums text-muted">{Math.round(p * 100)}%</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-extrabold">Final A1 Test</h2>
            {s.finalTest ? (
              <>
                <div className="mt-2 text-4xl font-extrabold">{s.finalTest.total}%</div>
                <div className="text-sm font-semibold text-muted">{s.finalTest.passed ? '🎉 A1 Level Completed!' : 'Not passed yet — try again!'}</div>
                <ul className="mt-4 space-y-2 text-sm">
                  {FINAL_SECTIONS.map((sec) => (
                    <li key={sec.key} className="flex justify-between">
                      <span>
                        {sec.emoji} {sec.label}
                      </span>
                      <b className="tabular-nums">{s.finalTest!.scores[sec.key]}%</b>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">Finish the course and take the Final Test to see your A1 score here.</p>
            )}
            <Link to="/final-test" className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline dark:text-brand-300">
              Go to the Final Test →
            </Link>
          </div>
          <Link to="/profile" className="card card-hover block p-5 sm:p-6">
            <h2 className="text-lg font-extrabold">Achievements</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((a) => (
                <span key={a.id} title={a.title} className={`grid h-11 w-11 place-items-center rounded-2xl text-xl ${s.achievements[a.id] ? `bg-gradient-to-br ${a.gradient}` : 'bg-surface-2 opacity-40 grayscale'}`}>
                  {a.icon}
                </span>
              ))}
            </div>
            <div className="mt-3 text-sm font-bold text-brand-600 dark:text-brand-300">See all →</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
