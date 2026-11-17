import { Icon, type IconName } from "@/components/ui/Icon";
import { feedback } from "@/lib/feedback";
import { Pressable, Switch, Text, View } from "react-native";

interface SettingsRowProps {
  icon: IconName;
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
  iconColor = "#008080",
  iconBg = "#DCEEE8",
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
        <Icon
          name={icon}
          size={17}
          color={destructive ? "#E0393E" : iconColor}
        />
      </View>
      <Text
        className="flex-1 text-[13.5px]"
        style={{ color: destructive ? "#E0393E" : "#1C1C1E" }}
      >
        {label}
      </Text>
      {isSwitchRow ? (
        <Switch
          value={switchValue}
          onValueChange={(v) => {
            feedback.tap();
            onSwitchChange?.(v);
          }}
          trackColor={{ false: "#E5E5EA", true: "#008080" }}
        />
      ) : (
        <>
          {!!value && (
            <Text className="mr-1.5 text-[12.5px] text-gray-400">{value}</Text>
          )}
          {!!onPress && (
            <Icon name="chevron-forward" size={16} color="#C7C7CC" />
          )}
        </>
      )}
    </View>
  );

  if (isSwitchRow || !onPress) return content;

  return (
    <Pressable
      onPress={() => {
        feedback.tap();
        onPress();
      }}
    >
      {content}
    </Pressable>
  );
}
