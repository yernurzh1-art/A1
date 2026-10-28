import { useEffect } from 'react'
import { useProgress } from '@/store/progress'
import { useResolvedTheme } from '@/hooks/useTheme'
import { setSpeechPrefs } from '@/lib/speech'
import { setSoundEnabled } from '@/lib/sound'

/** Applies settings to the page: theme class, voice, sound, heart refills. */
export function SettingsSync() {
  const resolved = useResolvedTheme()
  const settings = useProgress((s) => s.settings)
  const syncHearts = useProgress((s) => s.syncHearts)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0b0c16' : '#6d5dfc')
  }, [resolved])

  useEffect(() => {
    setSpeechPrefs({ voiceURI: settings.voiceURI, rate: settings.speechRate })
    setSoundEnabled(settings.sound)
  }, [settings.voiceURI, settings.speechRate, settings.sound])

  useEffect(() => {
    syncHearts()
    const id = window.setInterval(syncHearts, 30_000)
    return () => window.clearInterval(id)
  }, [syncHearts])

  return null
}
