import { Ionicons } from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useEffect, useRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import OrderList from "@/components/OrderList";
import { TABS } from "@/constants/orderStatus";
import { C } from "@/constants/theme";
import { useSetDuty, useSummary } from "@/hooks/queries";
import { feedback } from "@/lib/feedback";
import { elapsed, formatKes } from "@/lib/format";
import { notify } from "@/lib/toast";
import { useWaiter } from "@/store/useAuthStore";

const TopTab = createMaterialTopTabNavigator();

function greeting(): { text: string; icon: "sunny-outline" | "partly-sunny-outline" | "moon-outline" } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: "sunny-outline" };
  if (hour < 18) return { text: "Good afternoon", icon: "partly-sunny-outline" };
  return { text: "Good evening", icon: "moon-outline" };
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1">
      <Text className="text-white text-[18px] font-extrabold" style={{ fontVariant: ["tabular-nums"] }} numberOfLines={1}>
        {value}
      </Text>
      <Text className="text-white/70 text-[11px] font-semibold uppercase tracking-wider mt-0.5">{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const waiter = useWaiter();
  const { data: summary } = useSummary();
  const duty = useSetDuty();

  const firstName = (waiter?.firstname || "Waiter").trim();
  const hello = greeting();
  const onDuty = summary?.onDuty ?? waiter?.onDuty ?? false;
  const since = summary?.dutyStartedAt ?? waiter?.dutyStartedAt;
  const queues = summary?.queues;

  // A fresh order nobody has taken: nudge the waiter even if they are on another queue.
  const lastNew = useRef<number | null>(null);
  const newCount = queues?.["not-taken"];
  useEffect(() => {
    if (newCount === undefined) return;
    if (lastNew.current !== null && newCount > lastNew.current) {
      feedback.warning();
      notify.success(newCount - lastNew.current === 1 ? "New order" : `${newCount - lastNew.current} new orders`, "Open the New queue to take it.");
    }
    lastNew.current = newCount;
  }, [newCount]);

  const toggleDuty = () => {
    feedback.press();
    duty.mutate(!onDuty, {
      onSuccess: (result) => notify.success(result.onDuty ? "You are on duty" : "You are off duty"),
      onError: (error) => notify.error("Could not update your status", errorMessage(error)),
    });
  };

  const count = (tab: string) => (tab === "completed" ? undefined : queues?.[tab as keyof typeof queues]);

  return (
    <View className="flex-1 bg-[#F2E8D6]">
      <LinearGradient
        colors={[C.accent, C.accentDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 18,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          shadowColor: "#00312F",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: Platform.OS === "android" ? 6 : 0,
          zIndex: 10,
        }}
      >
        <View className="flex-row items-center">
          <View className="flex-1" accessible accessibilityLabel={`${hello.text}, ${firstName}`}>
            <View className="flex-row items-center mb-0.5">
              <Ionicons name={hello.icon} size={13} color="rgba(255,255,255,0.8)" style={{ marginRight: 6 }} />
              <Text className="text-white/80 text-[12px] font-bold tracking-widest uppercase">{hello.text}</Text>
            </View>
            <Text className="text-white text-[24px] font-black capitalize tracking-tight" numberOfLines={1}>
              {firstName}
            </Text>
            {!!waiter?.restaurantName && (
              <Text className="text-white/75 text-[13px] font-medium mt-0.5" numberOfLines={1}>
                {waiter.restaurantName}
              </Text>
            )}
          </View>

          <Pressable
            testID="duty-toggle"
            accessibilityRole="switch"
            accessibilityState={{ checked: onDuty, busy: duty.isPending }}
            accessibilityLabel={onDuty ? "On duty. Tap to clock out" : "Off duty. Tap to clock in"}
            disabled={duty.isPending}
            onPress={toggleDuty}
            hitSlop={8}
            className="flex-row items-center rounded-full px-3.5 py-2"
            style={{ backgroundColor: onDuty ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.16)", opacity: duty.isPending ? 0.6 : 1 }}
          >
            <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: onDuty ? "#22A06B" : "rgba(255,255,255,0.7)" }} />
            <Text className="text-[13px] font-bold" style={{ color: onDuty ? C.accentDeep : "#FFFFFF" }}>
              {onDuty ? "On duty" : "Off duty"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row mt-4 pt-3.5" style={{ borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.16)" }}>
          <Stat value={String(summary?.today.tablesServed ?? 0)} label="Served today" />
          <Stat value={String(summary?.today.tablesClosed ?? 0)} label="Tables closed" />
          <Stat value={formatKes(summary?.today.salesClosed)} label={onDuty && since ? `Shift · ${elapsed(since)}` : "Sales closed"} />
        </View>
      </LinearGradient>

      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: C.paper, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: C.cardBorder },
          tabBarLabelStyle: { fontSize: 13, fontWeight: "bold", textTransform: "none" },
          tabBarActiveTintColor: C.accent,
          tabBarInactiveTintColor: C.inkMuted,
          tabBarIndicatorStyle: { backgroundColor: C.accent, height: 3, borderRadius: 3 },
          tabBarItemStyle: { paddingHorizontal: 4 },
        }}
      >
        {TABS.map((tab) => {
          const waiting = count(tab.id);
          return (
            <TopTab.Screen key={tab.id} name={tab.id} options={{ title: waiting ? `${tab.label} · ${waiting}` : tab.label }}>
              {() => <OrderList tab={tab.id} />}
            </TopTab.Screen>
          );
        })}
      </TopTab.Navigator>
    </View>
  );
}
