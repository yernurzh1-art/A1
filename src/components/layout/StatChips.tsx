import { Link } from 'react-router-dom'
import { Flame, Heart, Star } from 'lucide-react'
import { useProgress, displayStreak, HEART_REFILL_MS, MAX_HEARTS } from '@/store/progress'
import { cn } from '@/lib/cn'

/** 🔥 streak · ⭐ XP · ❤️ hearts — always visible in the top bar. */
export function StatChips({ compact }: { compact?: boolean }) {
  const streak = useProgress(displayStreak)
  const xp = useProgress((s) => s.xp)
  const hearts = useProgress((s) => s.hearts)
  const unlimited = useProgress((s) => s.settings.unlimitedHearts)
  const nextHeartMin = hearts.count < MAX_HEARTS ? Math.max(1, Math.ceil((hearts.updatedAt + HEART_REFILL_MS - Date.now()) / 60000)) : 0

  const chip = 'flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-extrabold tabular-nums transition hover:bg-surface-2'
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Link to="/progress" className={cn(chip, streak > 0 ? 'text-orange-500' : 'text-faint')} title={`${streak} day streak`}>
        <Flame size={19} className={cn(streak > 0 && 'animate-flame fill-orange-400')} />
        {streak}
      </Link>
      <Link to="/progress" className={cn(chip, 'text-amber-500')} title={`${xp} XP`}>
        <Star size={19} className="fill-amber-400" />
        {compact && xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp}
      </Link>
      <Link
        to="/review"
        className={cn(chip, 'text-rose-500')}
        title={unlimited ? 'Unlimited hearts' : hearts.count < MAX_HEARTS ? `${hearts.count} hearts · next in ${nextHeartMin} min` : `${hearts.count} hearts`}
      >
        <Heart size={19} className="fill-rose-500" />
        {unlimited ? '∞' : hearts.count}
      </Link>
    </div>
  )
}
