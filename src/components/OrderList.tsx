import OrderDetailView, { type Order } from "@/components/OrderDetails";
import { getStatusMeta } from "@/constants/orderStatus";
import { useWaiterOrders } from "@/hooks/apihook/orderHook";
import Ionicons from "@react-native-vector-icons/ionicons";
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
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OrderListProps {
  restaurantId?: string;
  tabStatus: string;
  onPressOrder?: (order: Order) => void;
  onTabChange?: (tab: string) => void;
}

const COLORS = {
  paper: "#F2E8D6",
  card: "#FBF6EA",
  cardBorder: "#E7DAB8",
  ink: "#2B2621",
  inkMuted: "#8C8171",
  skeleton: "#E9DFC5",
  accent: "#008080",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const TABS = [
  { id: "not-taken", label: "New" },
  { id: "served", label: "Served" },
  { id: "payment", label: "Payment" },
  { id: "completed", label: "Done" },
];

const EMPTY_COPY: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }
> = {
  "not-taken": {
    icon: "time-outline",
    title: "All caught up",
    body: "New orders will show up here.",
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

const currencyFormatter = new Intl.NumberFormat("en-KE");
const formatCurrency = (amount?: number) =>
  `Ksh ${currencyFormatter.format(amount ?? 0)}`;

const toTitleCase = (value: string) =>
  value.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

function getTableDisplay(tableNumber: unknown) {
  const raw = String(tableNumber ?? "").trim() || "N/A";
  return raw.replace(/^table\s*/i, "") || raw;
}

// Fixed a latent bug here: this used to read `item.createdAt`, a field the
// order documents don't actually have (they use `time`), so the "X ago"
// label was silently never showing.
function timeAgo(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View
            style={[
              styles.skeletonBlock,
              { height: 18, width: 100, marginBottom: 8 },
            ]}
          />
          <View style={[styles.skeletonBlock, { height: 13, width: 70 }]} />
        </View>
        <View
          style={[
            styles.skeletonBlock,
            { height: 23, width: 64, borderRadius: 8 },
          ]}
        />
      </View>
      <View style={styles.cardFooter}>
        <View style={[styles.skeletonBlock, { height: 13, width: 90 }]} />
        <View style={[styles.skeletonBlock, { height: 18, width: 56 }]} />
      </View>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={[
            "rgba(251,246,234,0)",
            "rgba(251,246,234,0.85)",
            "rgba(251,246,234,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

export default function OrderList({
  restaurantId,
  tabStatus,
  onPressOrder,
}: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const insets = useSafeAreaInsets();

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
      (sum: number, o: Order) => sum + (o.totalAmount ?? 0),
      0,
    );
    return { count: orders.length, total };
  }, [orders]);

  if (isError) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Ionicons
          name="cloud-offline"
          size={40}
          color={COLORS.inkMuted}
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.errorTitle}>Couldn't load orders</Text>
        <Text style={styles.errorBody}>
          {error?.message ?? "Check your connection and try again."}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            refetch();
          }}
          style={({ pressed }) => [
            styles.retryButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const empty = EMPTY_COPY[tabStatus] ?? EMPTY_COPY["not-taken"];

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <FlatList<Order>
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={COLORS.accent}
            />
          }
          ListHeaderComponent={
            summary ? (
              <View style={styles.summaryBox}>
                <View>
                  <Text style={styles.summaryCount}>
                    {summary.count} {summary.count === 1 ? "order" : "orders"}
                  </Text>
                  <Text style={styles.summaryLabel}>
                    {TABS.find((t) => t.id === tabStatus)?.label ?? "Orders"}
                  </Text>
                </View>
                <Text style={styles.summaryTotal}>
                  {formatCurrency(summary.total)}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const meta = getStatusMeta(item.status ?? tabStatus);
            const ago = timeAgo(item.time);
            const tableDisplay = getTableDisplay(item.tableNumber);
            const customerName = item.userId?.name
              ? toTitleCase(item.userId.name)
              : "Walk-in";
            const itemCount = item.items?.length || 0;

            return (
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedOrder(item);
                  onPressOrder?.(item);
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    borderLeftColor: meta.ink,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.tableText}>Table {tableDisplay}</Text>
                    <Text style={styles.metaText}>
                      {customerName} · {item.guests}{" "}
                      {item.guests === 1 ? "Guest" : "Guests"}
                    </Text>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: meta.pale }]}
                  >
                    <Ionicons name={meta.icon} size={11} color={meta.ink} />
                    <Text style={[styles.statusText, { color: meta.ink }]}>
                      {meta.label}-{" "}
                      {tabStatus == "payment" && item.paymentMethod}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                    {ago ? ` · ${ago}` : ""}
                  </Text>
                  <View style={styles.footerRight}>
                    <Text style={styles.priceText}>
                      {formatCurrency(item.totalAmount)}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={COLORS.inkMuted}
                    />
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name={empty.icon} size={32} color={COLORS.inkMuted} />
              </View>
              <Text style={styles.emptyTitle}>{empty.title}</Text>
              <Text style={styles.emptyBody}>{empty.body}</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent={Platform.OS === "android"}
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <OrderDetailView
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.paper,
    padding: 24,
  },

  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  summaryCount: { fontSize: 17, fontWeight: "700", color: COLORS.ink },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.inkMuted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.ink,
    fontVariant: ["tabular-nums"],
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderLeftWidth: 4,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#3A2E1E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
  },
  tableText: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 3,
  },
  metaText: { fontSize: 14, color: COLORS.inkMuted, fontWeight: "500" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.cardBorder,
  },
  footerText: { fontSize: 13, color: COLORS.inkMuted, fontWeight: "500" },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.ink,
    fontVariant: ["tabular-nums"],
  },

  skeletonBlock: { backgroundColor: COLORS.skeleton, borderRadius: 6 },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 14,
    color: COLORS.inkMuted,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
