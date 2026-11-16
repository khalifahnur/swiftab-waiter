import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.session));

  if (!hydrated) return null;
  if (signedIn) return <Redirect href="/(app)" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
