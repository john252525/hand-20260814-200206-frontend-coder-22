import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (data) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/api/v1/auth/login', data);
          const { user, token } = response.data.data;
          set({ user, token, isLoading: false });
          // Set cookie for middleware
          document.cookie = `token=${token}; path=/; max-age=3600`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: async () => {
        set({ user: null, token: null, isLoading: false });
        localStorage.removeItem('auth-storage');
        document.cookie = 'token=; path=/; max-age=0';
        window.location.href = '/login';
      },
      refreshUser: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const response = await apiClient.get('/api/v1/auth/me');
          set({ user: response.data.data });
        } catch {
          set({ user: null, token: null });
          document.cookie = 'token=; path=/; max-age=0';
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);