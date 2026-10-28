import { Volume2, Turtle } from 'lucide-react'
import { useSpeak } from '@/hooks/useSpeak'
import { cn } from '@/lib/cn'

/** 🔊 button that reads a text aloud. */
export function ListenButton({
  text,
  label,
  size = 'md',
  className,
  slow,
  variant = 'soft',
}: {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  slow?: boolean
  variant?: 'soft' | 'solid' | 'plain'
}) {
  const { say, stop, speaking } = useSpeak()
  const dims = { sm: 'h-8 min-w-8 text-xs', md: 'h-10 min-w-10 text-sm', lg: 'h-14 min-w-14 text-base' }[size]
  const icon = { sm: 15, md: 18, lg: 24 }[size]
  const Icon = slow ? Turtle : Volume2
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (speaking) stop()
        else say(text, { speed: slow ? 0.65 : 1 })
      }}
      aria-label={label ?? (slow ? `Listen slowly: ${text}` : `Listen: ${text}`)}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95',
        dims,
        label ? 'px-3.5' : '',
        variant === 'soft' && 'bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 dark:text-brand-300',
        variant === 'solid' && 'bg-brand-500 text-white shadow-glow hover:bg-brand-600',
        variant === 'plain' && 'text-muted hover:bg-surface-2 hover:text-brand-600',
        speaking && 'ring-4 ring-brand-500/20',
        className,
      )}
    >
      {speaking ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="w-[3px] origin-bottom animate-wave rounded-full bg-current" style={{ height: '100%', animationDelay: `${i * 0.12}s` }} />
          ))}
        </span>
      ) : (
        <Icon size={icon} />
      )}
      {label && <span>{label}</span>}
    </button>
  )
}
