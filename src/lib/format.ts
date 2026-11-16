import type { PaymentMethod } from "@/types";

const currency = new Intl.NumberFormat("en-KE");

export const formatKes = (amount?: number | null) => `KES ${currency.format(Math.round(Number(amount) || 0))}`;

export const titleCase = (value: string) =>
  value.replace(/[_-]+/g, " ").replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

/** "T4" from "Table T4"; the bare name is what goes on the ticket. */
export function tableLabel(tableNumber: unknown): string {
  const raw = String(tableNumber ?? "").trim() || "—";
  return raw.replace(/^table\s*/i, "") || raw;
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function clock(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** "2 h 15 min" since a moment. */
export function elapsed(iso?: string | null): string {
  if (!iso) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (Number.isNaN(minutes)) return "";
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours} h ${minutes % 60} min` : `${minutes} min`;
}

export const initials = (first?: string, last?: string) =>
  `${first?.trim()?.[0] ?? ""}${last?.trim()?.[0] ?? ""}`.toUpperCase() || "W";

export const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: "phone-portrait-outline" | "cash-outline" | "card-outline" }[] = [
  { key: "mpesa", label: "M-Pesa", icon: "phone-portrait-outline" },
  { key: "cash", label: "Cash", icon: "cash-outline" },
  { key: "card", label: "Card", icon: "card-outline" },
  { key: "airtel_money", label: "Airtel Money", icon: "phone-portrait-outline" },
];

export const paymentLabel = (method?: string | null) =>
  PAYMENT_METHODS.find((m) => m.key === method)?.label ?? (method ? titleCase(method) : "");

export const isPaymentMethod = (method?: string | null): method is PaymentMethod =>
  PAYMENT_METHODS.some((m) => m.key === method);
