import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode; icon?: ReactNode }[]
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className={cn('scrollbar-none flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface-2 p-1', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-all',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            value === o.value ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
