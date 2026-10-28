import type { StepKey, Unit } from '@/types'
import { getGrammarTopic } from '@/data/grammar'
import { getListening } from '@/data/listening'
import { getReading } from '@/data/reading'
import { getSpeaking } from '@/data/speaking'
import { getWriting } from '@/data/writing'
import { getVideo } from '@/data/videos'

/** Short title of what a unit step contains, e.g. "Reading: My Family". */
export function stepContentTitle(unit: Unit, step: StepKey): string {
  switch (step) {
    case 'vocabulary':
      return `${unit.words.length} new words`
    case 'grammar':
      return unit.grammar.map((g) => getGrammarTopic(g)?.title).join(' · ')
    case 'listening':
      return getListening(unit.listening)?.title ?? ''
    case 'reading':
      return getReading(unit.reading)?.title ?? ''
    case 'speaking':
      return getSpeaking(unit.speaking)?.title ?? ''
    case 'writing':
      return getWriting(unit.writing)?.title ?? ''
    case 'video':
      return getVideo(unit.video)?.title ?? ''
    case 'quiz':
      return unit.quiz.length ? `${unit.quiz.length + 4} questions` : 'Final A1 Test'
  }
}
