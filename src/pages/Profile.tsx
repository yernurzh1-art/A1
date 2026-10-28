import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Monitor, Moon, Pencil, RotateCcw, Sparkles, Sun, Volume2 } from 'lucide-react'
import { useProgress, displayStreak } from '@/store/progress'
import { ACHIEVEMENTS } from '@/data/achievements'
import { AVATARS } from '@/data/extras'
import { levelFromXp } from '@/lib/levels'
import { englishVoices, onVoicesChanged, speak } from '@/lib/speech'
import { wordsLearned } from '@/lib/course'
import { cn } from '@/lib/cn'
import { Segmented } from '@/components/ui/Segmented'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function Profile() {
  const s = useProgress()
  const { setSettings, setProfile } = s
  const level = levelFromXp(s.xp)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(s.profile.name)
  const [confirm, setConfirm] = useState<null | 'reset' | 'demo'>(null)
  const [voices, setVoices] = useState(() => englishVoices())

  useEffect(() => onVoicesChanged(() => setVoices(englishVoices())), [])

  const exportData = () => {
    const raw = localStorage.getItem('stepwise-progress-v1') ?? '{}'
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `stepwise-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Profile card */}
      <section className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500 sm:h-32" />
        <div className="flex flex-wrap items-end gap-4 px-5 pb-5 sm:px-8">
          <div className="-mt-12 grid h-24 w-24 place-items-center rounded-3xl border-4 border-surface bg-surface-2 text-5xl shadow-lift">{s.profile.avatar}</div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setProfile({ name: name.trim() || 'Learner' })
                  setEditing(false)
                }}
              >
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={24} aria-label="Name" className="min-w-0 flex-1 rounded-xl border-2 border-line bg-surface px-3 py-2 text-lg font-bold outline-none focus:border-brand-500" />
                <Button type="submit">Save</Button>
              </form>
            ) : (
              <h1 className="flex items-center gap-2 text-2xl font-extrabold sm:text-3xl">
                {s.profile.name || 'Learner'}
                <button onClick={() => setEditing(true)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Edit name">
                  <Pencil size={15} />
                </button>
              </h1>
            )}
            <p className="text-sm text-muted">
              Level A1 · Beginner · learning since {new Date(s.profile.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2 text-center">
            {[
              { v: s.xp, l: 'XP' },
              { v: `${displayStreak(s)}🔥`, l: 'streak' },
              { v: wordsLearned(s), l: 'words' },
              { v: `Lv ${level.level}`, l: 'level' },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl bg-surface-2 px-3 py-2">
                <div className="font-extrabold tabular-nums">{x.v}</div>
                <div className="text-[11px] font-semibold text-muted">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-line px-5 py-4 sm:px-8">
          <div className="mb-2 text-sm font-bold text-muted">Avatar</div>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => setProfile({ avatar: a })} aria-label={`Avatar ${a}`} className={cn('grid h-10 w-10 place-items-center rounded-xl text-xl transition', s.profile.avatar === a ? 'bg-brand-500/15 ring-2 ring-brand-500' : 'bg-surface-2 hover:scale-110')}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold">🏆 Achievements</h2>
            <p className="text-sm text-muted">
              {Object.keys(s.achievements).length} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
          <Link to="/leaderboard" className="text-sm font-bold text-brand-600 hover:underline dark:text-brand-300">
            Leaderboard →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a, i) => {
            const got = s.achievements[a.id]
            const p = a.progress?.(s) ?? (got ? 1 : 0)
            return (
              <div key={a.id} className={cn('card animate-fade-up p-4 text-center', !got && 'bg-surface/60')} style={{ animationDelay: `${i * 25}ms` }}>
                <div className={cn('mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl', got ? `bg-gradient-to-br shadow-lift ${a.gradient}` : 'bg-surface-2 grayscale')}>
                  <span className={got ? '' : 'opacity-40'}>{a.icon}</span>
                </div>
                <div className="mt-3 font-extrabold">{a.title}</div>
                <div className="text-xs text-muted">{a.description}</div>
                {got ? (
                  <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ {new Date(got).toLocaleDateString('en-GB')}</div>
                ) : (
                  <ProgressBar value={p} size="xs" className="mt-3" barClassName="bg-amber-400" />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Settings */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="mb-2 text-xl font-extrabold">⚙️ Settings</h2>
          <div className="divide-y divide-line">
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="font-semibold">Theme</span>
              <Segmented
                size="sm"
                value={s.settings.theme}
                onChange={(theme) => setSettings({ theme })}
                options={[
                  { value: 'light', label: 'Light', icon: <Sun size={14} /> },
                  { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                  { value: 'system', label: 'Auto', icon: <Monitor size={14} /> },
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="font-semibold">Daily goal</span>
              <Segmented size="sm" value={String(s.profile.dailyGoal)} onChange={(v) => setProfile({ dailyGoal: Number(v) })} options={['20', '45', '80', '120'].map((v) => ({ value: v, label: `${v} XP` }))} />
            </div>
            <Switch checked={s.settings.sound} onChange={(sound) => setSettings({ sound })} label="Sound effects" description="Sounds for correct and wrong answers." />
            <Switch checked={s.settings.showRussian} onChange={(showRussian) => setSettings({ showRussian })} label="Russian hints" description="Show translations and explanations in Russian." />
            <div className="space-y-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">Voice</span>
                <button onClick={() => speak('Hello! Welcome to Stepwise. Let’s learn English together.')} className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline dark:text-brand-300">
                  <Volume2 size={15} /> Test voice
                </button>
              </div>
              <select
                value={s.settings.voiceURI ?? ''}
                onChange={(e) => setSettings({ voiceURI: e.target.value || undefined })}
                aria-label="Voice"
                className="w-full rounded-xl border-2 border-line bg-surface px-3 py-2 text-sm font-semibold outline-none focus:border-brand-500"
              >
                <option value="">Automatic (best available)</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              <label className="block">
                <span className="mb-1 flex justify-between text-sm font-semibold">
                  <span>Speech speed</span>
                  <span className="text-muted">{s.settings.speechRate.toFixed(2)}×</span>
                </span>
                <input type="range" min={0.6} max={1.2} step={0.05} value={s.settings.speechRate} onChange={(e) => setSettings({ speechRate: Number(e.target.value) })} className="w-full accent-[var(--color-brand-500)]" aria-label="Speech speed" />
              </label>
            </div>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="text-xl font-extrabold">👩‍🏫 Teacher & demo mode</h2>
          <p className="mb-2 text-sm text-muted">Useful when you want to show the whole course quickly.</p>
          <div className="divide-y divide-line">
            <Switch checked={s.settings.unlockAll} onChange={(unlockAll) => setSettings({ unlockAll })} label="Unlock all lessons" description="Open every unit and step without finishing the previous ones." />
            <Switch checked={s.settings.unlimitedHearts} onChange={(unlimitedHearts) => setSettings({ unlimitedHearts })} label="Unlimited hearts" description="Mistakes don’t cost hearts." />
            <div className="flex flex-wrap gap-2 py-4">
              <Button variant="secondary" icon={<Sparkles size={16} />} onClick={() => setConfirm('demo')}>
                Fill with sample progress
              </Button>
              <Button variant="secondary" icon={<Download size={16} />} onClick={exportData}>
                Export my progress
              </Button>
              <Button variant="ghost" className="text-rose-600 dark:text-rose-400" icon={<RotateCcw size={16} />} onClick={() => setConfirm('reset')}>
                Reset progress
              </Button>
            </div>
          </div>
          <p className="rounded-2xl bg-surface-2 p-3 text-xs text-muted">Progress (XP, streak, lessons, words, mistakes, achievements) is saved in this browser with localStorage — no account needed.</p>
        </div>
      </section>

      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title="Confirm">
        <h3 className="text-xl font-extrabold">{confirm === 'reset' ? 'Reset all progress?' : 'Load sample progress?'}</h3>
        <p className="mt-2 text-muted">
          {confirm === 'reset' ? 'XP, streak, lessons, words, mistakes and achievements will be deleted. This cannot be undone.' : 'Your current progress will be replaced with a demo: 2½ units done, a 7-day streak and a week of XP — handy for showing the dashboard.'}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant={confirm === 'reset' ? 'danger' : 'primary'}
            onClick={() => {
              if (confirm === 'reset') useProgress.getState().resetProgress()
              else useProgress.getState().loadDemoProgress()
              setConfirm(null)
            }}
          >
            {confirm === 'reset' ? 'Reset' : 'Load demo'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
