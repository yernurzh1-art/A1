import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ProgressBar } from '@/components/ui/ProgressBar'

/** Colourful header used by every practice center. */
export function CenterHeader({
  icon: Icon,
  gradient,
  title,
  subtitle,
  done,
  total,
  children,
}: {
  icon: LucideIcon
  gradient: string
  title: string
  subtitle: string
  done: number
  total: number
  children?: ReactNode
}) {
  return (
    <section className={cn('relative mb-8 overflow-hidden rounded-4xl bg-gradient-to-br p-6 text-white shadow-lift sm:p-8', gradient)}>
      <Icon className="pointer-events-none absolute -right-6 -top-6 opacity-15" size={180} strokeWidth={1.5} />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Icon size={24} />
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        </div>
        <p className="mt-3 max-w-xl text-white/90">{subtitle}</p>
        <div className="mt-5 max-w-sm">
          <div className="mb-1.5 text-sm font-bold">
            {done} / {total} completed
          </div>
          <ProgressBar value={total ? done / total : 0} size="sm" className="bg-white/25" barClassName="bg-white" />
        </div>
        {children}
      </div>
    </section>
  )
}
