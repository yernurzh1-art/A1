import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { stopSpeaking } from '@/lib/speech'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { SearchDialog } from './SearchDialog'
import { FOCUS_ROUTE } from './nav'
import { Toaster } from '@/components/ui/Toaster'
import { PageSkeleton } from '@/components/ui/PageSkeleton'

export function AppShell() {
  const { pathname } = useLocation()
  const focus = FOCUS_ROUTE.test(pathname)

  // New page: scroll to top and stop any voice that is still speaking.
  useEffect(() => {
    window.scrollTo(0, 0)
    stopSpeaking()
  }, [pathname])

  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="lg:pl-[17rem]">
        <TopBar />
        <main className={cn('mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:pb-14 lg:pt-8', focus ? 'pb-6' : 'pb-28')}>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {!focus && <BottomNav />}
      <SearchDialog />
      <Toaster />
    </div>
  )
}
