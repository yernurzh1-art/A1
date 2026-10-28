import { create } from 'zustand'
import { uid } from '@/lib/random'

export interface Toast {
  id: string
  icon: string
  title: string
  body?: string
  tone?: 'default' | 'achievement' | 'success' | 'error'
}

interface ToastState {
  toasts: Toast[]
  dismiss: (id: string) => void
}

export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function pushToast(t: Omit<Toast, 'id'>) {
  const id = uid()
  useToasts.setState((s) => ({ toasts: [...s.toasts, { ...t, id }].slice(-4) }))
  window.setTimeout(() => useToasts.getState().dismiss(id), t.tone === 'achievement' ? 5200 : 3600)
}
