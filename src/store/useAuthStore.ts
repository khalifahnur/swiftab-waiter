import { create } from "zustand";
import { AuthResponse } from "../../types";

interface AuthState {
  waiterData: AuthResponse | null;
  setWaiterData: (data: AuthResponse) => void;
  clearWaiterData: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  waiterData: null,
  setWaiterData: (data) => set({ waiterData: data }),
  clearWaiterData: () => set({ waiterData: null }),
}));
