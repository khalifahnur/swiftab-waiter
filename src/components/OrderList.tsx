import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import OrderDetailView from "@/components/OrderDetails";
import { getStatusMeta } from "@/constants/orderStatus";
import { useWaiterOrders } from "@/hooks/apihook/orderHook";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderListProps {
  restaurantId?: string;
  tabStatus: string;
  onPressOrder?: (order: any) => void;
}

const PAGE_BG = "#F7F8FA";
const SCREEN_WIDTH = Dimensions.get("window").width;

const EMPTY_COPY: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }
> = {
  "not-taken": {
    icon: "hourglass-outline",
    title: "All caught up",
    body: "New orders will show up here the moment they come in.",
  },
  served: {
    icon: "restaurant-outline",
    title: "Nothing served yet",
    body: "Orders you've served will land here.",
  },
  payment: {
    icon: "wallet-outline",
    title: "No bills waiting",
    body: "Tables ready to pay will appear here.",
  },
  completed: {
    icon: "checkmark-circle-outline",
    title: "No completed tables",
    body: "Finished orders will show up here.",
  },
};

const TAB_LABELS: Record<string, string> = {
  "not-taken": "Not taken",
  served: "Served",
  payment: "Payment due",
  completed: "Completed",
};

const formatCurrency = (amount: number) =>
  `Ksh ${new Intl.NumberFormat("en-KE").format(amount ?? 0)}`;

function timeAgo(dateString?: string | null): string | null {
  if (!dateString) return null;
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateString).getTime()) / 60000),
  );
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

/* -------------------------------------------------------------------------- */
/* Skeleton loading state — mirrors the real ticket card shape so the layout   */
/* doesn't "pop" once data arrives, with a soft light-sweep shimmer.          */
/* -------------------------------------------------------------------------- */

function SkeletonCard() {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View className="bg-white rounded-[22px] border border-gray-100 overflow-hidden mb-3.5">
      <View style={{ height: 4, backgroundColor: "#E5E7EB" }} />

      <View className="px-4 pt-3.5 pb-3.5">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="h-[15px] w-28 rounded-full bg-gray-100 mb-2" />
            <View className="h-[11px] w-20 rounded-full bg-gray-100" />
          </View>
          <View className="h-[22px] w-[76px] rounded-full bg-gray-100" />
        </View>
      </View>

      <View className="h-[1px] bg-gray-100 mx-4" />

      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-4">
        <View className="h-[13px] w-32 rounded-full bg-gray-100" />
        <View className="h-[16px] w-16 rounded-full bg-gray-100" />
      </View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 70,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.65)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal chrome — shared header used by both the iOS page sheet and the       */
/* Android bottom sheet so the two feel like the same component.             */
/* -------------------------------------------------------------------------- */

function SheetHeader({
  onClose,
  showHandle,
}: {
  onClose: () => void;
  showHandle: boolean;
}) {
  return (
    <View>
      {showHandle && (
        <View className="items-center pt-2.5 pb-1">
          <View className="w-9 h-1.5 rounded-full bg-gray-300" />
        </View>
      )}
      <View className="flex-row items-center justify-between px-4 pt-1.5 pb-3">
        <Text className="text-gray-900 text-[17px] font-bold">
          Order details
        </Text>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onClose();
          }}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#374151" />
        </Pressable>
      </View>
      <View className="h-[1px] bg-gray-100" />
    </View>
  );
}

