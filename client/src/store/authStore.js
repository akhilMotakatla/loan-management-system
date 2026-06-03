import { create } from 'zustand';
import api, { setToken, clearToken } from '../utils/api.js';

export const useAuthStore = create((set) => ({
  user:            null,
  accessToken:     null,
  isAuthenticated: false,
  isLoading:       false,
  isInitializing:  true,   // true until fetchMe resolves — prevents premature redirects

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { user, accessToken } = data.data;
      setToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false, isInitializing: false });
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
      set({ user, accessToken, isAuthenticated: true, isLoading: false, isInitializing: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    clearToken();
    set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
  },

  // Called once on app mount to restore session from the httpOnly refresh-token cookie
  fetchMe: async () => {
    try {
      const { data: tokenData } = await api.post('/auth/refresh-token');
      const newToken = tokenData.data.accessToken;
      setToken(newToken);
      const { data } = await api.get('/users/me');
      set({ user: data.data, accessToken: newToken, isAuthenticated: true, isInitializing: false });
    } catch {
      clearToken();
      set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
    }
  },

  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
}));
