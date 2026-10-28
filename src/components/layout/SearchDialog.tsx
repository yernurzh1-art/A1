import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Search, X } from 'lucide-react'
import { useUi } from '@/store/ui'
import { search, type SearchItem } from '@/lib/search'
import { cn } from '@/lib/cn'

const SUGGESTIONS = ['present simple', 'family', 'café', 'there is', 'numbers', 'past simple', 'яблоко']

export function SearchDialog() {
  const navigate = useNavigate()
  const { searchOpen, setSearchOpen } = useUi()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const results = useMemo(() => search(q), [q])

  // Ctrl/Cmd + K opens search anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  useEffect(() => {
    if (searchOpen) {
      setQ('')
      setActive(0)
      window.setTimeout(() => input.current?.focus(), 30)
    }
  }, [searchOpen])

  useEffect(() => setActive(0), [q])

  if (!searchOpen) return null

  const go = (it: SearchItem) => {
    setSearchOpen(false)
    navigate(it.path)
  }

  // group results while keeping order
  const groups: { name: string; items: { it: SearchItem; i: number }[] }[] = []
  results.forEach((it, i) => {
    let g = groups.find((x) => x.name === it.group)
    if (!g) groups.push((g = { name: it.group, items: [] }))
    g.items.push({ it, i })
  })

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-3 pt-[8vh] sm:p-6 sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-xl animate-fade-up overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={20} className="text-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchOpen(false)
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(results.length - 1, a + 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              }
              if (e.key === 'Enter' && results[active]) go(results[active])
            }}
            placeholder="Search lessons, words (EN / RU), grammar…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-faint"
            aria-label="Search"
          />
          <button onClick={() => setSearchOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q && (
            <div className="p-3">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-faint">Try</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="chip bg-surface-2 text-ink-2 hover:bg-surface-3">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {q && results.length === 0 && <p className="p-6 text-center text-sm text-muted">Nothing found for “{q}”.</p>}
          {groups.map((g) => (
            <div key={g.name} className="mb-1">
              <div className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-faint">{g.name}</div>
              {g.items.map(({ it, i }) => (
                <button
                  key={`${it.path}-${i}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it)}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left', active === i ? 'bg-brand-500/10' : 'hover:bg-surface-2')}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-lg">{it.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{it.title}</span>
                    <span className="block truncate text-xs text-muted">{it.subtitle}</span>
                  </span>
                  {active === i && <CornerDownLeft size={15} className="text-muted" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
