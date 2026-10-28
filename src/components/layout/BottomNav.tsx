import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { MAIN_NAV } from './nav'

/** Mobile bottom navigation: Home, Learn, Practice, Progress, Profile. */
export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl lg:hidden" aria-label="Main">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors', isActive ? 'text-brand-600 dark:text-brand-300' : 'text-muted')}
          >
            {({ isActive }) => (
              <>
                <span className={cn('grid h-8 w-12 place-items-center rounded-full transition-all', isActive && 'bg-brand-500/15')}>
                  <item.icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
