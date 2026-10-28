/** Local calendar helpers. Keys look like "2026-10-28". */

export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function yesterdayKey(date: Date = new Date()): string {
  return dayKey(addDays(date, -1))
}

/** The last `count` days, oldest first, ending today. */
export function lastDays(count: number, today: Date = new Date()): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(today, i - (count - 1)))
}

export function weekdayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'yesterday' : `${d} days ago`
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
