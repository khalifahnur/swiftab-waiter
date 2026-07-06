import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { toastConfig } from "@/components/ui/CustomToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedSplashOverlay />
      <Slot />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
