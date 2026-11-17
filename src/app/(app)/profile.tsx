import { Icon, type IconName } from "@/components/ui/Icon";
import { useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/profile/Avatar";
import { DutyStatusCard } from "@/components/profile/DutyStatusCard";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { useSummary } from "@/hooks/queries";
import { formatKes } from "@/lib/format";
import { ensurePermission, registerForPush, unregisterPush } from "@/lib/notifications";
import { notify } from "@/lib/toast";
import { useAuthStore, useWaiter } from "@/store/useAuthStore";
import { usePrefs } from "@/store/usePrefs";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-[16px] font-extrabold" style={{ color: "#2B2621", fontVariant: ["tabular-nums"] }} numberOfLines={1}>
        {value}
      </Text>
      <Text className="mt-0.5 text-[11px] font-semibold uppercase" style={{ color: "#8C8171", letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

export default function Profile() {
  const client = useQueryClient();
  const waiter = useWaiter();
  const signOut = useAuthStore((s) => s.signOut);
  const prefs = usePrefs();
  const { data: summary } = useSummary();

  const displayName = `${waiter?.firstname || "Waiter"} ${waiter?.lastname || ""}`.trim();
  const version = Constants.expoConfig?.version;

  const togglePush = async (enabled: boolean) => {
    if (!waiter?._id) return;
    if (enabled) {
      if (!(await ensurePermission(true))) {
        notify.error("Notifications are blocked", "Allow them for Swiftab Waiter in your phone settings.");
        return;
      }
      prefs.set({ pushEnabled: true });
      registerForPush(waiter._id);
    } else {
      prefs.set({ pushEnabled: false });
      unregisterPush(waiter._id);
    }
  };

  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const doSignOut = async () => {
    setLeaving(true);
    // Stop notifications to this phone before the session goes.
    if (waiter?._id) await unregisterPush(waiter._id);
    client.clear();
    setLeaving(false);
    setConfirming(false);
    signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#008080]" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1 bg-[#F2E8D6]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Pressable
          testID="open-edit-profile"
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          onPress={() => router.push("/screens/edit")}
          className="mb-4 flex-row items-center rounded-2xl p-4"
          style={{ backgroundColor: "#FBF6EA", borderWidth: 1, borderColor: "#E7DAB8" }}
        >
          <Avatar name={displayName} size={56} />
          <View className="ml-4 flex-1">
            <Text className="text-[15.5px] font-semibold" style={{ color: "#2B2621" }} numberOfLines={1}>
              {displayName}
            </Text>
            <Text className="mt-0.5 text-[11.5px]" style={{ color: "#8C8171" }} numberOfLines={1}>
              {waiter?.restaurantName ? `${waiter.restaurantName} · ` : ""}
              {waiter?.email || "No email on file"}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color="#C7BFA9" />
        </Pressable>

        <DutyStatusCard />

        <View className="mb-6 flex-row rounded-2xl py-4" style={{ backgroundColor: "#FBF6EA", borderWidth: 1, borderColor: "#E7DAB8" }}>
          <Stat value={String(summary?.today.tablesServed ?? 0)} label="Served today" />
          <Stat value={String(summary?.today.tablesClosed ?? 0)} label="Closed" />
          <Stat value={formatKes(summary?.today.salesClosed)} label="Sales" />
        </View>

        <SettingsSection title="Account">
          <SettingsRow icon="person-outline" label="Edit profile" onPress={() => router.push("/screens/edit")} isLast />
        </SettingsSection>

        <SettingsSection title="Preferences">
          {Platform.OS !== "web" && (
            <SettingsRow
              icon="notifications-outline"
              iconColor="#B4530F"
              iconBg="#FBE9CE"
              label="New order and bill alerts"
              switchValue={prefs.pushEnabled}
              onSwitchChange={togglePush}
            />
          )}
          <SettingsRow
            icon="phone-portrait-outline"
            iconColor="#5B21B6"
            iconBg="#EDE9FE"
            label="Vibrate on taps and new orders"
            switchValue={prefs.hapticsEnabled}
            onSwitchChange={(hapticsEnabled) => prefs.set({ hapticsEnabled })}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow icon="help-circle-outline" label="Help centre" onPress={() => router.push("/screens/support")} />
          <SettingsRow
            icon="mail-outline"
            label="Email support"
            value="support@swiftab.co.ke"
            onPress={() => Linking.openURL("mailto:support@swiftab.co.ke").catch(() => notify.error("No email app is set up on this phone"))}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon="document-text-outline" label="Terms and privacy" onPress={() => router.push("/screens/legal")} isLast />
        </SettingsSection>

        <Pressable testID="sign-out" accessibilityRole="button" onPress={() => setConfirming(true)} className="mt-2 items-center rounded-2xl py-3.5" style={{ backgroundColor: "#2B2621" }}>
          <Text className="text-[13.5px] font-semibold" style={{ color: "#FF8A80" }}>
            Sign out
          </Text>
        </Pressable>
        {!!version && (
          <Text className="mt-4 text-center text-[12px]" style={{ color: "#8C8171" }}>
            Swiftab Waiter {version}
          </Text>
        )}
      </ScrollView>

      <Modal visible={confirming} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setConfirming(false)}>
        <View className="flex-1 justify-center px-7" style={{ backgroundColor: "rgba(43,38,33,0.55)" }}>
          <View className="rounded-3xl p-6" style={{ backgroundColor: "#FBF6EA" }}>
            <Text className="text-[16px] font-bold" style={{ color: "#2B2621" }}>
              Sign out?
            </Text>
            <Text className="mt-2 text-[12.5px]" style={{ color: "#8C8171", lineHeight: 20 }}>
              You will need your email and password to see your tables again. New-order alerts to this phone stop.
            </Text>
            <View className="mt-6 flex-row" style={{ gap: 10 }}>
              <Pressable
                accessibilityRole="button"
                disabled={leaving}
                onPress={() => setConfirming(false)}
                className="h-12 flex-1 items-center justify-center rounded-xl"
                style={{ borderWidth: 1, borderColor: "#E7DAB8" }}
              >
                <Text className="text-[13.5px] font-semibold" style={{ color: "#2B2621" }}>
                  Stay
                </Text>
              </Pressable>
              <Pressable
                testID="confirm-sign-out"
                accessibilityRole="button"
                disabled={leaving}
                onPress={doSignOut}
                className="h-12 flex-1 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#B0413E", opacity: leaving ? 0.6 : 1 }}
              >
                <Text className="text-[13.5px] font-semibold text-white">{leaving ? "Signing out…" : "Sign out"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
