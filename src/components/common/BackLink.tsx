import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink">
      <ArrowLeft size={16} /> {label}
    </Link>
  )
}
