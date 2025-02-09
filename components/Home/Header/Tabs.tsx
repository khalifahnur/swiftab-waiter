import { colors } from "@/constants/Colors";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  View,
} from "react-native";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("All");
  const scrollViewRef = useRef(null);

  const tabs = ["All", "Not served", "Latest", "Served","Paid","Unpaid"];

  const handleTabPress = (tab:string) => {
    setActiveTab(tab);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={({ pressed }) => [
              styles.tab,
              activeTab === tab && styles.activeTab,
              pressed && styles.pressedTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderRadius: 20,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    gap: 8,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 10,
    //backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.activeicon,
  },
  pressedTab: {
    opacity: 0.8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
