import { useCallback, useEffect, useRef, useState } from 'react'
import { speak, stopSpeaking, type VoiceRole } from '@/lib/speech'

/** Speak a text and know when it is playing (for animated 🔊 buttons). */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false)
  const active = useRef(false)

  const say = useCallback((text: string, opts: { role?: VoiceRole; speed?: number } = {}) => {
    active.current = true
    setSpeaking(true)
    speak(text, {
      ...opts,
      onEnd: () => {
        active.current = false
        setSpeaking(false)
      },
    })
  }, [])

  const stop = useCallback(() => {
    active.current = false
    setSpeaking(false)
    stopSpeaking()
  }, [])

  useEffect(
    () => () => {
      if (active.current) stopSpeaking()
    },
    [],
  )

  return { say, stop, speaking }
}
