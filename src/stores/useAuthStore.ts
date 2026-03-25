import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Donor, Hospital } from '../lib/types';

import Cookies from 'js-cookie';

interface AuthState {
  user: User | Donor | Hospital | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
}

const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, secure: true, sameSite: 'strict' });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'blood-auth-cookie',
      storage: cookieStorage as any,
    }
  )
);
