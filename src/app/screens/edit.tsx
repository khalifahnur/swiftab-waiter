import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { useAuthStore } from "@/store/useAuthStore";

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const waiterObj = useAuthStore((state) => state.waiterData);
  const waiter = waiterObj?.waiter;

  const [firstName, setFirstName] = useState(waiter?.firstname);
  const [phoneNumber, setPhoneNumber] = useState(waiter?.phoneNumber || "");
  const [errors, setErrors] = useState<{
    firstName?: string;
    phoneNumber?: string;
  }>({});

  const initial = firstName?.charAt(0).toUpperCase() || "W";

  const validate = () => {
    const next: typeof errors = {};
    if (!firstName?.trim()) next.firstName = "First name is required";
    if (!phoneNumber.trim()) next.phoneNumber = "Phone number is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;
    // updateProfile(
    //   { firstName: firstName?.trim(), phoneNumber: phoneNumber.trim() },
    //   { onSuccess: () => router.back() }
    // );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#F7F8FA]"
    >
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center px-5 pb-4 bg-white border-b border-gray-100"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </Pressable>
        <Text className="ml-4 text-[19px] font-bold text-gray-900 tracking-tight">
          Edit Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10 items-center mt-2">
          <View>
            <View className="w-24 h-24 bg-teal-100 rounded-full border-4 border-white shadow-sm items-center justify-center">
              <Text className="text-teal-700 text-[36px] font-black">
                {initial}
              </Text>
            </View>
            <Pressable className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-[#008080] border-[3px] border-[#F7F8FA]">
              <Ionicons name="camera" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Inputs */}
        <AuthInput
          label="First Name"
          leftIcon="person-outline"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
        />

        <View className="mt-2" />

        <AuthInput
          label="Phone Number"
          leftIcon="call-outline"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={errors.phoneNumber}
        />

        <View className="mt-8">
          <AuthButton label="Save Changes" onPress={onSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
