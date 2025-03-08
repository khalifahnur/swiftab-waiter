import React, { useLayoutEffect, useState } from "react";
import FAQsScreen from "@/components/FaqScreen";
import CustomerCareScreen from "@/components/CustomerCareScreen";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpCenterScreen = () => {
  const [activeTab, setActiveTab] = useState("Faqs");
  const navigate = useNavigation();
  useLayoutEffect(() => {
    navigate.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Faqs" && styles.activeTab]}
          onPress={() => setActiveTab("Faqs")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Faqs" && styles.activeTabText,
            ]}
          >
            FAQs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Customercare" && styles.activeTab]}
          onPress={() => setActiveTab("Customercare")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Customercare" && styles.activeTabText,
            ]}
          >
            Customer Care
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === "Faqs" ? <FAQsScreen /> : <CustomerCareScreen />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  tab: {
    paddingVertical: 16,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#3498db",
  },
  tabText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3498db",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default HelpCenterScreen;
