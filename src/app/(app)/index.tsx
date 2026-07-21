import { Ionicons } from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderList from "@/components/OrderList";
import { useAuthStore } from "@/store/useAuthStore";

const TopTab = createMaterialTopTabNavigator();

const COLORS = {
  paper: "#F2E8D6",
  cardBorder: "#E7DAB8",
  inkMuted: "#8C8171",
  accent: "#008080",
  accentDeep: "#006361",
};

function getGreeting(): {
  text: string;
  icon: "sunny-outline" | "partly-sunny-outline" | "moon-outline";
} {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning,", icon: "sunny-outline" };
  if (hour < 18)
    return { text: "Good afternoon,", icon: "partly-sunny-outline" };
  return { text: "Good evening,", icon: "moon-outline" };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const waiterObj = useAuthStore((state) => state.waiterData);

  const [hasUnreadNotifications] = useState(false);

  const restaurantId = waiterObj?.waiter?.restaurantId;
  const firstName = (waiterObj?.waiter?.firstname || "Waiter").trim();
  const initial = firstName.charAt(0).toUpperCase();
  const greeting = getGreeting();

  return (
    <View className="flex-1 bg-[#F2E8D6]">
      <LinearGradient
        colors={[COLORS.accent, COLORS.accentDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          shadowColor: "#00312F",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: Platform.OS === "android" ? 6 : 0,
          zIndex: 10,
        }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View
            accessible
            accessibilityLabel={`${firstName}'s avatar`}
            className="w-12 h-12 bg-white/20 rounded-full border border-white/30 items-center justify-center"
          >
            <Text className="text-white text-[20px] font-black">{initial}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              hasUnreadNotifications
                ? "Notifications, unread items"
                : "Notifications"
            }
            hitSlop={8}
            className="w-10 h-10 bg-white/10 rounded-full items-center justify-center active:bg-white/20"
          >
            <Ionicons name="notifications-outline" size={20} color="#ffffff" />
            {hasUnreadNotifications && (
              <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#008080]" />
            )}
          </Pressable>
        </View>

        <View accessible accessibilityLabel={`${greeting.text} ${firstName}`}>
          <View className="flex-row items-center mb-1">
            <Ionicons
              name={greeting.icon}
              size={13}
              color="rgba(255,255,255,0.8)"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white/80 text-[13px] font-bold tracking-widest uppercase">
              {greeting.text}
            </Text>
          </View>
          <Text className="text-white text-[24px] font-black capitalize tracking-tight">
            {firstName}
          </Text>
        </View>
      </LinearGradient>

      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.paper,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cardBorder,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "bold",
            textTransform: "capitalize",
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.inkMuted,
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.accent,
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
