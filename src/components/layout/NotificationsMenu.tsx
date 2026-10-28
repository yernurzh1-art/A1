import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useProgress, todayXp } from '@/store/progress'
import { timeAgo } from '@/lib/date'
import { cn } from '@/lib/cn'

export function NotificationsMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const notifications = useProgress((s) => s.notifications)
  const markRead = useProgress((s) => s.markNotificationsRead)
  const today = useProgress(todayXp)
  const goal = useProgress((s) => s.profile.dailyGoal)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const items = [
    ...(today < goal
      ? [{ id: 'goal', icon: '🎯', title: `Daily goal: ${today} / ${goal} XP`, body: 'A short lesson is enough to reach it today!', createdAt: Date.now(), read: true, path: '/learn' }]
      : []),
    ...notifications,
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o)
          if (!open && unread) window.setTimeout(markRead, 1500)
        }}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-2 transition hover:bg-surface-2 hover:text-ink"
        aria-label={`Notifications${unread ? ` (${unread} new)` : ''}`}
        aria-expanded={open}
      >
        <Bell size={20} />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] animate-fade-up overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-extrabold">Notifications</span>
            <button onClick={markRead} className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">
              Mark all as read
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 && <li className="p-6 text-center text-sm text-muted">No notifications yet.</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => {
                    setOpen(false)
                    if (n.path) navigate(n.path)
                  }}
                  className={cn('flex w-full gap-3 px-4 py-3 text-left transition hover:bg-surface-2', !n.read && 'bg-brand-500/5')}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl">{n.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{n.title}</span>
                    <span className="block text-sm text-muted">{n.body}</span>
                    <span className="mt-0.5 block text-xs text-faint">{n.id === 'goal' ? 'today' : timeAgo(n.createdAt)}</span>
                  </span>
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
