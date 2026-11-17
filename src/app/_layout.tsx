import { focusManager, QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import Toast from "react-native-toast-message";

import { setSessionExpiredHandler } from "@/api/client";
import AnimatedSplash from "@/components/AnimatedSplash";
import { toastConfig } from "@/components/ui/CustomToast";
import { feedback } from "@/lib/feedback";
import { listenForNotifications, registerForPush } from "@/lib/notifications";
import { notify } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { usePrefs } from "@/store/usePrefs";

import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Refresh the queues when the app comes back to the foreground.
focusManager.setEventListener((setFocused) => {
  const subscription = AppState.addEventListener("change", (state) => {
    if (Platform.OS !== "web") setFocused(state === "active");
  });
  return () => subscription.remove();
});

/** Push registration and notification handling for a signed-in waiter. */
function SignedInServices() {
  const router = useRouter();
  const client = useQueryClient();
  const waiterId = useAuthStore((s) => s.session?.waiter?._id);
  const pushEnabled = usePrefs((s) => s.pushEnabled);

  useEffect(() => {
    if (waiterId && pushEnabled) registerForPush(waiterId);
  }, [waiterId, pushEnabled]);

  useEffect(() => {
    const refresh = () => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["summary"] });
      client.invalidateQueries({ queryKey: ["floor"] });
    };
    return listenForNotifications({
      onReceive: () => {
        feedback.warning();
        refresh();
      },
      onOpen: () => {
        refresh();
        router.navigate("/(app)");
      },
    });
  }, [client, router]);

  return null;
}

export default function RootLayout() {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, gcTime: 10 * 60 * 1000 }, mutations: { retry: 0 } } }),
  );
  const signedIn = useAuthStore((s) => Boolean(s.session));
  const hydrated = useAuthStore((s) => s.hydrated);

  // When the API no longer accepts the session, return to sign-in once.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (!useAuthStore.getState().session) return;
      useAuthStore.getState().signOut();
      client.clear();
      notify.error("Your session has ended", "Please sign in again.");
    });
    return () => setSessionExpiredHandler(null);
  }, [client]);

  return (
    <QueryClientProvider client={client}>
      <Slot />
      {signedIn && <SignedInServices />}
      <StatusBar style="light" />
      <Toast config={toastConfig} topOffset={56} />
      {/* Hides the system splash itself, then animates away once the session has been read. */}
      <AnimatedSplash ready={hydrated} />
    </QueryClientProvider>
  );
}
