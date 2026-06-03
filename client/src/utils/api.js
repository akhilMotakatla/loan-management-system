import axios from 'axios';
import { API_BASE_URL } from '../config/constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;

export const setToken = (token) => { accessToken = token; };
export const clearToken = () => { accessToken = null; };

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        accessToken = data.data.accessToken;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        accessToken = null;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
