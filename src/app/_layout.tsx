import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { toastConfig } from "@/components/ui/CustomToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedSplashOverlay />
      <Slot />
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor="#008080"
      />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
