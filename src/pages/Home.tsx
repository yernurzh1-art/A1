import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Flame, Map as MapIcon, Sparkles, Zap } from 'lucide-react'
import { useProgress, displayStreak, todayXp } from '@/store/progress'
import { UNITS, STEP_INFO } from '@/data/units'
import { SPEAKING_TASKS } from '@/data/speaking'
import { LISTENING_TASKS } from '@/data/listening'
import { READING_TASKS } from '@/data/reading'
import { WRITING_TASKS } from '@/data/writing'
import { GRAMMAR_TOPICS } from '@/data/grammar'
import { ALL_WORDS } from '@/data/vocabulary'
import { VIDEO_LESSONS } from '@/data/videos'
import { BOOK } from '@/data/book'
import { SKILLS, BOOK_META } from '@/lib/skills'
import { courseProgress, nextStep, unitProgress, unitUnlocked } from '@/lib/course'
import { DAILY_QUESTS } from '@/lib/daily'
import { dayKey, greeting } from '@/lib/date'
import { cn } from '@/lib/cn'
import { Button, ButtonLink } from '@/components/ui/Button'
import { LogoMark } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { IconTile } from '@/components/ui/IconTile'
import { SectionTitle } from '@/components/ui/PageHeader'
import { HeroIllustration } from '@/components/home/HeroIllustration'
import { WordOfTheDay } from '@/components/home/WordOfTheDay'
import { RandomQuestion } from '@/components/home/RandomQuestion'

const FLOW = [
  { label: 'Learn', emoji: '📘', text: 'Short lessons' },
  { label: 'Practice', emoji: '🎯', text: 'Interactive tasks' },
  { label: 'Test', emoji: '📝', text: 'Quizzes after units' },
  { label: 'Review', emoji: '♻️', text: 'Fix your mistakes' },
  { label: 'Progress', emoji: '📈', text: 'XP, levels, streaks' },
]

const SKILL_TILES = [
  { ...SKILLS.speaking, count: `${SPEAKING_TASKS.length} tasks` },
  { ...SKILLS.listening, count: `${LISTENING_TASKS.length} dialogues` },
  { ...SKILLS.reading, count: `${READING_TASKS.length} texts` },
  { ...SKILLS.writing, count: `${WRITING_TASKS.length} tasks` },
  { ...SKILLS.grammar, count: `${GRAMMAR_TOPICS.length} topics` },
  { ...SKILLS.vocabulary, count: `${ALL_WORDS.length} words` },
  { ...SKILLS.video, count: `${VIDEO_LESSONS.length} lessons` },
  { ...BOOK_META, key: 'book', count: `${BOOK.chapters.length} chapters`, tone: { ...BOOK_META.tone } },
]

