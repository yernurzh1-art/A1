import { X } from 'lucide-react'
import { useToasts } from '@/store/toasts'
import { cn } from '@/lib/cn'

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:top-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl border p-3 pr-2 shadow-lift backdrop-blur',
            t.tone === 'achievement'
              ? 'border-amber-300/60 bg-gradient-to-r from-amber-50 to-white dark:border-amber-400/30 dark:from-amber-500/15 dark:to-surface'
              : 'border-line bg-surface/95',
          )}
        >
          <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl', t.tone === 'achievement' ? 'animate-pop bg-amber-400/20' : 'bg-surface-2')}>
            {t.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">{t.title}</div>
            {t.body && <div className="truncate text-sm text-muted">{t.body}</div>}
          </div>
          <button onClick={() => dismiss(t.id)} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
