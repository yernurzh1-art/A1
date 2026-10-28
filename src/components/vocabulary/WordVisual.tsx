import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'h-10 w-10 text-2xl rounded-xl',
  md: 'h-14 w-14 text-3xl rounded-2xl',
  lg: 'h-20 w-20 text-5xl rounded-3xl',
  xl: 'h-28 w-28 text-7xl rounded-[2rem]',
}

/** Shows a word's picture: an emoji, a colour swatch (#hex) or a short label like "12". */
export function WordVisual({ emoji, size = 'md', className, plain }: { emoji: string; size?: keyof typeof SIZES; className?: string; plain?: boolean }) {
  if (emoji.startsWith('#')) {
    return (
      <span
        className={cn('inline-block shrink-0 border-4 border-white shadow-lift ring-1 ring-line dark:border-surface-3', SIZES[size], '!rounded-full', className)}
        style={{ background: emoji }}
        aria-hidden
      />
    )
  }
  const isText = /^[0-9]+$/.test(emoji)
  return (
    <span
      className={cn(
        'inline-grid shrink-0 select-none place-items-center leading-none',
        SIZES[size],
        !plain && 'bg-surface-2',
        isText && 'font-display font-extrabold text-brand-600 dark:text-brand-300',
        className,
      )}
      aria-hidden
    >
      <span className={isText ? 'text-[0.7em]' : ''}>{emoji}</span>
    </span>
  )
}
