import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { loginWaiter } from "@/api/api";
import { errorMessage } from "@/api/client";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { notify } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignIn() {
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showHelp, setShowHelp] = useState(false);

  const login = useMutation({
    mutationFn: loginWaiter,
    onSuccess: (session) => {
      if (!session?.waiter?._id) {
        notify.error("We could not sign you in", "Please try again.");
        return;
      }
      if (!session.waiter.restaurantId) {
        notify.error("No restaurant on this account", "Ask your manager to add you from the dashboard.");
        return;
      }
      // The signed-in screens replace this one as soon as the session exists.
      signIn(session);
      notify.success(`Welcome back${session.waiter.firstname ? `, ${session.waiter.firstname}` : ""}`);
    },
    // The server says what is wrong: a bad password, or an invite not finished yet.
    onError: (error) => notify.error("Could not sign in", errorMessage(error)),
  });

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = () => {
    if (validate()) login.mutate({ email: email.trim(), password });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-[#F2E8D6]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          <Text className="mb-2 text-[25px] font-bold text-gray-900">Welcome back</Text>
          <Text className="mb-8 text-[13.5px] text-gray-500">Sign in to see your tables and orders.</Text>

          <AuthInput
            testID="signin-email"
            label="Email"
            leftIcon="mail-outline"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <AuthInput
            testID="signin-password"
            label="Password"
            leftIcon="lock-closed-outline"
            secure
            autoCapitalize="none"
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={onSubmit}
            returnKeyType="go"
            error={errors.password}
          />

          <Pressable className="mb-4 self-end" hitSlop={10} accessibilityRole="button" onPress={() => setShowHelp((v) => !v)}>
            <Text className="text-[11.5px] font-medium" style={{ color: "#008080" }}>
              Forgot password?
            </Text>
          </Pressable>
          {showHelp && (
            <View className="mb-5 rounded-xl p-3.5" style={{ backgroundColor: "#FBF6EA", borderWidth: 1, borderColor: "#E7DAB8" }}>
              <Text className="text-[11.5px]" style={{ color: "#2B2621", lineHeight: 19 }}>
                Ask your manager to reset your access in the Swiftab dashboard (Settings → Staff). You will get a new invite code, and
                can then choose a new password under “Set up your account”.
              </Text>
            </View>
          )}

          <AuthButton testID="signin-submit" label="Sign in" onPress={onSubmit} loading={login.isPending} />

          <View className="mt-8 flex-row justify-center">
            <Text className="text-[12.5px] text-gray-500">Have an invite code? </Text>
            <Pressable onPress={() => router.push("/(auth)/signup")} hitSlop={10} accessibilityRole="link">
              <Text className="text-[12.5px] font-semibold" style={{ color: "#008080" }}>
                Set up your account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
