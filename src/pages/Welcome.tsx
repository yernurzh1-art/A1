import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { AVATARS } from '@/data/extras'
import { UNITS } from '@/data/units'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { LogoMark } from '@/components/ui/Logo'

const GOALS = [
  { xp: 20, label: 'Casual', time: '5 min / day', emoji: '🌱' },
  { xp: 45, label: 'Regular', time: '10 min / day', emoji: '🚶' },
  { xp: 80, label: 'Serious', time: '20 min / day', emoji: '🏃' },
  { xp: 120, label: 'Intense', time: '30 min / day', emoji: '🚀' },
]

/** Three quick onboarding steps before the first lesson. */
export default function Welcome() {
  const navigate = useNavigate()
  const profile = useProgress((s) => s.profile)
  const setProfile = useProgress((s) => s.setProfile)
  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.name)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [goal, setGoal] = useState(profile.dailyGoal)

  const finish = () => {
    setProfile({ name: name.trim() || 'Learner', avatar, dailyGoal: goal, onboarded: true })
    navigate('/learn/u1/vocabulary')
  }

  return (
    <div className="mx-auto flex min-h-[75dvh] max-w-xl flex-col justify-center py-6">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('h-2 rounded-full transition-all duration-500', i === step ? 'w-10 bg-brand-500' : i < step ? 'w-6 bg-brand-300' : 'w-6 bg-surface-3')} />
        ))}
      </div>

      <div key={step} className="card animate-fade-up p-6 sm:p-10">
        {step === 0 && (
          <>
            <LogoMark size={56} className="mx-auto" />
            <h1 className="mt-5 text-center text-3xl font-extrabold">Welcome to Stepwise!</h1>
            <p className="mt-2 text-center text-muted">Let’s set up your learning. What’s your name?</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              maxLength={24}
              aria-label="Your name"
              onKeyDown={(e) => e.key === 'Enter' && setStep(1)}
              className="mt-6 w-full rounded-2xl border-2 border-line bg-surface px-5 py-4 text-center text-xl font-bold outline-none focus:border-brand-500"
            />
            <p className="mb-3 mt-6 text-center text-sm font-bold text-muted">Choose your avatar</p>
            <div className="grid grid-cols-8 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  aria-label={`Avatar ${a}`}
                  className={cn('grid aspect-square place-items-center rounded-2xl text-2xl transition', avatar === a ? 'scale-110 bg-brand-500/15 ring-2 ring-brand-500' : 'bg-surface-2 hover:scale-105')}
                >
                  {a}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-center text-5xl">🎯</div>
            <h1 className="mt-4 text-center text-3xl font-extrabold">Choose a daily goal</h1>
            <p className="mt-2 text-center text-muted">Small steps every day work best. You can change it later.</p>
            <div className="mt-6 grid gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.xp}
                  onClick={() => setGoal(g.xp)}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition',
                    goal === g.xp ? 'border-brand-500 bg-brand-500/10' : 'border-line hover:border-brand-300',
                  )}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-extrabold">{g.label}</span>
                    <span className="text-sm text-muted">{g.time}</span>
                  </span>
                  <span className="font-extrabold text-amber-500">{g.xp} XP</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center text-5xl">{avatar}</div>
            <h1 className="mt-4 text-center text-3xl font-extrabold">You’re ready, {name.trim() || 'friend'}!</h1>
            <p className="mt-2 text-center text-muted">You start from zero. Here is your path to level A1:</p>
            <ol className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {UNITS.map((u) => (
                <li key={u.id} className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
                  <span>{u.emoji}</span>
                  <span className="truncate font-semibold">
                    {u.number}. {u.title}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-center text-sm text-muted">Each unit: Vocabulary → Grammar → Listening → Reading → Speaking → Writing → Video → Quiz.</p>
          </>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)} icon={<ArrowLeft size={18} />}>
              Back
            </Button>
          )}
          <Button size="lg" block onClick={() => (step < 2 ? setStep(step + 1) : finish())} iconRight={<ArrowRight size={18} />}>
            {step < 2 ? 'Continue' : 'Start Unit 1'}
          </Button>
        </div>
      </div>
    </div>
  )
}
