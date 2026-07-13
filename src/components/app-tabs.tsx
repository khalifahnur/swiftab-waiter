import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#F2E8D6"
      indicatorColor="#0d9488"
      labelStyle={{
        selected: { color: "#0d9488" },
        unselected: { color: "#6b7280" },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
