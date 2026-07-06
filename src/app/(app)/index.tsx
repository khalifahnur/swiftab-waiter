import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

import OrderList from "@/components/OrderList";
import { useAuthStore } from "@/store/useAuthStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TopTab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const waiterObj = useAuthStore((state) => state.waiterData);

  const restaurantId = waiterObj?.waiter?.restaurantId;

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingTop: insets.top,
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "bold",
          textTransform: "capitalize",
        },
        tabBarActiveTintColor: "#0d9488",
        tabBarInactiveTintColor: "#6b7280",
        tabBarIndicatorStyle: {
          backgroundColor: "#0d9488",
          height: 3,
          borderRadius: 3,
        },
        tabBarScrollEnabled: true,
      }}
    >
      <TopTab.Screen name="NotTaken" options={{ title: "Not Taken" }}>
        {() => <OrderList restaurantId={restaurantId} tabStatus="not-taken" />}
      </TopTab.Screen>

      <TopTab.Screen name="Served" options={{ title: "Served" }}>
        {() => <OrderList restaurantId={restaurantId} tabStatus="served" />}
      </TopTab.Screen>

      <TopTab.Screen name="Payment" options={{ title: "Payment" }}>
        {() => <OrderList restaurantId={restaurantId} tabStatus="payment" />}
      </TopTab.Screen>

      <TopTab.Screen name="Completed" options={{ title: "Completed" }}>
        {() => <OrderList restaurantId={restaurantId} tabStatus="completed" />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
}
