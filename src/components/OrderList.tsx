import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Easing, FlatList, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

import { errorMessage } from "@/api/client";
import OrderDetailView from "@/components/OrderDetails";
import { getStatusMeta, TABS } from "@/constants/orderStatus";
import { C } from "@/constants/theme";
import { useOrders } from "@/hooks/queries";
import { feedback } from "@/lib/feedback";
import { formatKes, paymentLabel, tableLabel, timeAgo, titleCase } from "@/lib/format";
import type { Order, OrderTab } from "@/types";

const SCREEN_WIDTH = Dimensions.get("window").width;

function SkeletonCard() {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(sweep, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const translateX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH] });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View style={[styles.skeletonBlock, { height: 18, width: 100, marginBottom: 8 }]} />
          <View style={[styles.skeletonBlock, { height: 13, width: 70 }]} />
        </View>
        <View style={[styles.skeletonBlock, { height: 23, width: 64, borderRadius: 8 }]} />
      </View>
      <View style={styles.cardFooter}>
        <View style={[styles.skeletonBlock, { height: 13, width: 90 }]} />
        <View style={[styles.skeletonBlock, { height: 18, width: 56 }]} />
      </View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={["rgba(251,246,234,0)", "rgba(251,246,234,0.85)", "rgba(251,246,234,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

/** One queue of orders. Refreshes on its own; pull down to refresh now. */
export default function OrderList({ tab }: { tab: OrderTab }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { data: orders, isLoading, isError, error, refetch } = useOrders(tab);

  // Follow the selected order as the list refreshes; close the sheet when it leaves this queue.
  const selected = useMemo(() => orders?.find((o) => o._id === selectedId) ?? null, [orders, selectedId]);

  const summary = useMemo(() => {
    if (!orders?.length) return null;
    return { count: orders.length, total: orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0) };
  }, [orders]);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isError && !orders) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline" size={40} color={C.inkMuted} style={{ marginBottom: 12 }} />
        <Text style={styles.errorTitle}>Could not load orders</Text>
        <Text style={styles.errorBody}>{errorMessage(error, "Check your connection and try again.")}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            feedback.press();
            refetch();
          }}
          style={({ pressed }) => [styles.retryButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const meta = TABS.find((t) => t.id === tab) ?? TABS[0];

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
          testID={`orders-${tab}`}
          data={orders ?? []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.accent} colors={[C.accent]} />}
          ListHeaderComponent={
            summary ? (
              <View style={styles.summaryBox}>
                <View>
                  <Text style={styles.summaryCount}>
                    {summary.count} {summary.count === 1 ? "order" : "orders"}
                  </Text>
                  <Text style={styles.summaryLabel}>{meta.label}</Text>
                </View>
                <Text style={styles.summaryTotal}>{formatKes(summary.total)}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const status = getStatusMeta(item.status);
            const ago = timeAgo(item.time);
            const customer = item.userId?.name ? titleCase(item.userId.name) : "Walk-in";
            const guests = item.guests ?? 0;
            const itemCount = item.items.reduce((sum, line) => sum + (line.quantity || 1), 0);
            const paidWith = paymentLabel(item.paymentMethod);

            return (
              <Pressable
                testID={`order-${item._id}`}
                accessibilityRole="button"
                accessibilityLabel={`Table ${tableLabel(item.tableNumber)}, ${status.label}, ${formatKes(item.totalAmount)}`}
                onPress={() => {
                  feedback.tap();
                  setSelectedId(item._id);
                }}
                style={({ pressed }) => [styles.card, { borderLeftColor: status.ink, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.tableText}>Table {tableLabel(item.tableNumber)}</Text>
                    <Text style={styles.metaText} numberOfLines={1}>
                      {customer}
                      {guests > 0 ? ` · ${guests} ${guests === 1 ? "guest" : "guests"}` : ""}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.pale }]}>
                    <Ionicons name={status.icon} size={11} color={status.ink} />
                    <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
                  </View>
                </View>

                {!!paidWith && (
                  <View style={payStyles.row}>
                    <Ionicons name="wallet-outline" size={13} color={C.inkMuted} />
                    <Text style={payStyles.text}>
                      {item.status === "completed" ? "Paid with" : "Paying with"} {paidWith}
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                    {ago ? ` · ${ago}` : ""}
                  </Text>
                  <View style={styles.footerRight}>
                    <Text style={styles.priceText}>{formatKes(item.totalAmount)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={C.inkMuted} />
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name={meta.empty.icon} size={32} color={C.inkMuted} />
              </View>
              <Text style={styles.emptyTitle}>{meta.empty.title}</Text>
              <Text style={styles.emptyBody}>{meta.empty.body}</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={Boolean(selected)}
        animationType="slide"
        transparent={Platform.OS !== "ios"}
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={() => setSelectedId(null)}
      >
        {selected && <OrderDetailView order={selected} onClose={() => setSelectedId(null)} />}
      </Modal>
    </View>
  );
}

const payStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  text: { fontSize: 13, fontWeight: "600", color: C.inkMuted },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.paper },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.paper,
    padding: 24,
  },

  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  summaryCount: { fontSize: 17, fontWeight: "700", color: C.ink },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.inkMuted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "800",
    color: C.ink,
    fontVariant: ["tabular-nums"],
  },

  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
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
    color: C.ink,
    marginBottom: 3,
  },
  metaText: { fontSize: 14, color: C.inkMuted, fontWeight: "500" },
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
    borderTopColor: C.cardBorder,
  },
  footerText: { fontSize: 13, color: C.inkMuted, fontWeight: "500" },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    fontVariant: ["tabular-nums"],
  },

  skeletonBlock: { backgroundColor: C.skeleton, borderRadius: 6 },

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
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 14,
    color: C.inkMuted,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    color: C.inkMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: C.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
