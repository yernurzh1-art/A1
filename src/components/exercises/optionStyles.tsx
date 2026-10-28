import { cn } from '@/lib/cn'

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed'

export function optionClass(state: OptionState, extra?: string) {
  return cn(
    'group relative flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition-all duration-150',
    state === 'idle' &&
      'border-line bg-surface shadow-[0_3px_0_0_var(--line)] hover:-translate-y-px hover:border-brand-300 hover:bg-brand-50/50 active:translate-y-[2px] active:shadow-none dark:hover:bg-brand-500/10',
    state === 'selected' && 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_3px_0_0_var(--color-brand-300)] dark:bg-brand-500/15 dark:text-brand-200 dark:shadow-[0_3px_0_0_var(--color-brand-700)]',
    state === 'correct' && 'animate-pop border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    state === 'wrong' && 'animate-shake border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    state === 'dimmed' && 'border-line bg-surface opacity-50',
    extra,
  )
}

export function KeyHint({ n, state }: { n: number | string; state: OptionState }) {
  return (
    <span
      className={cn(
        'hidden h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold sm:grid',
        state === 'idle' || state === 'dimmed' ? 'border-line text-faint' : 'border-current',
      )}
    >
      {n}
    </span>
  )
}
