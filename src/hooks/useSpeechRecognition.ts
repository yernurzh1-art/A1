import { useCallback, useEffect, useRef, useState } from 'react'
import { recognitionCtor, type SpeechRecognitionLike } from '@/lib/speech'

export interface RecognitionState {
  supported: boolean
  listening: boolean
  /** Final text (best alternative). */
  transcript: string
  /** Text while the person is still speaking. */
  interim: string
  alternatives: string[]
  error: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

const ERRORS: Record<string, string> = {
  'not-allowed': 'Microphone access is blocked. Allow the microphone in your browser settings.',
  'service-not-allowed': 'Speech recognition is not allowed in this browser.',
  'no-speech': "We didn't hear anything. Try again and speak a little louder.",
  'audio-capture': 'No microphone found.',
  network: 'Speech recognition needs an internet connection.',
}

/** Browser speech recognition (Chrome, Edge, Safari). */
export function useSpeechRecognition(lang = 'en-US'): RecognitionState {
  const Ctor = recognitionCtor()
  const rec = useRef<SpeechRecognitionLike | null>(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => () => rec.current?.abort(), [])

  const start = useCallback(() => {
    if (!Ctor) return
    rec.current?.abort()
    const r = new Ctor()
    r.lang = lang
    r.continuous = false
    r.interimResults = true
    r.maxAlternatives = 3
    setTranscript('')
    setInterim('')
    setAlternatives([])
    setError(null)
    r.onstart = () => setListening(true)
    r.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      const alts: string[] = []
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) {
          finalText += res[0].transcript
          for (let a = 0; a < res.length; a++) alts.push(res[a].transcript)
        } else interimText += res[0].transcript
      }
      if (finalText) {
        setTranscript(finalText.trim())
        setAlternatives(alts.map((a) => a.trim()))
      }
      setInterim(interimText)
    }
    r.onerror = (e) => {
      if (e.error !== 'aborted') setError(ERRORS[e.error] ?? `Speech recognition error: ${e.error}`)
      setListening(false)
    }
    r.onend = () => {
      setListening(false)
      setInterim('')
    }
    rec.current = r
    try {
      r.start()
    } catch {
      setError('Could not start the microphone. Try again.')
    }
  }, [Ctor, lang])

  const stop = useCallback(() => rec.current?.stop(), [])
  const reset = useCallback(() => {
    rec.current?.abort()
    setTranscript('')
    setInterim('')
    setAlternatives([])
    setError(null)
  }, [])

  return { supported: !!Ctor, listening, transcript, interim, alternatives, error, start, stop, reset }
}
