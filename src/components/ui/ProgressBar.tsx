import { cn } from '@/lib/cn'

export function ProgressBar({
  value,
  className,
  barClassName = 'bg-gradient-to-r from-brand-500 to-violet-500',
  size = 'md',
  label,
}: {
  value: number
  className?: string
  barClassName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  label?: string
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  const h = { xs: 'h-1.5', sm: 'h-2', md: 'h-3', lg: 'h-4' }[size]
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-full bg-surface-3', h, className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', barClassName)}
        style={{ width: `${pct}%` }}
      >
        {size !== 'xs' && size !== 'sm' && pct > 4 && (
          <div className="mx-2 mt-[3px] h-[3px] rounded-full bg-white/30" />
        )}
      </div>
    </div>
  )
}
