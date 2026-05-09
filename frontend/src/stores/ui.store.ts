import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  modalOpen: string | null
  toggleSidebar: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  modalOpen: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openModal: (modalId: string) => set({ modalOpen: modalId }),
  
  closeModal: () => set({ modalOpen: null }),
}))
