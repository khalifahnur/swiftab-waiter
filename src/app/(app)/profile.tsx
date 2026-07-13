import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { Avatar } from "@/components/profile/Avatar";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const waiterData = useAuthStore((state) => state.waiterData);
  const clearWaiterData = useAuthStore((state) => state.clearWaiterData);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const firstName = waiterData?.waiter?.firstname || "Waiter";
  const lastName = waiterData?.waiter?.lastname || "";
  const displayName = `${firstName} ${lastName}`.trim();
  const email = waiterData?.waiter?.email || "No email on file";

  const confirmSignOut = () => {
    Alert.alert(
      "Sign out?",
      "You will need to sign in again to access your tables.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            clearWaiterData();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#008080]"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1 bg-[#F2E8D6]"
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 30,
        }}
      >
        <Pressable
          onPress={() => router.push("/screens/edit")}
          className="mb-6 flex-row items-center rounded-2xl p-4"
          style={{ backgroundColor: "#F7F7F8" }}
        >
          <Avatar name={displayName} size={56} />
          <View className="ml-4 flex-1">
            <Text className="text-[17px] font-semibold text-gray-900">
              {displayName}
            </Text>
            <Text className="mt-0.5 text-[13px] text-gray-500">{email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </Pressable>

        <SettingsSection title="Account">
          <SettingsRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push("/screens/edit")}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsRow
            icon="notifications-outline"
            iconColor="#FF8A3D"
            iconBg="#FFF1E6"
            label="Push Notifications"
            switchValue={pushEnabled}
            onSwitchChange={setPushEnabled}
          />
          <SettingsRow
            icon="phone-portrait-outline"
            iconColor="#5E5CE6"
            iconBg="#EEEEFC"
            label="Haptic Feedback"
            switchValue={hapticsEnabled}
            onSwitchChange={setHapticsEnabled}
          />
          <SettingsRow
            icon="volume-medium-outline"
            iconColor="#30D158"
            iconBg="#E7F8EF"
            label="Order Sounds"
            switchValue={soundEnabled}
            onSwitchChange={setSoundEnabled}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
          />
          <SettingsRow
            icon="chatbubble-ellipses-outline"
            label="Contact Support"
            onPress={() => {}}
          />
          <SettingsRow
            icon="star-outline"
            label="Rate the App"
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => {}}
            isLast
          />
        </SettingsSection>

        <Pressable
          onPress={confirmSignOut}
          className="mt-2 items-center rounded-2xl py-3.5"
          style={{ backgroundColor: "#1e1e1e" }}
        >
          <Text
            className="text-[15px] font-semibold"
            style={{ color: "#E0393E" }}
          >
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
