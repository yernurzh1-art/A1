import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-10">
      <EmptyState emoji="🧭" title="Page not found" body="This page doesn’t exist. Let’s get you back on track." action={<ButtonLink to="/">Go home</ButtonLink>} />
    </div>
  )
}
