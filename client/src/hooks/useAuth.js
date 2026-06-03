import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.isAuthenticated) store.fetchMe();
  }, []);

  return store;
};
