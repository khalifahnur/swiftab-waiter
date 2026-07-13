import {
  useCompleteOrder,
  useUpdateOrderStatus,
} from "@/hooks/apihook/orderHook";
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthButton } from "./ui/AuthButton";

export interface OrderItem {
  _id: string;
  name: string;
  cost: number;
  quantity: number;
}

export interface OrderCustomer {
  _id: string;
  name: string;
  phoneNumber?: string;
}

// Widened string unions: autocomplete for known values, but a new status
// string from the API won't blow up type-checking.
export type OrderStatus =
  | "placed"
  | "not-taken"
  | "served"
  | "ready_to_pay"
  | "completed"
  | (string & {});

export type PaymentStatus = "paid" | "unpaid" | (string & {});

export interface Order {
  _id: string;
  guests: number;
  items: OrderItem[];
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  tableNumber: string;
  time: string;
  totalAmount: number;
  userId?: OrderCustomer;
}

const COLORS = {
  paper: "#F2E8D6",
  card: "#FBF6EA",
  cardBorder: "#E7DAB8",
  ink: "#2B2621",
  inkMuted: "#8C8171",
  divider: "#DED0AC",
  accent: "#008080",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; ink: string; paper: string }
> = {
  placed: { label: "New Order", ink: "#B4530F", paper: "#FBE9CE" },
  "not-taken": { label: "New Order", ink: "#B4530F", paper: "#FBE9CE" },
  served: { label: "Served", ink: "#0F6E63", paper: "#DCEEE8" },
  ready_to_pay: { label: "Bill Requested", ink: "#B0413E", paper: "#FAE3DF" },
  completed: { label: "Completed", ink: "#3F7D45", paper: "#E4F0DE" },
};
const DEFAULT_STAMP = {
  label: "Order",
  ink: COLORS.inkMuted,
  paper: "#EFE7D2",
};

const MONO_FONT = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const PERF_DOTS = Array.from({ length: 24 });

const currencyFormatter = new Intl.NumberFormat("en-KE");
const formatCurrency = (amount?: number) =>
  `Ksh ${currencyFormatter.format(amount ?? 0)}`;

const toTitleCase = (value: string) =>
  value.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

function formatOrderTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const clock = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffMin < 60 * 24) return `${Math.round(diffMin / 60)} hr ago · ${clock}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${clock}`;
}

