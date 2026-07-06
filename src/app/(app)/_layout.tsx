import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";

export default function AppLayout() {
  const waiterData = useAuthStore((state) => state.waiterData);
  if (!waiterData) {
    return <Redirect href="/(auth)/signin" />;
  }

  return <AppTabs />;
}
