import { feedback } from "@/lib/feedback";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  Text,
} from "react-native";

interface AuthButtonProps {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "dark" | "ghost";
  testID?: string;
}

const VARIANT_BG: Record<NonNullable<AuthButtonProps["variant"]>, string> = {
  primary: "#008080",
  dark: "#1C1C1E",
  ghost: "transparent",
};

export function AuthButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  testID,
}: AuthButtonProps) {
  const isGhost = variant === "ghost";
  const isDisabled = disabled || loading;
  const bg = VARIANT_BG[variant];

  const handlePress = (e: GestureResponderEvent) => {
    feedback.press();
    onPress(e);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(loading) }}
      onPress={handlePress}
      disabled={isDisabled}
      className="h-[46px] items-center justify-center rounded-xl"
      style={{
        backgroundColor: bg,
        opacity: isDisabled ? (isGhost ? 0.5 : 0.6) : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? "#0A84FF" : "#fff"} />
      ) : (
        <Text
          className="text-[14.5px] font-semibold"
          style={{ color: isGhost ? "#0A84FF" : "#fff" }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
