import { create } from 'zustand';
import api, { setToken, clearToken } from '../utils/api.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user:            null,
  accessToken:     null,
  isAuthenticated: false,
  isLoading:       false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { user, accessToken } = data.data;
      setToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', payload);
      const { user, accessToken } = data.data;
      setToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    clearToken();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const { data: tokenData } = await api.post('/auth/refresh-token');
      setToken(tokenData.data.accessToken);
      set({ accessToken: tokenData.data.accessToken });
      const { data } = await api.get('/users/me');
      set({ user: data.data, isAuthenticated: true });
    } catch {
      clearToken();
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },

  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
}));
