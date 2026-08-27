import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';
import { APIError } from '@/lib/utils/api-error';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    const data = error.response?.data as any;
    const message = data?.error?.message || data?.message || 'Произошла ошибка';
    const code = data?.error?.code || 'INTERNAL_ERROR';
    const details = data?.error?.details;

    if (status === 401) {
      useAuthStore.getState().logout();
    }

    throw new APIError(status, code, message, details);
  }
);

export default apiClient;