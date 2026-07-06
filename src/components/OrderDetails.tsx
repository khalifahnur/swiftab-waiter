import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useUpdateOrderStatus } from "@/hooks/apihook/orderHook";
import { useAuthStore } from "@/store/useAuthStore";

export default function OrderDetailView({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  const waiterData = useAuthStore((state) => state.waiterData);
  const waiterId = waiterData?.waiter?._id;

  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleServeOrder = () => {
    if (!waiterId) {
      Alert.alert(
        "Error",
        "Could not verify your Waiter ID. Please log in again.",
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    updateStatus(
      {
        orderId: order._id,
        status: "served",
        servedBy: waiterId,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const formatCurrency = (amount: number) =>
    `Ksh ${new Intl.NumberFormat("en-KE").format(amount ?? 0)}`;

  const tableDisplay = order.tableNumber?.includes("Table")
    ? order.tableNumber
    : `Table ${order.tableNumber || "N/A"}`;

  return (
    <View className="flex-1 justify-end">
      {/* 1. Blurred Backdrop (Tappable to close) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView
          intensity={40}
          tint="dark"
          style={StyleSheet.absoluteFill}
          className="bg-black/30"
        />
      </Pressable>
      <View className="bg-[#F7F8FA] w-full rounded-t-[32px] pt-3 px-2 pb-8 max-h-[85%] shadow-2xl">
        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

        <View className="px-5 flex-1">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
            <Text className="text-[32px] font-black text-gray-900 mb-1 tracking-tight">
              {tableDisplay}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons
                name="person-circle-outline"
                size={18}
                color="#6B7280"
              />
              <Text className="text-gray-500 text-[17px] font-medium ml-1.5 capitalize">
                {order.userId?.name || "Walk-in"} • {order.guests} Guests
              </Text>
            </View>
          </View>

          <Text className="text-[15px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-2">
            Order Items
          </Text>

          {/* 4. Items List (Bigger Fonts & Better Spacing) */}
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-shrink">
            <FlatList
              data={order.items}
              keyExtractor={(item) => item._id}
              contentContainerClassName="p-2"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View className="h-[1px] bg-gray-100 mx-5" />
              )}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between p-5">
                  <View className="flex-row items-center flex-1 pr-4">
                    <View className="w-10 h-10 rounded-xl bg-teal-50 items-center justify-center mr-4 border border-teal-100">
                      <Text className="text-teal-700 font-black text-[17px]">
                        {item.quantity}x
                      </Text>
                    </View>
                    <Text className="text-[18px] font-bold text-gray-900 flex-1 leading-6">
                      {item.name}
                    </Text>
                  </View>

                  <Text className="text-[18px] font-black text-gray-800 tabular-nums">
                    {formatCurrency(item.cost * item.quantity)}
                  </Text>
                </View>
              )}
            />
            <View className="bg-gray-50 p-6 flex-row justify-between items-center border-t border-gray-200">
              <Text className="text-gray-500 font-extrabold text-[18px] uppercase tracking-wider">
                Total
              </Text>
              <Text className="text-teal-600 font-black text-[28px] tabular-nums tracking-tight">
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
          </View>

          {order.status === "placed" && (
            <View className="pt-6">
              <Pressable
                onPress={handleServeOrder}
                disabled={isPending}
                className={`h-[64px] flex-row items-center justify-center rounded-2xl active:opacity-90 shadow-sm ${
                  isPending ? "bg-teal-400" : "bg-teal-600"
                }`}
              >
                {isPending ? (
                  <ActivityIndicator color="#ffffff" size="large" />
                ) : (
                  <>
                    <Ionicons name="restaurant" size={24} color="#ffffff" />
                    <Text className="text-white text-[20px] font-black ml-3">
                      Accept & Serve
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
