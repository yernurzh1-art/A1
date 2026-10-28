import { useId } from 'react'
import { cn } from '@/lib/cn'

export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  // Unique gradient id: a shared id breaks when the first SVG is hidden (display: none).
  const id = `logo${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d5dfc" />
          <stop offset="1" stopColor="#b14bf4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id})`} />
      <rect x="13" y="36" width="10" height="15" rx="3" fill="#fff" opacity=".6" />
      <rect x="27" y="26" width="10" height="25" rx="3" fill="#fff" opacity=".82" />
      <rect x="41" y="14" width="10" height="37" rx="3" fill="#fff" />
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Stepwise<span className="text-brand-500">.</span>
        </span>
      )}
    </span>
  )
}
