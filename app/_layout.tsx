import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/Colors";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());

  const toastConfig = useCallback(
    () => ({
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{ marginTop: 10, borderLeftColor: "blue" }}
        />
      ),
      error: (props: any) => (
        <ErrorToast
          {...props}
          style={{ marginTop: 10, borderLeftColor: "red" }}
        />
      ),
    }),
    []
  );

  return (
    <QueryClientProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar backgroundColor={colors.blueGronto} />
        <Toast config={toastConfig()} />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
