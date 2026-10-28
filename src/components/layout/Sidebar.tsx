import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useProgress, todayXp } from '@/store/progress'
import { cn } from '@/lib/cn'
import { useResolvedTheme } from '@/hooks/useTheme'
import { Logo } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { MAIN_NAV, MORE_NAV, SKILL_NAV, type NavItem } from './nav'

function Item({ item, badge }: { item: NavItem; badge?: number }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-[7px] text-[15px] font-semibold transition-colors',
          isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon size={19} className={cn(isActive ? 'text-brand-500' : (item.color ?? 'text-muted group-hover:text-ink'))} />
          <span className="flex-1">{item.label}</span>
          {!!badge && <span className="rounded-full bg-rose-500 px-2 text-xs font-bold text-white">{badge}</span>}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const mistakes = useProgress((s) => s.mistakes.filter((m) => !m.resolved).length)
  const today = useProgress(todayXp)
  const goal = useProgress((s) => s.profile.dailyGoal)
  const setSettings = useProgress((s) => s.setSettings)
  const isDark = useResolvedTheme() === 'dark'

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-line bg-surface/80 backdrop-blur-xl lg:flex">
      <div className="px-5 pb-2 pt-4">
        <NavLink to="/" aria-label="Stepwise home">
          <Logo />
        </NavLink>
      </div>
      <nav className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-3 py-2">
        <div className="space-y-0.5">
          {MAIN_NAV.map((i) => (
            <Item key={i.to} item={i} />
          ))}
        </div>
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-faint">Skills</div>
          <div className="space-y-0.5">
            {SKILL_NAV.map((i) => (
              <Item key={i.to} item={i} />
            ))}
          </div>
        </div>
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-faint">More</div>
          <div className="space-y-0.5">
            {MORE_NAV.map((i) => (
              <Item key={i.to} item={i} badge={i.to === '/review' ? mistakes : undefined} />
            ))}
          </div>
        </div>
      </nav>
      <div className="space-y-2 border-t border-line p-3">
        <div className="rounded-2xl bg-surface-2 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span>🎯 Daily goal</span>
            <span className="text-muted">
              {Math.min(today, goal)}/{goal} XP
            </span>
          </div>
          <ProgressBar value={today / goal} size="xs" barClassName="bg-gradient-to-r from-amber-400 to-orange-500" label="Daily goal" />
        </div>
        <button
          onClick={() => setSettings({ theme: isDark ? 'light' : 'dark' })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink-2 hover:bg-surface-2"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  )
}
