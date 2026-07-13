import { Ionicons } from "@react-native-vector-icons/ionicons";

export type OrderStatusKey = "not-taken" | "served" | "payment" | "completed";

export interface StatusMeta {
  /** Label shown on an individual order's status badge (its own state). */
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Vivid color — ticket stub on cards, active pill in the tab bar. */
  accent: string;
  /** Pale tint — background of the in-card status badge. */
  pale: string;
  /** Dark "ink" version of the accent — text/icon color on top of `pale`. */
  ink: string;
}

const STATUS_META: Record<OrderStatusKey, StatusMeta> = {
  "not-taken": {
    label: "Placed",
    icon: "hourglass-outline",
    accent: "#F59E0B", // amber — needs action
    pale: "#FEF3C7",
    ink: "#B45309",
  },
  served: {
    label: "Served",
    icon: "restaurant-outline",
    accent: "#3B82F6", // blue — in progress
    pale: "#DBEAFE",
    ink: "#1D4ED8",
  },
  payment: {
    label: "Ready to Pay",
    icon: "wallet-outline",
    // Violet on purpose — #0d9488 (brand teal) is already used for buttons/spinners/
    // actions elsewhere, so reusing it here would make a status look like a tappable action.
    accent: "#7C3AED",
    pale: "#EDE9FE",
    ink: "#5B21B6",
  },
  completed: {
    label: "Completed",
    icon: "checkmark-circle-outline",
    accent: "#10B981", // emerald — resolved
    pale: "#D1FAE5",
    ink: "#047857",
  },
};

/** Label shown on the tab bar itself — the queue name, distinct from the order's own state. */
export const TAB_LABELS: Record<OrderStatusKey, string> = {
  "not-taken": "Not Taken",
  served: "Served",
  payment: "Payment",
  completed: "Completed",
};

const FALLBACK_META: StatusMeta = {
  label: "Order",
  icon: "ellipse-outline",
  accent: "#9CA3AF",
  pale: "#F3F4F6",
  ink: "#374151",
};

const STATUS_ALIASES: Record<string, OrderStatusKey> = {
  placed: "not-taken",
  pending: "not-taken",
  "ready-to-pay": "payment",
  "awaiting-payment": "payment",
  "in-progress": "served",
  done: "completed",
};

export function getStatusMeta(status?: string | null): StatusMeta {
  if (!status) return FALLBACK_META;
  const key = status
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const canonical = STATUS_ALIASES[key] ?? (key as OrderStatusKey);
  return STATUS_META[canonical] ?? { ...FALLBACK_META, label: status };
}

export function getTabLabel(tabStatus: OrderStatusKey): string {
  return TAB_LABELS[tabStatus] ?? tabStatus;
}

export const TAB_STATUSES: OrderStatusKey[] = [
  "not-taken",
  "served",
  "payment",
  "completed",
];
