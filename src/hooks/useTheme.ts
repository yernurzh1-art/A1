import { useEffect, useState } from 'react'
import { useProgress } from '@/store/progress'

const query = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null)

/** The theme actually shown ("system" resolved to light or dark). */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useProgress((s) => s.settings.theme)
  const [systemDark, setSystemDark] = useState(() => !!query()?.matches)
  useEffect(() => {
    const mq = query()
    if (!mq) return
    const on = () => setSystemDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  if (theme === 'system') return systemDark ? 'dark' : 'light'
  return theme
}
