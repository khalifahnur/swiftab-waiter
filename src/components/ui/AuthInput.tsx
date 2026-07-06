import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  secure?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

const INK = "#1C1C1E";
const HAIRLINE = "#E5E5EA";
const DANGER = "#E0393E";
const MUTED = "#9A9AA0";

export function AuthInput({
  label,
  error,
  secure,
  leftIcon,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  const borderColor = error ? DANGER : focused ? INK : HAIRLINE;

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[13px] font-medium text-gray-500">
        {label}
      </Text>
      <View
        className="flex-row items-center rounded-xl bg-gray-50 px-3.5"
        style={{ borderWidth: 1.5, borderColor, height: 52 }}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={MUTED}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={MUTED}
          className="flex-1 text-[15px] text-gray-900"
          style={{ paddingVertical: 0 }}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={19}
              color={MUTED}
            />
          </Pressable>
        )}
      </View>
      {!!error && (
        <Text className="mt-1 text-[12px]" style={{ color: DANGER }}>
          {error}
        </Text>
      )}
    </View>
  );
}
