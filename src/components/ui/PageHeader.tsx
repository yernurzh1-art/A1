import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

export function PageHeader({
  title,
  subtitle,
  icon,
  back,
  actions,
  className,
  eyebrow,
}: {
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  back?: { to: string; label: string }
  actions?: ReactNode
  className?: string
  eyebrow?: ReactNode
}) {
  return (
    <header className={cn('mb-6 animate-fade-up sm:mb-8', className)}>
      {back && (
        <Link to={back.to} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink">
          <ArrowLeft size={16} /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {icon}
          <div className="min-w-0">
            {eyebrow && <div className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-500">{eyebrow}</div>}
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

export function SectionTitle({ title, action, subtitle }: { title: ReactNode; action?: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
