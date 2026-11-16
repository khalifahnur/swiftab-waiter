import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PrefsState {
  /** Notifications for new orders and bill requests. */
  pushEnabled: boolean;
  /** Vibrate on taps and when a new order arrives. */
  hapticsEnabled: boolean;
  set: (patch: Partial<Pick<PrefsState, "pushEnabled" | "hapticsEnabled">>) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      pushEnabled: true,
      hapticsEnabled: true,
      set: (patch) => set(patch),
    }),
    { name: "swiftab-waiter-prefs", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
