import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { errorMessage } from "@/api/client";
import { useSetDuty, useSummary } from "@/hooks/queries";
import { feedback } from "@/lib/feedback";
import { clock, elapsed } from "@/lib/format";
import { notify } from "@/lib/toast";
import { useWaiter } from "@/store/useAuthStore";

/** Clock in and out. The manager sees who is on duty in the dashboard. */
export function DutyStatusCard() {
  const waiter = useWaiter();
  const { data: summary } = useSummary();
  const duty = useSetDuty();

  const onDuty = summary?.onDuty ?? waiter?.onDuty ?? false;
  const since = summary?.dutyStartedAt ?? waiter?.dutyStartedAt;

  // Keep the "on shift for" label moving.
  const [, tick] = useState(0);
  useEffect(() => {
    if (!onDuty) return;
    const id = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [onDuty]);

  const toggle = () => {
    feedback.press();
    duty.mutate(!onDuty, {
      onSuccess: (result) => notify.success(result.onDuty ? "You are on duty" : "You are off duty"),
      onError: (error) => notify.error("Could not update your status", errorMessage(error)),
    });
  };

  return (
    <View className="mb-6 flex-row items-center justify-between rounded-2xl px-4 py-4" style={{ backgroundColor: onDuty ? "#0B3B36" : "#FBF6EA", borderWidth: 1, borderColor: onDuty ? "#0B3B36" : "#E7DAB8" }}>
      <View className="flex-1 flex-row items-center">
        <View className="mr-3 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: onDuty ? "#30D158" : "#9A9AA0" }} />
        <View className="flex-1">
          <Text className="text-[13.5px] font-semibold" style={{ color: onDuty ? "#fff" : "#2B2621" }}>
            {onDuty ? "On duty" : "Off duty"}
          </Text>
          <Text className="mt-0.5 text-[12px]" style={{ color: onDuty ? "#9FD6C9" : "#8C8171" }}>
            {onDuty && since ? `Since ${clock(since)} · ${elapsed(since)}` : "Clock in when your shift starts"}
          </Text>
        </View>
      </View>

      <Pressable
        testID="clock-toggle"
        accessibilityRole="button"
        accessibilityLabel={onDuty ? "Clock out" : "Clock in"}
        disabled={duty.isPending}
        onPress={toggle}
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: onDuty ? "#30D158" : "#008080", opacity: duty.isPending ? 0.6 : 1 }}
      >
        <Text className="text-[11.5px] font-semibold text-white">{onDuty ? "Clock out" : "Clock in"}</Text>
      </Pressable>
    </View>
  );
}
