import { Ionicons } from "@react-native-vector-icons/ionicons";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderList from "@/components/OrderList";
import { useAuthStore } from "@/store/useAuthStore";

const TopTab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const waiterObj = useAuthStore((state) => state.waiterData);

  const restaurantId = waiterObj?.waiter?.restaurantId;
  const firstName = waiterObj?.waiter?.firstname || "Waiter";
  const initial = firstName.charAt(0).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <View className="flex-1 bg-[#F2E8D6]">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="px-6 pb-6 bg-[#008080] rounded-b-[32px] shadow-sm z-10"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="w-12 h-12 bg-white/20 rounded-full border border-white/30 items-center justify-center">
            <Text className="text-white text-[20px] font-black">{initial}</Text>
          </View>

          <Pressable className="w-10 h-10 bg-white/10 rounded-full items-center justify-center active:bg-white/20">
            <Ionicons name="notifications-outline" size={20} color="#ffffff" />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#008080]" />
          </Pressable>
        </View>
        <View>
          <Text className="text-white/80 text-[13px] font-bold tracking-widest uppercase mb-1">
            {getGreeting()}
          </Text>
          <Text className="text-white text-[24px] font-black capitalize tracking-tight">
            {firstName}
          </Text>
        </View>
      </View>

      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#F2E8D6",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "bold",
            textTransform: "capitalize",
          },
          tabBarActiveTintColor: "#008080",
          tabBarInactiveTintColor: "#6b7280",
          tabBarIndicatorStyle: {
            backgroundColor: "#008080",
            height: 3,
            borderRadius: 3,
          },
          tabBarScrollEnabled: true,
        }}
      >
        <TopTab.Screen name="NotTaken" options={{ title: "Not Taken" }}>
          {() => (
            <OrderList restaurantId={restaurantId} tabStatus="not-taken" />
          )}
        </TopTab.Screen>

        <TopTab.Screen name="Served" options={{ title: "Served" }}>
          {() => <OrderList restaurantId={restaurantId} tabStatus="served" />}
        </TopTab.Screen>

        <TopTab.Screen name="Payment" options={{ title: "Payment" }}>
          {() => <OrderList restaurantId={restaurantId} tabStatus="payment" />}
        </TopTab.Screen>

        <TopTab.Screen name="Completed" options={{ title: "Completed" }}>
          {() => (
            <OrderList restaurantId={restaurantId} tabStatus="completed" />
          )}
        </TopTab.Screen>
      </TopTab.Navigator>
    </View>
  );
}
