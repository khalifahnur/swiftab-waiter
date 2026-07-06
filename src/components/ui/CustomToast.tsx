import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

type Tone = "success" | "error";

const TONES: Record<
  Tone,
  { icon: keyof typeof Ionicons.glyphMap; fg: string; bg: string }
> = {
  success: { icon: "checkmark-circle", fg: "#0F9D58", bg: "#E7F8EF" },
  error: { icon: "close-circle", fg: "#E0393E", bg: "#FDEAEA" },
};

function ToastCard({ text1, text2, tone }: BaseToastProps & { tone: Tone }) {
  const { icon, fg, bg } = TONES[tone];

  return (
    <View
      className="mx-4 w-[92%] flex-row items-center rounded-2xl bg-white px-4 py-3.5"
      style={styles.shadow}
    >
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: bg }}
      >
        <Ionicons name={icon} size={20} color={fg} />
      </View>
      <View className="flex-1">
        {!!text1 && (
          <Text
            numberOfLines={1}
            className="text-[15px] font-semibold text-gray-900"
          >
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text numberOfLines={2} className="mt-0.5 text-[13px] text-gray-500">
            {text2}
          </Text>
        )}
      </View>
      <View
        className="ml-2 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: fg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
});

// Register once in your root layout: <Toast config={toastConfig} />
export const toastConfig = {
  success: (props: BaseToastProps) => <ToastCard {...props} tone="success" />,
  error: (props: BaseToastProps) => <ToastCard {...props} tone="error" />,
};
