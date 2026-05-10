import { create } from 'zustand';
import { AuthSession, AuthResponse } from '@/types/auth';

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;

  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthSession['user']>) => void;
}

/* =========================
   Cookies
========================= */

const COOKIE_NAME = 'session';

const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.split('=')[1]);
  } catch {
    return null;
  }
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

/* =========================
   Store
========================= */

export const useAuthStore = create<AuthState>((set) => {
  const storedSession = getCookie(COOKIE_NAME);

  let parsedSession: AuthSession | null = null;

  try {
    parsedSession = storedSession ? JSON.parse(storedSession) : null;
  } catch {
    parsedSession = null;
  }

  return {
    session: parsedSession,
    isAuthenticated: !!parsedSession?.token,

    setAuth: (data) => {
      const session: AuthSession = {
        token: data.token,
        user: {
          ...data.user,
        },
        role: data.user.id_doador ? 'donor' : 'hospital',
      };

      setCookie(COOKIE_NAME, encodeURIComponent(JSON.stringify(session)));

      set({
        session,
        isAuthenticated: true,
      });
    },

    logout: () => {
      deleteCookie(COOKIE_NAME);

      set({
        session: null,
        isAuthenticated: false,
      });
    },

    updateUser: (updatedUser) =>
      set((state) => {
        if (!state.session) return state;

        const newSession: AuthSession = {
          ...state.session,
          user: {
            ...state.session.user,
            ...updatedUser,
          },
        };

        setCookie(COOKIE_NAME, encodeURIComponent(JSON.stringify(newSession)));

        return { session: newSession };
      }),
  };
});
