import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { usePrefs } from "@/store/usePrefs";

const on = () => Platform.OS !== "web" && usePrefs.getState().hapticsEnabled;

/** Haptics that respect the waiter's preference (and do nothing on web). */
export const feedback = {
  tap: () => on() && Haptics.selectionAsync().catch(() => undefined),
  press: () => on() && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined),
  success: () => on() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined),
  warning: () => on() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined),
  error: () => on() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined),
};
