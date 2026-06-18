import { create } from 'zustand';
import { AdminLoginResponse } from '@/types/admin';

interface AdminSession {
  token: string;
  user: AdminLoginResponse['user'];
  role: 'admin';
}

interface AdminAuthState {
  session: AdminSession | null;
  isAuthenticated: boolean;

  setAuth: (data: AdminLoginResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<AdminLoginResponse['user']>) => void;
}

const COOKIE_NAME = 'admin_session';

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

export const useAdminAuthStore = create<AdminAuthState>((set) => {
  const storedSession = getCookie(COOKIE_NAME);

  let parsedSession: AdminSession | null = null;

  try {
    parsedSession = storedSession ? JSON.parse(storedSession) : null;
  } catch {
    parsedSession = null;
  }

  return {
    session: parsedSession,
    isAuthenticated: !!parsedSession?.token,

    setAuth: (data) => {
      const session: AdminSession = {
        token: data.token,
        user: data.user,
        role: 'admin',
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

        const newSession: AdminSession = {
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
