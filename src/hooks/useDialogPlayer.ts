import { useCallback, useEffect, useRef, useState } from 'react'
import type { DialogLine } from '@/types'
import { speak, stopSpeaking, type VoiceRole } from '@/lib/speech'

/**
 * Plays a dialogue line by line with two different voices.
 * Pause stops after cancelling the current line; Play resumes from that line.
 */
export function useDialogPlayer(lines: DialogLine[]) {
  const speakers = [...new Set(lines.map((l) => l.speaker))]
  const roleOf = useCallback((speaker: string): VoiceRole => (speakers.indexOf(speaker) % 2 === 0 ? 'A' : 'B'), [speakers])
  const [current, setCurrent] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [slow, setSlow] = useState(false)
  const [plays, setPlays] = useState(0)
  const token = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const stopAll = useCallback(() => {
    token.current++
    window.clearTimeout(timer.current)
    stopSpeaking()
  }, [])

  useEffect(() => stopAll, [stopAll])

  const playFrom = useCallback(
    (start: number) => {
      stopAll()
      const my = token.current
      setPlaying(true)
      const run = (i: number) => {
        if (my !== token.current) return
        if (i >= lines.length) {
          setPlaying(false)
          setCurrent(-1)
          setPlays((p) => p + 1)
          return
        }
        setCurrent(i)
        speak(lines[i].text, {
          role: roleOf(lines[i].speaker),
          speed: slow ? 0.7 : 1,
          onEnd: () => {
            if (my !== token.current) return
            timer.current = window.setTimeout(() => run(i + 1), slow ? 650 : 400)
          },
        })
      }
      run(start)
    },
    [lines, roleOf, slow, stopAll],
  )

  const play = useCallback(() => playFrom(current >= 0 ? current : 0), [playFrom, current])
  const pause = useCallback(() => {
    stopAll()
    setPlaying(false)
  }, [stopAll])
  const replay = useCallback(() => playFrom(0), [playFrom])

  return { current, playing, slow, setSlow, plays, play, pause, replay, playLine: playFrom, speakers, roleOf }
}
