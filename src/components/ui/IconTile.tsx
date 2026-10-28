import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Rounded gradient square with an icon — used for skills everywhere. */
export function IconTile({
  icon: Icon,
  gradient,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  gradient: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = { sm: 'h-9 w-9 rounded-xl', md: 'h-12 w-12 rounded-2xl', lg: 'h-16 w-16 rounded-3xl' }[size]
  const px = { sm: 17, md: 22, lg: 30 }[size]
  return (
    <div className={cn('grid shrink-0 place-items-center bg-gradient-to-br text-white shadow-soft', gradient, dims, className)}>
      <Icon size={px} strokeWidth={2.2} />
    </div>
  )
}
