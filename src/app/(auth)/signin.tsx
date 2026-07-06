import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { useLogin } from "@/hooks/apihook/useAuth";
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
import Toast from "react-native-toast-message";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { mutate: login, isPending } = useLogin();

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    login(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Welcome back!" });
          router.replace("/");
        },
        onError: () => {
          Toast.show({ type: "error", text1: "Invalid email or password" });
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          <Text className="mb-2 text-[28px] font-bold text-gray-900">
            Welcome back
          </Text>
          <Text className="mb-8 text-[15px] text-gray-500">
            Sign in to manage your tables and orders.
          </Text>

          <AuthInput
            label="Email"
            leftIcon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <AuthInput
            label="Password"
            leftIcon="lock-closed-outline"
            secure
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Pressable className="mb-6 self-end" hitSlop={10}>
            <Text
              className="text-[13px] font-medium"
              style={{ color: "#008080" }}
            >
              Forgot password?
            </Text>
          </Pressable>

          <AuthButton label="Sign In" onPress={onSubmit} loading={isPending} />

          <View className="mt-8 flex-row justify-center">
            <Text className="text-[14px] text-gray-500">
              Don&apos;t have an account?{" "}
            </Text>
            <Pressable
              onPress={() => router.push("/(auth)/signup")}
              hitSlop={10}
            >
              <Text
                className="text-[14px] font-semibold"
                style={{ color: "#008080" }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
