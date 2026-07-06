import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Text, View } from "react-native";

const NOTCH_COUNT = 9;
const CARD_WIDTH = 220;

interface TicketIllustrationProps {
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  stamp: string;
}

export function TicketIllustration({
  icon,
  accent,
  stamp,
}: TicketIllustrationProps) {
  return (
    <View className="items-center">
      <View
        style={{ width: CARD_WIDTH, borderColor: "#EFEFF1", borderWidth: 1 }}
        className="items-center rounded-3xl bg-gray-50 pb-5 pt-9"
      >
        <View
          className="h-20 w-20 items-center justify-center rounded-2xl"
          style={{ backgroundColor: accent }}
        >
          <Ionicons name={icon} size={34} color="#fff" />
        </View>

        <View
          className="mt-6 w-full px-6"
          style={{
            borderTopWidth: 1.5,
            borderStyle: "dashed",
            borderColor: "#D6D6DB",
          }}
        />

        <Text
          className="mt-3 text-[11px] font-semibold text-gray-400"
          style={{ letterSpacing: 2, fontVariant: ["tabular-nums"] }}
        >
          {stamp}
        </Text>
      </View>

      <View
        className="flex-row justify-between"
        style={{ width: CARD_WIDTH, marginTop: -9, paddingHorizontal: 6 }}
      >
        {Array.from({ length: NOTCH_COUNT }).map((_, i) => (
          <View key={i} className="h-[18px] w-[18px] rounded-full bg-white" />
        ))}
      </View>
    </View>
  );
}
