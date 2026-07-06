import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as Haptics from "expo-haptics";
import { Pressable, Switch, Text, View } from "react-native";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  isLast?: boolean;
}

export function SettingsRow({
  icon,
  iconColor = "#0A84FF",
  iconBg = "#EAF3FF",
  label,
  value,
  onPress,
  destructive,
  switchValue,
  onSwitchChange,
  isLast,
}: SettingsRowProps) {
  const isSwitchRow = switchValue !== undefined;

  const content = (
    <View
      className="flex-row items-center bg-white px-4 py-3.5"
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#EFEFF1",
      }}
    >
      <View
        className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: destructive ? "#FDEAEA" : iconBg }}
      >
        <Ionicons
          name={icon}
          size={17}
          color={destructive ? "#E0393E" : iconColor}
        />
      </View>
      <Text
        className="flex-1 text-[15px]"
        style={{ color: destructive ? "#E0393E" : "#1C1C1E" }}
      >
        {label}
      </Text>
      {isSwitchRow ? (
        <Switch
          value={switchValue}
          onValueChange={(v) => {
            Haptics.selectionAsync();
            onSwitchChange?.(v);
          }}
          trackColor={{ false: "#E5E5EA", true: "#0A84FF" }}
        />
      ) : (
        <>
          {!!value && (
            <Text className="mr-1.5 text-[14px] text-gray-400">{value}</Text>
          )}
          {!!onPress && (
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          )}
        </>
      )}
    </View>
  );

  if (isSwitchRow || !onPress) return content;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      {content}
    </Pressable>
  );
}
