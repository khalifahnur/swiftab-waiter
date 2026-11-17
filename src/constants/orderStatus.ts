import type { IconName } from "@/components/ui/Icon";

import type { OrderTab } from "@/types";

import { C } from "./theme";

export interface StatusMeta {
  /** What an order in this state is called on its badge. */
  label: string;
  icon: IconName;
  /** Text and icon colour on top of `pale`. */
  ink: string;
  /** Background of the badge. */
  pale: string;
}

const BY_STATUS: Record<string, StatusMeta> = {
  placed: { label: "New order", icon: "hourglass-outline", ink: C.amber, pale: C.amberPale },
  served: { label: "Served", icon: "restaurant-outline", ink: C.blue, pale: C.bluePale },
  ready_to_pay: { label: "Bill requested", icon: "wallet-outline", ink: C.violet, pale: C.violetPale },
  completed: { label: "Paid", icon: "checkmark-circle-outline", ink: C.success, pale: C.successPale },
  cancelled: { label: "Cancelled", icon: "close-circle-outline", ink: C.danger, pale: C.dangerPale },
};

const FALLBACK: StatusMeta = { label: "Order", icon: "ellipse-outline", ink: C.inkMuted, pale: "#EFE7D2" };

/** How an order's own status is shown. */
export const getStatusMeta = (status: string | undefined): StatusMeta => BY_STATUS[status ?? ""] ?? FALLBACK;

/** The queues, in the order a table moves through them. */
export const TABS: { id: OrderTab; label: string; empty: { icon: IconName; title: string; body: string } }[] = [
  { id: "not-taken", label: "New", empty: { icon: "time-outline", title: "All caught up", body: "New orders will show up here." } },
  { id: "served", label: "Served", empty: { icon: "restaurant-outline", title: "Nothing at the tables", body: "Orders you have served wait here until the bill is asked for." } },
  { id: "payment", label: "Payment", empty: { icon: "wallet-outline", title: "No bills waiting", body: "Tables that are ready to pay appear here." } },
  { id: "completed", label: "Done", empty: { icon: "checkmark-circle-outline", title: "No closed tables yet", body: "Paid orders are listed here." } },
];
