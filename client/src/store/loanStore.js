import { create } from 'zustand';
import api from '../utils/api.js';

export const useLoanStore = create((set) => ({
  applications: [],
  activeLoans:  [],
  isLoading:    false,

  fetchApplications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/applications');
      set({ applications: data.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  fetchLoans: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/loans');
      set({ activeLoans: data.data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  addApplication: (app) => set((s) => ({ applications: [app, ...s.applications] })),
}));
