import { create } from "zustand";

export const useAuthStore = create((set) => ({
  auth: {
    accessToken: "abc",
    userInfo: null,
  },
  setAuth: (authData) => set({ auth: authData }),
  clearAuth: () => set({ auth: { accessToken: null, userInfo: null } }),
}));
