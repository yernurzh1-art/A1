import { LogoMark } from '@/components/ui/Logo'

export function Certificate({ name, score, date, printable = true }: { name: string; score: number; date: number; printable?: boolean }) {
  return (
    <div className={`${printable ? 'print-area ' : ''}rounded-4xl bg-gradient-to-br from-amber-300 via-brand-400 to-fuchsia-400 p-[3px] shadow-lift`}>
      <div className="relative overflow-hidden rounded-[calc(2rem-3px)] bg-surface px-6 py-10 text-center sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand-400/20 blur-2xl" />
        <div className="flex items-center justify-center gap-2">
          <LogoMark size={30} />
          <span className="font-display text-lg font-extrabold">Stepwise</span>
        </div>
        <div className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-muted">Certificate of achievement</div>
        <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">English · Level A1</h2>
        <p className="mt-6 text-muted">This certifies that</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-brand-600 dark:text-brand-300">{name || 'Stepwise Learner'}</p>
        <p className="mx-auto mt-4 max-w-md text-muted">has successfully completed the Stepwise A1 course and passed the Final A1 Test with a score of</p>
        <p className="mt-2 text-5xl font-extrabold text-gradient">{score}%</p>
        <div className="mt-8 flex items-center justify-center gap-10 text-sm">
          <div>
            <div className="font-bold">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="text-xs text-muted">Date</div>
          </div>
          <div className="text-4xl">🏆</div>
          <div>
            <div className="font-bold">CEFR A1</div>
            <div className="text-xs text-muted">Level</div>
          </div>
        </div>
      </div>
    </div>
  )
}
