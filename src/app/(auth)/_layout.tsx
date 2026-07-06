import { useAuthStore } from "@/store/useAuthStore";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const waiterData = useAuthStore((state) => state.waiterData);
  if (waiterData) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
