import { create } from 'zustand'

interface UiState {
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useUi = create<UiState>()((set) => ({
  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))
