import { NativeTabs } from "expo-router/unstable-native-tabs";

import { C } from "@/constants/theme";
import { useSummary } from "@/hooks/queries";

/** The three sections of the app, with a badge for orders nobody has taken yet. */
export default function AppTabs() {
  const { data: summary } = useSummary();
  const waiting = (summary?.queues["not-taken"] ?? 0) + (summary?.queues.payment ?? 0);

  return (
    <NativeTabs
      backgroundColor={C.paper}
      indicatorColor={C.accentPale}
      tintColor={C.accent}
      labelStyle={{ default: { color: "#6b7280" }, selected: { color: C.accent } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "list.clipboard", selected: "list.clipboard.fill" }} md="receipt_long" />
        {waiting > 0 && <NativeTabs.Trigger.Badge>{waiting > 9 ? "9+" : String(waiting)}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="floor">
        <NativeTabs.Trigger.Label>Floor</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }} md="table_restaurant" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
