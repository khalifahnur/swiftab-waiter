import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useSetPassword, useSignUp } from "@/hooks/apihook/useAuth";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function SignUp() {
  const [step, setStep] = useState<1 | 2>(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step1Errors, setStep1Errors] = useState<{
    restaurantName?: string;
    email?: string;
    code?: string;
  }>({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step2Errors, setStep2Errors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown === 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const { mutate: signUp, isPending: isVerifying } = useSignUp();
  const { mutate: setNewPassword, isPending: isSettingPassword } =
    useSetPassword();

  const validateStep1 = () => {
    const next: typeof step1Errors = {};
    if (!restaurantName.trim())
      next.restaurantName = "Restaurant name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (!code.trim()) next.code = "Verification code is required";
    setStep1Errors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: typeof step2Errors = {};
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "At least 8 characters";
    if (confirmPassword !== password)
      next.confirmPassword = "Passwords do not match";
    setStep2Errors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmitStep1 = () => {
    if (!validateStep1()) return;
    signUp(
      { email: email.trim(), validationcode: code.trim() },
      { onSuccess: () => setStep(2) },
    );
  };

  const onSubmitStep2 = () => {
    if (!validateStep2()) return;
    setNewPassword({ email: email.trim(), password: password });
  };

  const resendCode = () => {
    if (cooldown > 0) return;
    Toast.show({
      type: "success",
      text1: "Code resent",
      text2: `Check ${email || "your inbox"}`,
    });
    setCooldown(30);
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
        <View className="flex-1 px-6 pt-8">
          {step === 2 && (
            <Pressable
              onPress={() => setStep(1)}
              className="mb-4 h-9 w-9 items-center justify-center rounded-full bg-gray-100"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color="#1C1C1E" />
            </Pressable>
          )}

          <StepIndicator step={step} />

          <Animated.View style={{ opacity: fade }}>
            {step === 1 ? (
              <>
                <Text className="mb-2 text-[28px] font-bold text-gray-900">
                  Create your account
                </Text>
                <Text className="mb-8 text-[15px] text-gray-500">
                  Tell us about your restaurant to get started.
                </Text>

                <AuthInput
                  label="Restaurant Name"
                  leftIcon="storefront-outline"
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                  error={step1Errors.restaurantName}
                />
                <AuthInput
                  label="Email"
                  leftIcon="mail-outline"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  error={step1Errors.email}
                />
                <AuthInput
                  label="Verification Code"
                  leftIcon="key-outline"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  error={step1Errors.code}
                />

                <Pressable
                  onPress={resendCode}
                  disabled={cooldown > 0}
                  className="mb-6 self-end"
                  hitSlop={10}
                >
                  <Text
                    className="text-[13px] font-medium"
                    style={{ color: cooldown > 0 ? "#9A9AA0" : "#008080" }}
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend code"}
                  </Text>
                </Pressable>

                <AuthButton
                  label="Continue"
                  onPress={onSubmitStep1}
                  loading={isVerifying}
                />

                <View className="mt-8 flex-row justify-center">
                  <Text className="text-[14px] text-gray-500">
                    Already have an account?{" "}
                  </Text>
                  <Pressable
                    onPress={() => router.replace("/(auth)/signin")}
                    hitSlop={10}
                  >
                    <Text
                      className="text-[14px] font-semibold"
                      style={{ color: "#008080" }}
                    >
                      Sign In
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="mb-2 text-[28px] font-bold text-gray-900">
                  Set a password
                </Text>
                <Text className="mb-8 text-[15px] text-gray-500">
                  Choose a strong password to finish setting up{" "}
                  {restaurantName || "your restaurant"}.
                </Text>

                <AuthInput
                  label="New Password"
                  leftIcon="lock-closed-outline"
                  secure
                  value={password}
                  onChangeText={setPassword}
                  error={step2Errors.password}
                />
                <AuthInput
                  label="Confirm Password"
                  leftIcon="lock-closed-outline"
                  secure
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={step2Errors.confirmPassword}
                />

                <AuthButton
                  label="Finish Sign Up"
                  onPress={onSubmitStep2}
                  loading={isSettingPassword}
                />
              </>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
