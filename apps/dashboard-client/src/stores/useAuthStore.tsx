import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser) => void;
  clearAuth: () => void;
};

type AuthUser = {
  discordId: string;
  fullName: string;
  avatar: string;
  email: string;
  id: string;
  iat: number;
  exp: number;
};

// Initialize token from localStorage
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!getInitialToken(),
  accessToken: getInitialToken(),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  authUser: null,
  setAuthUser: (authUser: AuthUser) => set({ authUser }),
  clearAuth: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, accessToken: null, authUser: null });
  },
}));