export default function Home() {
  const navigate = useNavigate()
  const state = useProgress()
  const streak = displayStreak(state)
  const today = todayXp(state)
  const goal = state.profile.dailyGoal
  const next = nextStep(state)
  const isNew = state.xp === 0 && Object.keys(state.activities).length === 0
  const skillToday = state.skillXpByDay[dayKey()] ?? {}
  const challengeDone = state.challenges[dayKey()] !== undefined
  const progress = courseProgress(state)

  const start = () => navigate(state.profile.onboarded ? (next ? `/learn/${next.unit.id}/${next.step}` : '/final-test') : '/welcome')

  return (
    <div className="space-y-10">
      {/* HERO ------------------------------------------------------ */}
      {isNew ? (
        <section className="relative overflow-hidden rounded-4xl border border-line bg-surface px-6 py-10 shadow-soft sm:px-10 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3">
                <LogoMark size={52} />
                <div>
                  <div className="font-display text-2xl font-extrabold tracking-tight">
                    Stepwise<span className="text-brand-500">.</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">English from zero to A1</div>
                </div>
              </div>
              <h1 className="mt-8 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
                Learn English <span className="text-gradient">step by step.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted">
                From your very first “Hello!” to confident A1. Short lessons, real-life situations, speaking practice with instant feedback — and a clear path all the way.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="xl" onClick={start} iconRight={<ArrowRight size={20} />}>
                  START LEARNING
                </Button>
                <ButtonLink to="/learn" variant="outline" size="xl" icon={<MapIcon size={20} />}>
                  See the course
                </ButtonLink>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted">
                <span>📚 10 units</span>
                <span>🧩 15 grammar topics</span>
                <span>🔤 {ALL_WORDS.length} words</span>
                <span>🏆 Final A1 test</span>
              </div>
            </div>
            <HeroIllustration />
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-500 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lift sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-6 hidden text-[9rem] leading-none opacity-20 sm:block">{next?.unit.emoji ?? '🏆'}</div>
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <LogoMark size={22} /> Stepwise · Learn English step by step.
              </div>
              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                {greeting()}, {state.profile.name || 'friend'} {state.profile.avatar}
              </h1>
              {next ? (
                <>
                  <p className="mt-2 text-white/85">
                    Continue learning: <b>Unit {next.unit.number} — {next.unit.title}</b> · {STEP_INFO[next.step].label}
                  </p>
                  <div className="mt-5 max-w-md">
                    <div className="mb-1.5 flex justify-between text-sm font-semibold">
                      <span>Unit {next.unit.number} — {Math.round(unitProgress(state, next.unit) * 100)}% completed</span>
                    </div>
                    <ProgressBar value={unitProgress(state, next.unit)} className="bg-white/20" barClassName="bg-white" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="white" size="lg" onClick={start} iconRight={<ArrowRight size={18} />}>
                      CONTINUE LEARNING
                    </Button>
                    <ButtonLink to="/learn" variant="ghost" size="lg" className="text-white hover:bg-white/15 hover:text-white">
                      Course map
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-white/85">You finished every unit. Time for the Final A1 Test!</p>
                  <ButtonLink to="/final-test" variant="white" size="lg" className="mt-6">
                    Go to the Final Test
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex flex-col items-center justify-center p-5 text-center">
              <ProgressRing value={today / goal} size={88} stroke={9} color="#f59e0b">
                <div>
                  <div className="text-lg font-extrabold">{today}</div>
                  <div className="text-[10px] font-bold text-muted">/ {goal} XP</div>
                </div>
              </ProgressRing>
              <div className="mt-3 font-bold">🎯 Daily goal</div>
              <div className="text-xs text-muted">{today >= goal ? 'Reached! 🎉' : `${goal - today} XP to go`}</div>
            </div>
            <div className="card flex flex-col items-center justify-center p-5 text-center">
              <div className={cn('grid h-[88px] w-[88px] place-items-center rounded-full', streak > 0 ? 'bg-orange-500/10' : 'bg-surface-2')}>
                <Flame size={44} className={cn(streak > 0 ? 'animate-flame fill-orange-400 text-orange-500' : 'text-faint')} />
              </div>
              <div className="mt-3 font-bold">🔥 {streak} day streak</div>
              <div className="text-xs text-muted">Best: {state.streak.best} days</div>
            </div>
            <div className="card col-span-2 p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>A1 course progress</span>
                <span className="text-muted">{Math.round(progress * 100)}%</span>
              </div>
              <ProgressBar value={progress} size="sm" />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>⭐ {state.xp} XP</span>
                <span>Level A1 · Beginner</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEARN → PRACTICE → TEST → REVIEW → PROGRESS --------------- */}
      <section className="scrollbar-none -mx-4 overflow-x-auto px-4">
        <ol className="flex min-w-max items-center gap-2 sm:min-w-0 sm:justify-between">
          {FLOW.map((f, i) => (
            <li key={f.label} className="flex items-center gap-2">
              <div className="flex animate-fade-up items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <div className="text-sm font-extrabold">{f.label}</div>
                  <div className="text-xs text-muted">{f.text}</div>
                </div>
              </div>
              {i < FLOW.length - 1 && <ChevronRight size={18} className="shrink-0 text-faint" />}
            </li>
          ))}
        </ol>
      </section>

      {/* SKILLS ----------------------------------------------------- */}
      <section>
        <SectionTitle title="Choose what to practise" subtitle="Eight ways to learn — all with real A1 content." />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SKILL_TILES.map((s, i) => (
            <Link key={s.label} to={s.path} className="card card-hover group animate-fade-up p-4 sm:p-5" style={{ animationDelay: `${i * 50}ms` }}>
              <IconTile icon={s.icon} gradient={s.tone.gradient} className="transition-transform group-hover:-rotate-6 group-hover:scale-110" />
              <h3 className="mt-4 font-extrabold">{s.label}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{s.description}</p>
              <div className={cn('mt-3 text-xs font-bold', s.tone.text)}>{s.count} →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* TODAY ------------------------------------------------------ */}
      <section>
        <SectionTitle title="Today" subtitle="Your daily plan — small steps every day." />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-amber-500">🎯 Daily goal</div>
              <span className="text-sm font-bold text-muted">
                {Math.min(today, goal)} / {goal} XP
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {DAILY_QUESTS.map((q) => {
                const got = skillToday[q.skill] ?? 0
                const done = got >= q.xp
                return (
                  <li key={q.skill}>
                    <Link to={q.path} className="group flex items-center gap-3">
                      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg', done ? 'bg-emerald-500 text-white' : 'bg-surface-2')}>{done ? <Check size={18} strokeWidth={3} /> : q.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="group-hover:underline">{q.label}</span>
                          <span className={done ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}>+{q.xp} XP</span>
                        </div>
                        <ProgressBar value={got / q.xp} size="xs" className="mt-1.5" barClassName={done ? 'bg-emerald-500' : 'bg-amber-400'} />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 rounded-2xl bg-surface-2 px-4 py-2.5 text-sm">
              <b>Goal: {goal} XP</b> <span className="text-muted">· change it in your profile</span>
            </div>
          </div>

          <Link to="/challenge" className="card card-hover group relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -bottom-6 -right-4 text-8xl opacity-15 transition group-hover:scale-110">⚡</div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-fuchsia-500">Daily challenge</div>
            <h3 className="mt-3 text-xl font-extrabold">6 questions. 2 minutes.</h3>
            <p className="mt-1 text-sm text-muted">Grammar, words, reading and a dictation — new every day.</p>
            <div className="mt-5 flex items-center gap-2">
              {challengeDone ? (
                <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Check size={14} /> Done today · {state.challenges[dayKey()]}%
                </span>
              ) : (
                <span className="chip bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300">
                  <Zap size={14} /> +30 XP
                </span>
              )}
            </div>
            <div className="mt-5 font-bold text-brand-600 dark:text-brand-300">{challengeDone ? 'Play again →' : 'Start the challenge →'}</div>
          </Link>

          <WordOfTheDay />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <RandomQuestion />
          <RecommendedLesson />
        </div>
      </section>

      {/* COURSE PREVIEW --------------------------------------------- */}
      <section>
        <SectionTitle
          title="Your path to A1"
          subtitle="10 units · unlock the next one when you finish a unit."
          action={
            <Link to="/learn" className="text-sm font-bold text-brand-600 hover:underline dark:text-brand-300">
              Open map →
            </Link>
          }
        />
        <div className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
          {UNITS.map((u, i) => {
            const p = unitProgress(state, u)
            const open = unitUnlocked(state, i)
            return (
              <Link key={u.id} to={`/learn/${u.id}`} className={cn('card card-hover w-44 shrink-0 snap-start p-4', !open && 'opacity-60')}>
                <div className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl', open ? u.gradient : 'from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700')}>{open ? u.emoji : '🔒'}</div>
                <div className="mt-3 text-xs font-bold text-muted">Unit {u.number}</div>
                <div className="truncate font-extrabold">{u.title}</div>
                <ProgressBar value={p} size="xs" className="mt-3" />
                <div className="mt-1 text-xs text-muted">{open ? `${Math.round(p * 100)}% completed` : 'Locked'}</div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function RecommendedLesson() {
  const state = useProgress()
  const unresolved = state.mistakes.filter((m) => !m.resolved).length
  const next = nextStep(state)
  const rec =
    unresolved >= 5
      ? { emoji: '♻️', title: `Review ${unresolved} mistakes`, text: 'Fix your weak points and earn hearts back.', to: '/review', tag: 'Review' }
      : next
        ? { emoji: next.unit.emoji, title: `Unit ${next.unit.number}: ${STEP_INFO[next.step].label}`, text: `${next.unit.title} — ${STEP_INFO[next.step].description.toLowerCase()}.`, to: `/learn/${next.unit.id}/${next.step}`, tag: 'Next in your course' }
        : { emoji: '🏆', title: 'Final A1 Test', text: 'Show what you know and get your certificate.', to: '/final-test', tag: 'Final' }
  return (
    <Link to={rec.to} className="card card-hover group flex flex-col justify-between overflow-hidden p-5">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-500">
          <Sparkles size={14} /> Recommended lesson
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-4xl transition group-hover:scale-110">{rec.emoji}</div>
          <div>
            <div className="text-xs font-bold text-muted">{rec.tag}</div>
            <h3 className="text-lg font-extrabold">{rec.title}</h3>
            <p className="text-sm text-muted">{rec.text}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-end gap-1 font-bold text-brand-600 dark:text-brand-300">
        Start <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
