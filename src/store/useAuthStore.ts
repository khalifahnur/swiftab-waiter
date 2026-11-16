import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

import type { Session, Waiter } from "@/types";

/**
 * The signed-in waiter. Kept in the device keychain; on web (used only to
 * preview screens) the browser's storage stands in for it.
 */
const secure: StateStorage =
  Platform.OS === "web"
    ? {
        getItem: (name) => globalThis.localStorage?.getItem(name) ?? null,
        setItem: (name, value) => globalThis.localStorage?.setItem(name, value),
        removeItem: (name) => globalThis.localStorage?.removeItem(name),
      }
    : {
        getItem: (name) => SecureStore.getItemAsync(name),
        setItem: (name, value) => SecureStore.setItemAsync(name, value),
        removeItem: (name) => SecureStore.deleteItemAsync(name),
      };

interface AuthState {
  session: Session | null;
  hydrated: boolean;
  signIn: (session: Session) => void;
  setWaiter: (patch: Partial<Waiter>) => void;
  signOut: () => void;
}

const LEGACY_KEY = "swiftab-waiter-storage";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      hydrated: false,
      signIn: (session) => set({ session }),
      setWaiter: (patch) => {
        const current = get().session;
        if (current) set({ session: { ...current, waiter: { ...current.waiter, ...patch } } });
      },
      signOut: () => set({ session: null }),
    }),
    {
      name: "swiftab-waiter-session",
      storage: createJSONStorage(() => secure),
      partialize: ({ session }) => ({ session }),
      onRehydrateStorage: () => (state) => {
        migrateLegacySession(Boolean(state?.session)).finally(() => useAuthStore.setState({ hydrated: true }));
      },
    },
  ),
);

/**
 * Earlier builds kept the session in plain storage. Move it into the keychain
 * once, so an update does not sign anyone out, then remove the old copy.
 */
async function migrateLegacySession(alreadySignedIn: boolean): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw)?.state?.waiterData as Session | undefined;
    if (!alreadySignedIn && legacy?.waiter?._id) {
      useAuthStore.setState({ session: { token: legacy.token, waiter: legacy.waiter } });
    }
    await AsyncStorage.removeItem(LEGACY_KEY);
  } catch {
    // Nothing usable was stored; the waiter signs in again.
  }
}

/** The signed-in waiter, or undefined. */
export const useWaiter = () => useAuthStore((s) => s.session?.waiter);
