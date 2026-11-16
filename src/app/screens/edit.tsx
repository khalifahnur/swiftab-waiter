import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { useUpdateProfile } from "@/hooks/queries";
import { initials } from "@/lib/format";
import { notify } from "@/lib/toast";
import { useWaiter } from "@/store/useAuthStore";

/** The name and phone number guests and managers see for this waiter. */
export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const waiter = useWaiter();
  const update = useUpdateProfile();

  const [firstName, setFirstName] = useState(waiter?.firstname ?? "");
  const [lastName, setLastName] = useState(waiter?.lastname ?? "");
  const [phoneNumber, setPhoneNumber] = useState(waiter?.phoneNumber ?? "");
  const [errors, setErrors] = useState<{ firstName?: string; phoneNumber?: string }>({});

  const changed =
    firstName.trim() !== (waiter?.firstname ?? "") || lastName.trim() !== (waiter?.lastname ?? "") || phoneNumber.trim() !== (waiter?.phoneNumber ?? "");

  // Always return to the profile tab, however this screen was reached.
  const leave = () => router.navigate("/(app)/profile");

  const onSave = () => {
    const next: typeof errors = {};
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!/^\+?[\d\s-]{9,16}$/.test(phoneNumber.trim())) next.phoneNumber = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    update.mutate(
      { firstname: firstName.trim(), lastname: lastName.trim(), phoneNumber: phoneNumber.trim() },
      {
        onSuccess: () => {
          notify.success("Profile updated");
          leave();
        },
        onError: (error) => notify.error("Could not save your profile", errorMessage(error)),
      },
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-[#F2E8D6]">
      <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center px-5 pb-4">
        <Pressable
          onPress={leave}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/60"
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color="#2B2621" />
        </Pressable>
        <Text className="ml-4 text-[19px] font-bold tracking-tight" style={{ color: "#2B2621" }}>
          Edit profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="mb-8 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: "#DCEEE8", borderWidth: 4, borderColor: "#FBF6EA" }}>
            <Text className="text-[34px] font-black" style={{ color: "#006361" }}>
              {initials(firstName, lastName)}
            </Text>
          </View>
          {!!waiter?.email && (
            <Text className="mt-3 text-[13px]" style={{ color: "#8C8171" }}>
              {waiter.email}
            </Text>
          )}
        </View>

        <AuthInput testID="edit-first-name" label="First name" leftIcon="person-outline" autoCapitalize="words" value={firstName} onChangeText={setFirstName} error={errors.firstName} />
        <AuthInput testID="edit-last-name" label="Last name" leftIcon="person-outline" autoCapitalize="words" value={lastName} onChangeText={setLastName} />
        <AuthInput
          testID="edit-phone"
          label="Phone number"
          leftIcon="call-outline"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={errors.phoneNumber}
        />

        <View className="mt-6">
          <AuthButton testID="edit-save" label="Save changes" onPress={onSave} loading={update.isPending} disabled={!changed} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
