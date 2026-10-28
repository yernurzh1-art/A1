import { useEffect, useState } from 'react'
import { useProgress } from '@/store/progress'

const query = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null)

/** A host page (e.g. an embedding viewer) may force a theme with <html data-theme="dark|light">. */
const hostTheme = (): 'light' | 'dark' | null => {
  const t = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null
  return t === 'dark' || t === 'light' ? t : null
}

/** The theme actually shown ("system" resolved to light or dark). */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useProgress((s) => s.settings.theme)
  const [systemDark, setSystemDark] = useState(() => !!query()?.matches)
  const [host, setHost] = useState(hostTheme)
  useEffect(() => {
    const mq = query()
    if (!mq) return
    const on = () => setSystemDark(mq.matches)
    mq.addEventListener('change', on)
    const mo = new MutationObserver(() => setHost(hostTheme()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', on)
      mo.disconnect()
    }
  }, [])
  if (theme === 'system') return host ?? (systemDark ? 'dark' : 'light')
  return theme
}
