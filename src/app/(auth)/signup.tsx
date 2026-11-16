import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { loginWaiter, setWaiterPassword, verifyInvite } from "@/api/api";
import { errorMessage } from "@/api/client";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { notify } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * A waiter joins with the invite code their manager created in the
 * dashboard: confirm the code, then choose a password.
 */
export default function SignUp() {
  const signIn = useAuthStore((s) => s.signIn);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string }>({});

  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [step, fade]);

  const verify = useMutation({
    mutationFn: verifyInvite,
    onSuccess: () => setStep(2),
    onError: (error) => notify.error("Could not confirm the code", errorMessage(error)),
  });

  const finish = useMutation({
    mutationFn: async (input: { email: string; password: string; validationcode: string }) => {
      await setWaiterPassword(input);
      // Sign straight in so a new waiter does not type everything twice.
      try {
        return await loginWaiter(input);
      } catch {
        return null;
      }
    },
    onSuccess: (session) => {
      if (session?.waiter?._id) {
        signIn(session);
        notify.success("You are all set", "Welcome to the team.");
      } else {
        notify.success("Password saved", "Sign in to continue.");
        router.replace("/(auth)/signin");
      }
    },
    onError: (error) => notify.error("Could not save your password", errorMessage(error)),
  });

  const submitInvite = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email";
    if (!code.trim()) next.code = "Enter the code from your manager";
    setErrors(next);
    if (Object.keys(next).length === 0) verify.mutate({ email: email.trim(), validationcode: code.trim() });
  };

  const submitPassword = () => {
    const next: typeof errors = {};
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length === 0) finish.mutate({ email: email.trim(), password, validationcode: code.trim() });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-[#F2E8D6]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-16">
          <Pressable
            onPress={() => (step === 2 ? setStep(1) : router.back())}
            className="mb-4 h-9 w-9 items-center justify-center rounded-full bg-white/60"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color="#1C1C1E" />
          </Pressable>

          <StepIndicator step={step} />

          <Animated.View style={{ opacity: fade }}>
            {step === 1 ? (
              <>
                <Text className="mb-2 text-[28px] font-bold text-gray-900">Join your restaurant</Text>
                <Text className="mb-8 text-[15px] text-gray-500">
                  Enter your work email and the invite code your manager gave you.
                </Text>

                <AuthInput
                  testID="signup-email"
                  label="Email"
                  leftIcon="mail-outline"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                />
                <AuthInput
                  testID="signup-code"
                  label="Invite code"
                  leftIcon="key-outline"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 6))}
                  error={errors.code}
                />
                <Text className="mb-6 text-[13px] text-gray-500">
                  No code, or it has expired? Your manager can issue a new one from the dashboard under Settings → Staff.
                </Text>

                <AuthButton testID="signup-continue" label="Continue" onPress={submitInvite} loading={verify.isPending} />

                <View className="mt-8 flex-row justify-center">
                  <Text className="text-[14px] text-gray-500">Already set up? </Text>
                  <Pressable onPress={() => router.replace("/(auth)/signin")} hitSlop={10} accessibilityRole="link">
                    <Text className="text-[14px] font-semibold" style={{ color: "#008080" }}>
                      Sign in
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="mb-2 text-[28px] font-bold text-gray-900">Set a password</Text>
                <Text className="mb-8 text-[15px] text-gray-500">You will use it with {email.trim()} to sign in.</Text>

                <AuthInput
                  testID="signup-password"
                  label="New password"
                  leftIcon="lock-closed-outline"
                  secure
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                />
                <AuthInput
                  testID="signup-confirm"
                  label="Confirm password"
                  leftIcon="lock-closed-outline"
                  secure
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={errors.confirmPassword}
                />

                <AuthButton testID="signup-finish" label="Finish" onPress={submitPassword} loading={finish.isPending} />
              </>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