function StatusStamp({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? DEFAULT_STAMP;
  return (
    <View
      style={[
        styles.stamp,
        { borderColor: cfg.ink, backgroundColor: cfg.paper },
      ]}
    >
      <Text style={[styles.stampText, { color: cfg.ink }]}>{cfg.label}</Text>
    </View>
  );
}

function PerforatedRule() {
  return (
    <View style={styles.perfRow} pointerEvents="none">
      {PERF_DOTS.map((_, i) => (
        <View key={i} style={styles.perfDot} />
      ))}
    </View>
  );
}

export default function OrderDetailView({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const waiterData = useAuthStore((state) => state.waiterData);
  const waiterId = waiterData?.waiter?._id;
  const { mutateAsync: updateStatusAsync, isPending: isServing } =
    useUpdateOrderStatus();
  const { mutateAsync: completeOrderAsync, isPending: isCompleting } =
    useCompleteOrder();

  const handleServeOrder = async () => {
    if (!waiterId) {
      Alert.alert(
        "Error",
        "Could not verify your Waiter ID. Please log in again.",
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await updateStatusAsync({
        orderId: order._id,
        orderStatus: "served",
        servedBy: waiterId,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.log("Order update failed:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Couldn't update the order",
        text2: "Please try again.",
      });
    }
  };

  const handleCompleteOrder = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await completeOrderAsync({
        orderId: order._id,
        status: "completed",
        paymentStatus: "paid",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.log("Order completion failed:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Couldn't complete the order",
        text2: "Please try again.",
      });
    }
  };

  const handleCall = () => {
    const phone = order.userId?.phoneNumber;
    if (!phone) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
      Alert.alert(
        "Unable to place call",
        "Please check the number and try again.",
      );
    });
  };

  const tableRaw = String(order.tableNumber ?? "").trim() || "N/A";
  const tableDisplayNumber = tableRaw.replace(/^table\s*/i, "") || tableRaw;
  const shortId = order._id ? order._id.slice(-6).toUpperCase() : "------";
  const isPaid = order.paymentStatus === "paid";
  const guestCount = order.guests ?? 0;
  const customerName = order.userId?.name
    ? toTitleCase(order.userId.name)
    : "Walk-in";

  const renderItems = () => {
    if (!order.items?.length) {
      return <Text style={styles.emptyText}>No items on this order</Text>;
    }
    return order.items.map((item) => (
      <View key={item._id} style={styles.itemRow}>
        <Text style={styles.itemQty}>{item.quantity}×</Text>
        <Text style={styles.itemName} numberOfLines={2}>
          {toTitleCase(item.name)}
        </Text>
        <Text style={styles.itemPrice}>
          {formatCurrency(item.cost * item.quantity)}
        </Text>
      </View>
    ));
  };

  const renderFooter = () => {
    if (order.status === "placed" || order.status === "not-taken") {
      return (
        <View style={styles.footer}>
          <AuthButton
            label="Accept & Serve"
            onPress={handleServeOrder}
            loading={isServing}
          />
        </View>
      );
    }
    if (order.status === "ready_to_pay") {
      return (
        <View style={styles.footer}>
          <AuthButton
            label="Process Payment & Close"
            onPress={handleCompleteOrder}
            loading={isCompleting}
          />
        </View>
      );
    }
    if (order.status === "served") {
      return (
        <View style={[styles.footer, styles.footerNote]}>
          <Ionicons
            name="restaurant-outline"
            size={16}
            color={COLORS.inkMuted}
          />
          <Text style={styles.footerNoteText}>
            Served — awaiting bill request
          </Text>
        </View>
      );
    }
    if (order.status === "completed") {
      return (
        <View style={[styles.footer, styles.footerNote]}>
          <Ionicons name="checkmark-circle" size={16} color="#3F7D45" />
          <Text style={styles.footerNoteText}>Order completed</Text>
        </View>
      );
    }
    return null;
  };

  const renderContent = () => (
    <View style={styles.sheetContent}>
      {Platform.OS === "android" && <View style={styles.handle} />}

      <View style={styles.topBar}>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close order details"
          style={({ pressed }) => [
            styles.closeCircle,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Ionicons name="close" size={18} color={COLORS.ink} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticket}>
          <View style={[styles.notch, styles.notchLeft]} />
          <View style={[styles.notch, styles.notchRight]} />

          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.kicker}>TABLE</Text>
              <Text style={styles.tableNumber}>{tableDisplayNumber}</Text>
            </View>
            <StatusStamp status={order.status} />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons
                name="people-outline"
                size={13}
                color={COLORS.inkMuted}
              />
              <Text style={styles.metaChipText}>
                {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={13} color={COLORS.inkMuted} />
              <Text style={styles.metaChipText}>
                {formatOrderTime(order.time)}
              </Text>
            </View>
          </View>

          <View style={styles.customerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>GUEST</Text>
              <Text style={styles.customerName}>{customerName}</Text>
              {!!order.userId?.phoneNumber && (
                <Text style={styles.customerPhone}>
                  {order.userId?.phoneNumber}
                </Text>
              )}
            </View>
            {!!order.userId?.phoneNumber && (
              <Pressable
                onPress={handleCall}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Call ${customerName}`}
                style={({ pressed }) => [
                  styles.callButton,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
              </Pressable>
            )}
          </View>

          <PerforatedRule />

          <Text style={styles.sectionLabel}>ORDER ITEMS</Text>
          <View style={styles.itemsList}>{renderItems()}</View>

          <PerforatedRule />

          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <View
                style={[
                  styles.paymentDot,
                  { backgroundColor: isPaid ? "#3F7D45" : "#B0413E" },
                ]}
              />
              <Text
                style={[
                  styles.paymentText,
                  { color: isPaid ? "#3F7D45" : "#B0413E" },
                ]}
              >
                {isPaid
                  ? `Paid${order.paymentMethod ? ` · ${order.paymentMethod}` : ""}`
                  : "Payment pending"}
              </Text>
            </View>
          </View>

          <Text style={styles.ticketId}>TICKET #{shortId}</Text>
        </View>
      </ScrollView>

      {renderFooter()}
    </View>
  );

  if (Platform.OS === "android") {
    return (
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </Pressable>
        <SafeAreaView edges={["bottom"]} style={styles.sheetAndroid}>
          {renderContent()}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.sheetIOS}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  sheetAndroid: {
    backgroundColor: COLORS.paper,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "85%",
    width: "100%",

    overflow: "hidden",
  },
  sheetIOS: { flex: 1, backgroundColor: COLORS.paper },
  sheetContent: { flex: 1 },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: "rgba(43,38,33,0.18)",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(43,38,33,0.08)",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 12 },

  ticket: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    shadowColor: "#3A2E1E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  notch: {
    position: "absolute",
    top: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.paper,
  },
  notchLeft: { left: 22 },
  notchRight: { right: 22 },

  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.inkMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -1,
    lineHeight: 46,
  },

  stamp: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    transform: [{ rotate: "-4deg" }],
    marginTop: 6,
  },
  stampText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  metaRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.paper,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  metaChipText: { fontSize: 13, fontWeight: "600", color: COLORS.inkMuted },

  customerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  customerName: { fontSize: 18, fontWeight: "700", color: COLORS.ink },
  customerPhone: { fontSize: 13, color: COLORS.inkMuted, marginTop: 2 },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  perfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  perfDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.inkMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  itemsList: { gap: 10 },
  itemRow: { flexDirection: "row", alignItems: "flex-start" },
  itemQty: {
    fontFamily: MONO_FONT,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.inkMuted,
    width: 28,
  },
  itemName: {
    fontFamily: MONO_FONT,
    fontSize: 14,
    color: COLORS.ink,
    flex: 1,
    paddingRight: 12,
  },
  itemPrice: {
    fontFamily: MONO_FONT,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.ink,
  },
  emptyText: { fontSize: 14, color: COLORS.inkMuted, fontStyle: "italic" },

  totalsBlock: { marginTop: 4 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: COLORS.inkMuted },
  totalAmount: { fontSize: 24, fontWeight: "800", color: COLORS.ink },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  paymentDot: { width: 6, height: 6, borderRadius: 3 },
  paymentText: { fontSize: 13, fontWeight: "600" },

  ticketId: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: COLORS.inkMuted,
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 18,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.cardBorder,
    backgroundColor: COLORS.paper,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerNoteText: { fontSize: 14, fontWeight: "600", color: COLORS.inkMuted },
});
