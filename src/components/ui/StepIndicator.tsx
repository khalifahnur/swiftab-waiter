import React from "react";
import { Text, View } from "react-native";

const ACTIVE = "#008080";
const INACTIVE = "#E5E5EA";

const STEP_LABELS = ["Restaurant", "Password"];

export function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <View className="mb-7">
      <View className="flex-row items-center">
        {[1, 2].map((s, i) => (
          <React.Fragment key={s}>
            <View
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: step >= s ? ACTIVE : INACTIVE }}
            >
              <Text
                className="text-[13px] font-semibold"
                style={{ color: step >= s ? "#fff" : "#9A9AA0" }}
              >
                {s}
              </Text>
            </View>
            {i === 0 && (
              <View
                className="mx-2 h-[2px] flex-1"
                style={{ backgroundColor: step >= 2 ? ACTIVE : INACTIVE }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <View className="mt-1.5 flex-row justify-between">
        <Text
          className="text-[11px] font-medium"
          style={{ color: step >= 1 ? ACTIVE : "#9A9AA0" }}
        >
          {STEP_LABELS[0]}
        </Text>
        <Text
          className="text-[11px] font-medium"
          style={{ color: step >= 2 ? ACTIVE : "#9A9AA0" }}
        >
          {STEP_LABELS[1]}
        </Text>
      </View>
    </View>
  );
}
