import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { useUi } from '@/store/ui'
import { LogoMark } from '@/components/ui/Logo'
import { StatChips } from './StatChips'
import { NotificationsMenu } from './NotificationsMenu'

export function TopBar() {
  const setSearchOpen = useUi((s) => s.setSearchOpen)
  const avatar = useProgress((s) => s.profile.avatar)
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="Stepwise home">
          <LogoMark size={34} />
        </Link>
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden h-10 max-w-md flex-1 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 text-sm text-muted shadow-soft transition hover:border-line-strong md:flex"
        >
          <Search size={17} />
          <span className="flex-1 text-left">Search lessons, words, grammar…</span>
          <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-sans text-[11px] font-bold">Ctrl K</kbd>
        </button>
        <div className="flex-1 md:hidden" />
        <StatChips compact />
        <button onClick={() => setSearchOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 md:hidden" aria-label="Search">
          <Search size={20} />
        </button>
        <NotificationsMenu />
        <Link to="/profile" className="hidden h-10 w-10 place-items-center rounded-xl bg-surface-2 text-xl transition hover:scale-105 sm:grid" aria-label="Profile">
          {avatar}
        </Link>
      </div>
    </header>
  )
}
