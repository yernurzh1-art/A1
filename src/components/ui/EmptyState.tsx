import type { ReactNode } from 'react'

export function EmptyState({ emoji, title, body, action }: { emoji: string; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 grid h-20 w-20 animate-float place-items-center rounded-full bg-surface-2 text-4xl">{emoji}</div>
      <h3 className="text-lg font-extrabold">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
