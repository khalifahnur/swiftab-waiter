import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthResponse } from "../../types";

interface AuthState {
  waiterData: AuthResponse | null;
  setWaiterData: (data: AuthResponse) => void;
  clearWaiterData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      waiterData: null,

      setWaiterData: (data) => set({ waiterData: data }),

      clearWaiterData: () => set({ waiterData: null }),
    }),
    {
      name: "swiftab-waiter-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
