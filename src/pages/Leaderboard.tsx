import { Crown, TrendingUp } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { LEAGUE_PLAYERS } from '@/data/extras'
import { dayKey, lastDays } from '@/lib/date'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const s = useProgress()
  const weekXp = lastDays(7).reduce((n, d) => n + (s.xpByDay[dayKey(d)] ?? 0), 0)
  const rows = [...LEAGUE_PLAYERS.map((p) => ({ ...p, me: false })), { name: s.profile.name || 'You', avatar: s.profile.avatar, xp: weekXp, country: '⭐', me: true }].sort((a, b) => b.xp - a.xp)
  const myRank = rows.findIndex((r) => r.me) + 1
  const daysLeft = 7 - new Date().getDay()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Demo league" title="👑 Weekly Leaderboard" subtitle="Earn XP this week to climb the league. Top 3 move up to the Silver league! (Other players are demo data.)" />
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold">#{myRank}</div>
          <div className="text-xs font-semibold text-muted">your rank</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold">{weekXp}</div>
          <div className="text-xs font-semibold text-muted">XP this week</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-extrabold">{daysLeft}d</div>
          <div className="text-xs font-semibold text-muted">left in league</div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line bg-gradient-to-r from-amber-400/20 to-transparent px-5 py-3 font-extrabold">
          <Crown size={18} className="text-amber-500" /> Bronze League
        </div>
        <ol>
          {rows.map((r, i) => (
            <li key={r.name + i}>
              {i === 3 && (
                <div className="flex items-center gap-2 bg-emerald-500/10 px-5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <TrendingUp size={14} /> Promotion zone above
                </div>
              )}
              <div className={cn('flex items-center gap-4 border-b border-line px-5 py-3 last:border-0', r.me && 'bg-brand-500/10')}>
                <span className="w-8 text-center text-lg font-extrabold text-muted">{MEDALS[i] ?? i + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-xl">{r.avatar}</span>
                <span className="flex-1 font-bold">
                  {r.name} {r.me && <span className="chip ml-1 bg-brand-500 text-white">You</span>}
                  <span className="ml-1">{r.country}</span>
                </span>
                <span className="font-extrabold tabular-nums">{r.xp} XP</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
