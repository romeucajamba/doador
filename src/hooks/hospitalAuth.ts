import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { HospitalUser } from '@/types/hospital';

// ── Cookie storage ────────────────────────────────────────────────────────────

const cookieStorage = {
  getItem: (name: string): string | null => Cookies.get(name) ?? null,
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
  },
  removeItem: (name: string): void => Cookies.remove(name, { path: '/' }),
};

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface HospitalAuthState {
  token: string | null;
  user: HospitalUser | null;
  isAuthenticated: boolean;

  loginHospital: (token: string, user: HospitalUser) => void;
  logoutHospital: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useHospitalAuthStore = create<HospitalAuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      loginHospital: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logoutHospital: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'hospital-auth',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
