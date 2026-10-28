import { BOOK } from '@/data/book'
import { cn } from '@/lib/cn'
import { Lighthouse } from './Lighthouse'

/** Illustrated cover for "The Lighthouse Key". */
export function BookCover({ className }: { className?: string }) {
  return (
    <div className={cn('relative aspect-[2/3] overflow-hidden rounded-r-2xl rounded-l-md bg-gradient-to-b from-[#0b1033] via-[#1d1b4f] to-[#3b2a63] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]', className)}>
      {/* spine shading */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
      {/* stars */}
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 45}%`, animationDelay: `${(i % 7) * 0.4}s`, opacity: 0.4 + (i % 3) * 0.2 }} />
      ))}
      <div className="absolute left-[14%] top-[34%] h-8 w-8 rounded-full bg-amber-100 shadow-[0_0_40px_10px_rgba(254,243,199,0.35)]" />
      <Lighthouse lit beam className="absolute bottom-[12%] left-1/2 h-[58%] -translate-x-1/2" />
      {/* sea */}
      <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-[#1e3a8a] to-[#0b1033]" />
      <svg className="absolute bottom-[13%] w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
        <path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6 V12 H0 Z" fill="#1e3a8a" />
      </svg>
      <div className="absolute inset-x-0 top-[6%] px-4 text-center">
        <div className="text-[0.55rem] font-bold uppercase tracking-[0.35em] text-amber-200/80">{BOOK.author}</div>
        <div className="mt-2 font-serif text-[1.35rem] font-bold uppercase leading-none tracking-wider text-amber-100 drop-shadow sm:text-2xl">
          The Lighthouse
          <br />
          Key
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[3%] text-center text-[0.55rem] font-bold uppercase tracking-[0.3em] text-white/70">{BOOK.level}</div>
    </div>
  )
}
