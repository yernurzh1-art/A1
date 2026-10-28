import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Card used in every practice center (reading, listening, speaking…). */
export function TaskCard({
  to,
  emoji,
  title,
  subtitle,
  chips,
  done,
  best,
  accent = 'bg-surface-2',
  index,
}: {
  to: string
  emoji: string
  title: string
  subtitle?: string
  chips?: ReactNode
  done?: boolean
  best?: number
  accent?: string
  index?: number
}) {
  return (
    <Link
      to={to}
      className="card card-hover group flex animate-fade-up items-center gap-4 p-4 sm:p-5"
      style={index !== undefined ? { animationDelay: `${Math.min(index, 12) * 40}ms` } : undefined}
    >
      <div className={cn('grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl transition-transform group-hover:scale-110', accent)}>{emoji}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-extrabold">{title}</h3>
          {done && <CircleCheck size={17} className="shrink-0 text-emerald-500" />}
        </div>
        {subtitle && <p className="line-clamp-2 text-sm text-muted">{subtitle}</p>}
        {(chips || best !== undefined) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {chips}
            {best !== undefined && <span className="chip bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Best {Math.round(best * 100)}%</span>}
          </div>
        )}
      </div>
      <ChevronRight size={20} className="shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-ink" />
    </Link>
  )
}
