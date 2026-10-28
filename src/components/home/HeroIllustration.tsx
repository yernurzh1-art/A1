import { Check, Mic } from 'lucide-react'

/** Decorative hero: steps up to A1 with floating lesson cards. */
export function HeroIllustration() {
  const steps = [28, 44, 60, 76, 92]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem] select-none" aria-hidden>
      <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-brand-400/40 via-fuchsia-400/30 to-amber-300/30 blur-3xl" />
      <div className="absolute inset-[14%] rounded-full border border-dashed border-brand-300/60 dark:border-brand-400/30" />

      {/* Steps */}
      <div className="absolute inset-x-[16%] bottom-[14%] flex items-end gap-[4%]">
        {steps.map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-fade-up rounded-2xl bg-gradient-to-t from-brand-600 to-brand-400 shadow-glow"
            style={{ height: `${h * 2.2}px`, animationDelay: `${200 + i * 120}ms`, opacity: 0.55 + i * 0.1 }}
          />
        ))}
      </div>
      <div className="absolute bottom-[56%] right-[14%] animate-pop [animation-delay:900ms]">
        <div className="flex flex-col items-center">
          <div className="rounded-xl bg-amber-400 px-3 py-1 font-display text-lg font-extrabold text-amber-950 shadow-lift">A1 🏆</div>
          <div className="h-10 w-1 rounded-full bg-amber-500/70" />
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute left-0 top-[10%] animate-float rounded-2xl border border-line bg-surface px-4 py-3 shadow-lift">
        <div className="text-xs font-bold text-muted">AI partner</div>
        <div className="font-bold">Hello! What’s your name? 👋</div>
      </div>
      <div className="absolute right-0 top-[24%] animate-float rounded-2xl border border-line bg-surface p-3 shadow-lift [animation-delay:1.2s]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍎</span>
          <div>
            <div className="font-extrabold">apple</div>
            <div className="font-mono text-xs text-muted">/ˈæpl/</div>
          </div>
        </div>
      </div>
      <div className="absolute left-[4%] top-[44%] animate-float [animation-delay:2s]">
        <div className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lift">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/30" />
          <Mic size={24} />
        </div>
      </div>
      <div className="absolute bottom-[4%] left-[6%] animate-float rounded-full bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white shadow-lift [animation-delay:0.6s]">
        <Check size={16} className="mr-1 inline" strokeWidth={3} /> Correct!
      </div>
      <div className="absolute bottom-[8%] right-[2%] animate-float rounded-full border border-line bg-surface px-4 py-2 text-sm font-extrabold shadow-lift [animation-delay:1.6s]">
        <span className="text-amber-500">⭐ +50 XP</span>
        <span className="mx-2 text-faint">·</span>
        <span className="text-orange-500">🔥 7</span>
      </div>
    </div>
  )
}
