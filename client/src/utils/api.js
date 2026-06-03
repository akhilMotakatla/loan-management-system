import axios from 'axios';
import { API_BASE_URL } from '../config/constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;

export const setToken  = (t) => { accessToken = t; };
export const clearToken = () => { accessToken = null; };

// Attach token to every request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// On 401: try one silent refresh, then retry the original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Don't retry refresh-token calls themselves — would cause infinite loop
    const isRefreshCall = original.url?.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = data.data.accessToken;
        setToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearToken();
        // Only redirect to login if not already there
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
