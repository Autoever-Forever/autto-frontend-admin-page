import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userName: string | null;
  userEmail: string | null;
  setToken: (token: string) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  clearAuth: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      userEmail: null,
      setToken: (token) => set({ token }),
      setUserName: (userName) => set({ userName }),
      setUserEmail: (userEmail) => set({ userEmail }),
      clearAuth: () => set({ token: null, userName: null, userEmail: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuth;
