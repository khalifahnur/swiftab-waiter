import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LegalScreen() {
  const insets = useSafeAreaInsets();

  const handleDeletionRequest = () => {
    Linking.openURL("https://www.swiftab.co.ke/data-deletion").catch(() => {
      Alert.alert(
        "Error",
        "Could not open the webpage. Please visit swiftab.co.ke/data-deletion in your browser.",
      );
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center px-5 pb-4 bg-white border-b border-gray-100 z-10 shadow-sm"
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </Pressable>
        <Text className="ml-4 text-[19px] font-bold text-gray-900 tracking-tight">
          Legal & Privacy
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-gray-400 text-[13px] font-bold tracking-widest uppercase mb-2">
          Last Updated: July 2026
        </Text>
        <Text className="text-[32px] font-black text-gray-900 mb-8 tracking-tight">
          Terms of Service
        </Text>

        {/* Section 1 */}
        <Text className="text-[19px] font-extrabold text-gray-900 mb-3">
          1. Platform Usage
        </Text>
        <Text className="text-[16px] text-gray-600 leading-7 mb-8">
          By using the Swiftab Waiter application, you agree to handle customer
          data, including order details and table assignments, responsibly. The
          application is strictly for restaurant staff and authorized personnel.
        </Text>

        {/* Section 2 */}
        <Text className="text-[19px] font-extrabold text-gray-900 mb-3">
          2. Account Security
        </Text>
        <Text className="text-[16px] text-gray-600 leading-7 mb-10">
          You are responsible for maintaining the confidentiality of your login
          credentials. Do not share your account access with unauthorized
          individuals. Swiftab reserves the right to suspend accounts exhibiting
          suspicious activity.
        </Text>

        {/* Divider */}
        <View className="h-[1px] bg-gray-200 w-full mb-10" />

        {/* Privacy Policy */}
        <Text className="text-[32px] font-black text-gray-900 mb-8 tracking-tight">
          Privacy Policy
        </Text>

        <Text className="text-[19px] font-extrabold text-gray-900 mb-3">
          Data Collection
        </Text>
        <Text className="text-[16px] text-gray-600 leading-7 mb-8">
          We collect basic profile information (Name, Phone Number) to identify
          you within your restaurant's system. Order processing data is logged
          to ensure accurate restaurant analytics and performance tracking.
        </Text>

        <Text className="text-[19px] font-extrabold text-gray-900 mb-3">
          Information Sharing
        </Text>
        <Text className="text-[16px] text-gray-600 leading-7 mb-10">
          Your personal details are securely stored and only accessible by your
          restaurant administrators. We do not sell, rent, or share your
          personal data with third-party advertising services.
        </Text>

        {/* Divider */}
        <View className="h-[1px] bg-gray-200 w-full mb-10" />

        {/* Data Deletion Section */}
        <Text className="text-[32px] font-black text-gray-900 mb-6 tracking-tight">
          Account Deletion
        </Text>
        <Text className="text-[16px] text-gray-600 leading-7 mb-6">
          If you wish to permanently delete your account and associated personal
          data from Swiftab's servers, you can submit a formal deletion request
          using the link below.
        </Text>

        <Pressable
          onPress={handleDeletionRequest}
          className="flex-row items-center p-5 bg-red-50 rounded-2xl border border-red-100 active:bg-red-100"
        >
          <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mr-4">
            <Ionicons name="trash-outline" size={22} color="#DC2626" />
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-[17px] font-bold text-red-800 mb-0.5">
              Request Data Deletion
            </Text>
            <Text className="text-[14px] text-red-600/80" numberOfLines={1}>
              swiftab.co.ke/data-deletion
            </Text>
          </View>
          <Ionicons name="open-outline" size={20} color="#F87171" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
