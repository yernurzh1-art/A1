import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'outline' | 'white' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-[0_4px_0_0_var(--color-brand-700)] hover:bg-brand-600 active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-brand-700)]',
  success:
    'bg-emerald-500 text-white shadow-[0_4px_0_0_#047857] hover:bg-emerald-600 active:translate-y-[3px] active:shadow-[0_1px_0_0_#047857]',
  danger:
    'bg-rose-500 text-white shadow-[0_4px_0_0_#be123c] hover:bg-rose-600 active:translate-y-[3px] active:shadow-[0_1px_0_0_#be123c]',
  secondary: 'bg-surface-2 text-ink hover:bg-surface-3 border border-line',
  outline: 'border-2 border-line bg-surface text-ink hover:border-brand-300 hover:bg-brand-50/60 dark:hover:bg-brand-500/10',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
  white: 'bg-white text-slate-900 shadow-lift hover:bg-slate-50',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-2xl',
  lg: 'h-13 px-6 text-base gap-2 rounded-2xl',
  xl: 'h-15 px-8 text-base gap-2.5 rounded-2xl tracking-wide',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  block?: boolean
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', block = false, extra?: string) =>
  cn(
    'inline-flex select-none items-center justify-center font-bold transition-all duration-150 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0',
    VARIANTS[variant],
    SIZES[size],
    block && 'w-full',
    extra,
  )

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconRight, block, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, block, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
})

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  block,
  className,
  icon,
  iconRight,
  children,
}: {
  to: string
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
  icon?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
}) {
  return (
    <Link to={to} className={buttonClass(variant, size, block, className)}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}
