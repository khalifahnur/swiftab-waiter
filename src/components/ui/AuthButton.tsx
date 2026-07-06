import * as Haptics from "expo-haptics";
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
}: AuthButtonProps) {
  const isGhost = variant === "ghost";
  const isDisabled = disabled || loading;
  const bg = VARIANT_BG[variant];

  const handlePress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className="h-[52px] items-center justify-center rounded-xl"
      style={{
        backgroundColor: bg,
        opacity: isDisabled ? (isGhost ? 0.5 : 0.6) : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? "#0A84FF" : "#fff"} />
      ) : (
        <Text
          className="text-[16px] font-semibold"
          style={{ color: isGhost ? "#0A84FF" : "#fff" }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
