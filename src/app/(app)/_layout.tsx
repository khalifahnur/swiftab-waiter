import { Redirect } from "expo-router";

import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.session));

  // Wait for the stored session before deciding where to go.
  if (!hydrated) return null;
  if (!signedIn) return <Redirect href="/(auth)/signin" />;
  return <AppTabs />;
}
