import { Icon, type IconName } from "@/components/ui/Icon";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { getStatusMeta } from "@/constants/orderStatus";
import { C } from "@/constants/theme";
import { useCancelOrder, useCloseOrder, useServeOrder } from "@/hooks/queries";
import { feedback } from "@/lib/feedback";
import { clock, formatKes, isPaymentMethod, PAYMENT_METHODS, paymentLabel, tableLabel, timeAgo, titleCase } from "@/lib/format";
import { notify } from "@/lib/toast";
import { useWaiter } from "@/store/useAuthStore";
import type { Order, PaymentMethod } from "@/types";

import { AuthButton } from "./ui/AuthButton";

const MONO_FONT = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
const PERF_DOTS = Array.from({ length: 24 });

function StatusStamp({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  return (
    <View style={[styles.stamp, { borderColor: meta.ink, backgroundColor: meta.pale }]}>
      <Text style={[styles.stampText, { color: meta.ink }]}>{meta.label}</Text>
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

/** The receipt as plain text, for sharing or sending to a guest. */
function receiptText(order: Order, restaurantName?: string): string {
  const lines = order.items.map((item) => `${item.quantity} x ${titleCase(item.name)}  ${formatKes(item.cost * item.quantity)}`);
  return [
    restaurantName || "Swiftab",
    `Table ${tableLabel(order.tableNumber)}${order.orderId ? ` · ${order.orderId}` : ""}`,
    "",
    ...lines,
    "",
    `Total: ${formatKes(order.totalAmount)}`,
    order.paymentStatus === "paid" ? `Paid${order.paymentMethod ? ` with ${paymentLabel(order.paymentMethod)}` : ""}` : "Payment pending",
  ].join("\n");
}

/** One order as a ticket, with the action that moves it to the next stage. */
export default function OrderDetailView({ order, onClose }: { order: Order; onClose: () => void }) {
  const waiter = useWaiter();
  const serve = useServeOrder();
  const cancel = useCancelOrder();
  const close = useCloseOrder();

  // Taking payment: the method the guest asked for is pre-selected.
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>(isPaymentMethod(order.paymentMethod) ? order.paymentMethod : "cash");
  const [reference, setReference] = useState("");
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const table = tableLabel(order.tableNumber);
  const ticket = order.orderId || `#${order._id.slice(-6).toUpperCase()}`;
  const isPaid = order.paymentStatus === "paid";
  const guests = order.guests ?? 0;
  const customer = order.userId?.name ? titleCase(order.userId.name) : "Walk-in";
  const phone = order.userId?.phoneNumber;
  const busy = serve.isPending || cancel.isPending || close.isPending;

  const fail = (title: string) => (error: unknown) => {
    feedback.error();
    notify.error(title, errorMessage(error));
  };

  const onServe = () => {
    feedback.press();
    serve.mutate(
      { orderId: order._id },
      {
        onSuccess: () => {
          feedback.success();
          notify.success(`Table ${table} served`, "It is now in the Served queue.");
          onClose();
        },
        onError: fail("Could not take this order"),
      },
    );
  };

  const onCancel = () => {
    feedback.press();
    cancel.mutate(
      { orderId: order._id },
      {
        onSuccess: () => {
          notify.success("Order cancelled", `Table ${table} has been told.`);
          onClose();
        },
        onError: fail("Could not cancel this order"),
      },
    );
  };

  const onClosePayment = () => {
    feedback.press();
    close.mutate(
      { orderId: order._id, paymentMethod: method, paymentReference: reference },
      {
        onSuccess: () => {
          feedback.success();
          notify.success(`Table ${table} closed`, `${formatKes(order.totalAmount)} · ${paymentLabel(method)}`);
          onClose();
        },
        onError: fail("Could not close this table"),
      },
    );
  };

  const onCall = () => {
    if (!phone) return;
    feedback.tap();
    Linking.openURL(`tel:${phone.replace(/[^\d+]/g, "")}`).catch(() => notify.error("This phone cannot place calls"));
  };

  const onShare = () => {
    Share.share({ message: receiptText(order, waiter?.restaurantName) }).catch(() => undefined);
  };

  const footer = () => {
    if (paying) {
      return (
        <View style={styles.footer}>
          <Text style={pay.title}>How did table {table} pay?</Text>
          <View style={pay.methods}>
            {PAYMENT_METHODS.map((option) => {
              const active = option.key === method;
              return (
                <Pressable
                  key={option.key}
                  testID={`method-${option.key}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  aria-checked={active}
                  accessibilityLabel={option.label}
                  onPress={() => {
                    feedback.tap();
                    setMethod(option.key);
                  }}
                  style={[pay.method, active && pay.methodActive]}
                >
                  <Icon name={option.icon} size={15} color={active ? C.white : C.ink} />
                  <Text style={[pay.methodText, active && { color: C.white }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {method !== "cash" && (
            <TextInput
              testID="payment-reference"
              value={reference}
              onChangeText={(text) => setReference(text.toUpperCase().slice(0, 40))}
              placeholder={method === "card" ? "Receipt or approval code (optional)" : "Transaction code, e.g. SKL7X2M9QP (optional)"}
              placeholderTextColor={C.inkMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              style={pay.input}
            />
          )}
          <View style={pay.actions}>
            <Pressable accessibilityRole="button" disabled={close.isPending} onPress={() => setPaying(false)} style={pay.back}>
              <Text style={pay.backText}>Back</Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <AuthButton testID="confirm-payment" label={`Confirm ${formatKes(order.totalAmount)}`} onPress={onClosePayment} loading={close.isPending} />
            </View>
          </View>
        </View>
      );
    }

    if (order.status === "placed" && confirmingCancel) {
      return (
        <View style={styles.footer}>
          <Text style={pay.title}>Cancel the order for table {table}?</Text>
          <Text style={pay.hint}>The guest is told straight away. This cannot be undone.</Text>
          <View style={pay.actions}>
            <Pressable accessibilityRole="button" disabled={cancel.isPending} onPress={() => setConfirmingCancel(false)} style={pay.back}>
              <Text style={pay.backText}>Keep order</Text>
            </Pressable>
            <Pressable
              testID="confirm-cancel"
              accessibilityRole="button"
              disabled={cancel.isPending}
              onPress={onCancel}
              style={[pay.destructive, { opacity: cancel.isPending ? 0.6 : 1 }]}
            >
              <Text style={pay.destructiveText}>{cancel.isPending ? "Cancelling…" : "Cancel order"}</Text>
            </Pressable>
          </View>
        </View>
      );
    }
    if (order.status === "placed") {
      return (
        <View style={styles.footer}>
          <AuthButton testID="serve-order" label="Accept & serve" onPress={onServe} loading={serve.isPending} disabled={busy} />
          <Pressable testID="cancel-order" accessibilityRole="button" disabled={busy} onPress={() => setConfirmingCancel(true)} style={pay.link}>
            <Text style={pay.linkTextDanger}>Cancel order</Text>
          </Pressable>
        </View>
      );
    }
    if (order.status === "ready_to_pay") {
      return (
        <View style={styles.footer}>
          <AuthButton testID="take-payment" label="Take payment & close table" onPress={() => setPaying(true)} disabled={busy} />
        </View>
      );
    }
    if (order.status === "served") {
      return (
        <View style={styles.footer}>
          <View style={[styles.footerNote, { marginBottom: 10 }]}>
            <Icon name="restaurant-outline" size={16} color={C.inkMuted} />
            <Text style={styles.footerNoteText}>Served — waiting for the guest to ask for the bill</Text>
          </View>
          <AuthButton testID="pay-now" label="Guest is paying now" variant="dark" onPress={() => setPaying(true)} disabled={busy} />
        </View>
      );
    }
    if (order.status === "completed") {
      return (
        <View style={styles.footer}>
          <AuthButton label="Share receipt" variant="dark" onPress={onShare} />
        </View>
      );
    }
    return null;
  };

  const content = (
    <View style={styles.sheetContent}>
      {Platform.OS !== "ios" && <View style={styles.handle} />}

      <View style={styles.topBar}>
        <Pressable
          testID="close-ticket"
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close order details"
          style={styles.closeCircle}
        >
          <Icon name="close" size={18} color={C.ink} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.ticket}>
          <View style={[styles.notch, styles.notchLeft]} />
          <View style={[styles.notch, styles.notchRight]} />

          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.kicker}>TABLE</Text>
              <Text style={styles.tableNumber}>{table}</Text>
            </View>
            <StatusStamp status={order.status} />
          </View>

          <View style={styles.metaRow}>
            {guests > 0 && (
              <View style={styles.metaChip}>
                <Icon name="people-outline" size={13} color={C.inkMuted} />
                <Text style={styles.metaChipText}>
                  {guests} {guests === 1 ? "guest" : "guests"}
                </Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Icon name="time-outline" size={13} color={C.inkMuted} />
              <Text style={styles.metaChipText}>
                {timeAgo(order.time)}
                {clock(order.time) ? ` · ${clock(order.time)}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.customerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>GUEST</Text>
              <Text style={styles.customerName}>{customer}</Text>
              {!!phone && <Text style={styles.customerPhone}>{phone}</Text>}
            </View>
            {!!phone && (
              <Pressable
                onPress={onCall}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Call ${customer}`}
                style={styles.callButton}
              >
                <Icon name="call" size={16} color="#FFFFFF" />
              </Pressable>
            )}
          </View>

          <PerforatedRule />

          <Text style={styles.sectionLabel}>ORDER ITEMS</Text>
          <View style={styles.itemsList}>
            {order.items.length === 0 ? (
              <Text style={styles.emptyText}>No items on this order</Text>
            ) : (
              order.items.map((item, index) => (
                <View key={`${item._id}-${index}`}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemQty}>{item.quantity}×</Text>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {titleCase(item.name)}
                    </Text>
                    <Text style={styles.itemPrice}>{formatKes(item.cost * item.quantity)}</Text>
                  </View>
                  {!!item.note && <Text style={pay.note}>↳ {item.note}</Text>}
                </View>
              ))
            )}
          </View>

          <PerforatedRule />

          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatKes(order.totalAmount)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <View style={[styles.paymentDot, { backgroundColor: isPaid ? C.success : C.danger }]} />
              <Text style={[styles.paymentText, { color: isPaid ? C.success : C.danger }]}>
                {isPaid
                  ? `Paid${order.paymentMethod ? ` · ${paymentLabel(order.paymentMethod)}` : ""}`
                  : order.paymentMethod
                    ? `Wants to pay with ${paymentLabel(order.paymentMethod)}`
                    : "Payment pending"}
              </Text>
            </View>
            {!!order.waiter && <Text style={pay.servedBy}>Served by {order.waiter}</Text>}
          </View>

          <Text style={styles.ticketId}>TICKET {ticket}</Text>
        </View>
      </ScrollView>

      {footer()}
    </View>
  );

  if (Platform.OS !== "ios") {
    return (
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close order details">
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        </Pressable>
        <SafeAreaView edges={["bottom"]} style={styles.sheetAndroid}>
          {content}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.sheetIOS}>
      {content}
    </SafeAreaView>
  );
}

const pay = StyleSheet.create({
  title: { fontSize: 13.5, fontWeight: "700", color: C.ink, marginBottom: 10 },
  methods: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  methodActive: { backgroundColor: C.accent, borderColor: C.accent },
  methodText: { fontSize: 12, fontWeight: "700", color: C.ink },
  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    paddingHorizontal: 12,
    fontSize: 12.5,
    color: C.ink,
    marginBottom: 10,
    fontFamily: MONO_FONT,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  back: { height: 46, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder, alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 13.5, fontWeight: "600", color: C.ink },
  link: { alignItems: "center", paddingTop: 12, paddingBottom: 2 },
  linkTextDanger: { fontSize: 12.5, fontWeight: "600", color: C.danger },
  hint: { fontSize: 11.5, color: C.inkMuted, marginTop: -4, marginBottom: 12 },
  destructive: { flex: 1, height: 46, borderRadius: 12, backgroundColor: C.danger, alignItems: "center", justifyContent: "center" },
  destructiveText: { fontSize: 13.5, fontWeight: "700", color: C.white },
  note: { fontFamily: MONO_FONT, fontSize: 12.5, color: C.amber, marginLeft: 28, marginTop: 2 },
  servedBy: { fontSize: 12.5, color: C.inkMuted, marginTop: 6 },
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  sheetAndroid: {
    backgroundColor: C.paper,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "85%",
    width: "100%",

    overflow: "hidden",
  },
  sheetIOS: { flex: 1, backgroundColor: C.paper },
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
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.cardBorder,
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
    backgroundColor: C.paper,
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
    color: C.inkMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 38,
    fontWeight: "800",
    color: C.ink,
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
    backgroundColor: C.paper,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  metaChipText: { fontSize: 11.5, fontWeight: "600", color: C.inkMuted },

  customerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  customerName: { fontSize: 16, fontWeight: "700", color: C.ink },
  customerPhone: { fontSize: 11.5, color: C.inkMuted, marginTop: 2 },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.accent,
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
    backgroundColor: C.divider,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.inkMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  itemsList: { gap: 10 },
  itemRow: { flexDirection: "row", alignItems: "flex-start" },
  itemQty: {
    fontFamily: MONO_FONT,
    fontSize: 12.5,
    fontWeight: "700",
    color: C.inkMuted,
    width: 28,
  },
  itemName: {
    fontFamily: MONO_FONT,
    fontSize: 12.5,
    color: C.ink,
    flex: 1,
    paddingRight: 12,
  },
  itemPrice: {
    fontFamily: MONO_FONT,
    fontSize: 12.5,
    fontWeight: "600",
    color: C.ink,
  },
  emptyText: { fontSize: 12.5, color: C.inkMuted, fontStyle: "italic" },

  totalsBlock: { marginTop: 4 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 13.5, fontWeight: "600", color: C.inkMuted },
  totalAmount: { fontSize: 21.5, fontWeight: "800", color: C.ink },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  paymentDot: { width: 6, height: 6, borderRadius: 3 },
  paymentText: { fontSize: 11.5, fontWeight: "600" },

  ticketId: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: C.inkMuted,
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 18,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.cardBorder,
    backgroundColor: C.paper,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerNoteText: { fontSize: 12.5, fontWeight: "600", color: C.inkMuted },
});
