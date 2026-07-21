import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SupportScreen() {
  const insets = useSafeAreaInsets();

  const handleCall = () => Linking.openURL("tel:+254700000000");
  const handleEmail = () => Linking.openURL("mailto:support@swiftab.com");

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center px-5 pb-4 bg-white border-b border-gray-100"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </Pressable>
        <Text className="ml-4 text-[19px] font-bold text-gray-900 tracking-tight">
          Help & Support
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-[28px] font-black text-gray-900 mb-2 tracking-tight">
          How can we help?
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8 leading-6">
          If you are experiencing issues with orders or your account, our
          support team is available 24/7.
        </Text>

        <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
          Contact Methods
        </Text>

        {/* Contact Cards */}
        <View className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm mb-8">
          <Pressable
            onPress={handleCall}
            className="flex-row items-center p-5 border-b border-gray-50 active:bg-gray-50"
          >
            <View className="w-12 h-12 rounded-2xl bg-teal-50 items-center justify-center mr-4">
              <Ionicons name="call" size={22} color="#008080" />
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-gray-900 mb-0.5">
                Call Support
              </Text>
              <Text className="text-[14px] text-gray-500">
                Immediate assistance
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </Pressable>

          <Pressable
            onPress={handleEmail}
            className="flex-row items-center p-5 active:bg-gray-50"
          >
            <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-4">
              <Ionicons name="mail" size={22} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-gray-900 mb-0.5">
                Email Us
              </Text>
              <Text className="text-[14px] text-gray-500">
                support@swiftab.com
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
