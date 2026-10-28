import { useCallback, useEffect, useRef, useState } from 'react'

/** Records the microphone so the learner can listen to themselves. */
export function useRecorder() {
  const [url, setUrl] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const media = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const supported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

  const cleanup = () => {
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
  }

  useEffect(
    () => () => {
      cleanup()
    },
    [],
  )
  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url])

  const start = useCallback(async () => {
    if (!supported) return
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.current = s
      const rec = new MediaRecorder(s)
      const chunks: BlobPart[] = []
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      rec.onstop = () => {
        setUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })))
        setRecording(false)
        cleanup()
      }
      media.current = rec
      rec.start()
      setRecording(true)
    } catch {
      setRecording(false)
    }
  }, [supported])

  const stop = useCallback(() => {
    if (media.current?.state === 'recording') media.current.stop()
    else cleanup()
  }, [])

  const reset = useCallback(() => setUrl(null), [])

  return { supported, recording, url, start, stop, reset }
}
