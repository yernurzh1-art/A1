import { Lock } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { UNITS } from '@/data/units'
import { STEP_ORDER } from '@/types'
import { stepDone, unitComplete } from '@/lib/course'
import { FinalTest } from '@/components/final/FinalTest'
import { ButtonLink, Button } from '@/components/ui/Button'
import { Certificate } from '@/components/final/Certificate'

export default function FinalTestPage() {
  const s = useProgress()
  const last = UNITS[UNITS.length - 1]
  // Open when units 1–9 are complete and Unit 10 is done up to its quiz (or in teacher mode).
  const ready = s.settings.unlockAll || (UNITS.slice(0, -1).every((u) => unitComplete(s, u)) && STEP_ORDER.slice(0, -1).every((st) => stepDone(s, last.id, st)))

  if (!ready && !s.finalTest) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-surface-2 text-muted">
          <Lock size={40} />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold">Final A1 Test</h1>
        <p className="mt-2 text-muted">The test opens after you finish Units 1–9 and the first steps of Unit 10. Keep going — step by step! 🪜</p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <ButtonLink to="/learn">Back to the course</ButtonLink>
          <Button variant="ghost" size="sm" onClick={() => useProgress.getState().setSettings({ unlockAll: true })}>
            Teacher? Unlock everything (demo mode)
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {s.finalTest?.passed && (
        <details className="card mx-auto max-w-3xl p-5">
          <summary className="cursor-pointer font-extrabold">🏆 Your certificate · {s.finalTest.total}%</summary>
          <div className="mt-4">
            <Certificate name={s.profile.name} score={s.finalTest.total} date={s.finalTest.date} printable={false} />
          </div>
        </details>
      )}
      <FinalTest />
    </div>
  )
}