export default function OrderList({
  restaurantId,
  tabStatus,
  onPressOrder,
}: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useWaiterOrders(restaurantId, tabStatus);

  const summary = useMemo(() => {
    if (!orders?.length) return null;
    const total = orders.reduce(
      (sum: number, o: any) => sum + (o.totalAmount ?? 0),
      0,
    );
    return { count: orders.length, total };
  }, [orders]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F7F8FA] px-4 pt-4">
        <View className="h-[60px] rounded-[18px] bg-white border border-gray-100 mb-4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F7F8FA] px-10">
        <View className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-red-50">
          <Ionicons name="cloud-offline-outline" size={28} color="#DC2626" />
        </View>
        <Text className="text-gray-900 text-[16px] font-bold">
          Couldn&apos;t load orders
        </Text>
        <Text
          className="text-gray-500 text-[13.5px] text-center mt-1.5 leading-5"
          style={{ maxWidth: 260 }}
        >
          {error?.message ?? "Check your connection and try again."}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
              () => {},
            );
            refetch();
          }}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
          className="flex-row items-center bg-[#0d9488] px-6 py-3 rounded-full mt-6 active:opacity-90"
        >
          <Ionicons
            name="refresh"
            size={15}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text className="text-white font-bold text-[13.5px]">Try again</Text>
        </Pressable>
      </View>
    );
  }

  const empty = EMPTY_COPY[tabStatus] ?? EMPTY_COPY["not-taken"];

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#0d9488"
          />
        }
        ListHeaderComponent={
          summary ? (
            <View
              className="flex-row items-center justify-between bg-white rounded-[18px] px-4 py-3.5 mb-4"
              style={{
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-2.5"
                  style={{ backgroundColor: "#0d94881A" }}
                >
                  <Ionicons name="receipt-outline" size={16} color="#0d9488" />
                </View>
                <View>
                  <Text className="text-gray-900 text-[15px] font-bold">
                    {summary.count} {summary.count === 1 ? "order" : "orders"}
                  </Text>
                  <Text className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide mt-0.5">
                    {TAB_LABELS[tabStatus] ?? "Orders"}
                  </Text>
                </View>
              </View>
              <Text
                className="text-gray-900 text-[18px] font-extrabold tracking-tight"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {formatCurrency(summary.total)}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const meta = getStatusMeta(item.status ?? tabStatus);
          const ago = timeAgo((item as any).createdAt);

          const tableDisplay = item.tableNumber?.includes("Table")
            ? item.tableNumber
            : `Table ${item.tableNumber || "N/A"}`;

          const customerName = item.userId?.name || "Walk-in";
          const itemCount = item.items?.length || 0;

          return (
            // Shadow lives on this outer wrapper (no overflow clipping here),
            // while the Pressable below clips its rounded corners for the
            // ticket-stub notches and top accent bar.
            <View
              className="mb-3.5"
              style={{
                borderRadius: 22,
                backgroundColor: "#fff",
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.07,
                shadowRadius: 16,
                elevation: 3,
              }}
            >
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setSelectedOrder(item);
                  onPressOrder?.(item);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${tableDisplay}, ${customerName}, ${item.guests} ${item.guests === 1 ? "guest" : "guests"}, ${itemCount} ${itemCount === 1 ? "item" : "items"}, ${meta.label}, total ${formatCurrency(item.totalAmount)}`}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                })}
                className="rounded-[22px] overflow-hidden border border-gray-100"
              >
                {/* Top accent — status color reads at a glance without a full-height bar */}
                <View style={{ height: 4, backgroundColor: meta.accent }} />

                {/* Header: table, customer, guest count, status pill */}
                <View className="px-4 pt-3.5 pb-3.5">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-3">
                      <Text className="text-[17px] font-bold text-gray-900 mb-0.5">
                        {tableDisplay}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="person-circle-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text
                          className="text-[13px] text-gray-500 ml-1 font-medium capitalize"
                          numberOfLines={1}
                        >
                          {customerName}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-gray-300 mx-1.5" />
                        <Ionicons
                          name="people-outline"
                          size={13}
                          color="#9CA3AF"
                        />
                        <Text className="text-[13px] text-gray-500 ml-1 font-medium">
                          {item.guests}
                        </Text>
                      </View>
                    </View>

                    <View
                      className="flex-row items-center px-2.5 py-1.5 rounded-full"
                      style={{ backgroundColor: meta.pale }}
                    >
                      <Ionicons name={meta.icon} size={12} color={meta.ink} />
                      <Text
                        className="text-[11px] font-bold ml-1 uppercase tracking-wider"
                        style={{ color: meta.ink }}
                      >
                        {meta.label}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Ticket-stub seam: dashed perforation with punched-out notches */}
                <View style={{ height: 1 }}>
                  <View
                    style={{
                      position: "absolute",
                      left: -10,
                      top: -9,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: PAGE_BG,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: -10,
                      top: -9,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: PAGE_BG,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 16,
                      right: 16,
                      top: 0,
                      borderTopWidth: 1.5,
                      borderStyle: "dashed",
                      borderColor: "#E2E5EA",
                    }}
                  />
                </View>

                {/* Footer: item count, elapsed time, total, chevron */}
                <View className="flex-row items-center justify-between px-4 pt-3.5 pb-4">
                  <View className="flex-row items-center flex-1 pr-2">
                    <Ionicons
                      name="restaurant-outline"
                      size={14}
                      color="#9CA3AF"
                    />
                    <Text
                      className="text-gray-500 text-[13px] font-medium ml-1.5"
                      numberOfLines={1}
                    >
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                      {ago && (
                        <>
                          <Text className="text-gray-300"> · </Text>
                          {ago}
                        </>
                      )}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text
                      className="text-gray-900 text-[16px] font-extrabold tracking-tight"
                      style={{ fontVariant: ["tabular-nums"] }}
                    >
                      {formatCurrency(item.totalAmount)}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#D1D5DB"
                      style={{ marginLeft: 2, marginTop: 1 }}
                    />
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-24 px-10">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-5"
              style={{ backgroundColor: "#0d94881A" }}
            >
              <View
                className="w-14 h-14 rounded-full bg-white items-center justify-center"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                <Ionicons name={empty.icon} size={26} color="#0d9488" />
              </View>
            </View>
            <Text className="text-gray-900 text-[16px] font-bold">
              {empty.title}
            </Text>
            <Text
              className="text-gray-500 text-[13.5px] text-center mt-1.5 leading-5"
              style={{ maxWidth: 240 }}
            >
              {empty.body}
            </Text>
          </View>
        }
      />

      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent={Platform.OS === "android"}
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={() => setSelectedOrder(null)}
      >
        {Platform.OS === "android" ? (
          // Android has no native page-sheet presentation, so we fake a
          // bottom sheet: dimmed scrim (tap to dismiss) + rounded card.
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
          >
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={() => setSelectedOrder(null)}
            />
            <View
              className="bg-[#F7F8FA] overflow-hidden"
              style={{
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                maxHeight: "92%",
              }}
            >
              <SafeAreaView edges={["bottom"]}>
                <SheetHeader
                  onClose={() => setSelectedOrder(null)}
                  showHandle
                />
                {selectedOrder && (
                  <OrderDetailView
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                  />
                )}
              </SafeAreaView>
            </View>
          </View>
        ) : (
          // iOS gets the native page-sheet: rounded top corners and
          // swipe-to-dismiss come for free, we just add our own header.
          <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F8FA]">
            <SheetHeader onClose={() => setSelectedOrder(null)} showHandle />
            {selectedOrder && (
              <OrderDetailView
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </SafeAreaView>
        )}
      </Modal>
    </View>
  );
}
