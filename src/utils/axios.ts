import axios from 'axios';
import { useAuthStore } from '@/hooks/auth';
import { useAdminAuthStore } from '@/hooks/adminAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const session = useAuthStore.getState().session;
    const adminSession = useAdminAuthStore.getState().session;

    // Admin session takes precedence if we're hitting an admin route, or just use whichever is available.
    // Let's use the one that exists.
    const token = adminSession?.token || session?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
