import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  modalOpen:   false,
  modalContent: null,
  toggleSidebar: ()  => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal:  (content) => set({ modalOpen: true,  modalContent: content }),
  closeModal: ()        => set({ modalOpen: false, modalContent: null }),
}));
