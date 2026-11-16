import type { LiveFloor, Order, OrderTab, PaymentMethod, Session, ShiftSummary, Waiter } from "@/types";

import { api } from "./client";

/**
 * Every call the app makes to the Swiftab API. Functions reject with an
 * ApiError whose message can be shown to the person using the app.
 */

type Message = { message: string };

// --- Account -----------------------------------------------------------------

export async function loginWaiter(input: { email: string; password: string }): Promise<Session> {
  return (await api.post<Session>("/waiters/login", { email: input.email.trim(), password: input.password })).data;
}

/** Checks the invite code a manager issued from the dashboard. */
export async function verifyInvite(input: { email: string; validationcode: string }): Promise<Message> {
  return (await api.post<Message>("/waiters/verify", input)).data;
}

export async function setWaiterPassword(input: {
  email: string;
  password: string;
  validationcode: string;
}): Promise<Message> {
  return (await api.post<Message>("/waiters/password", input)).data;
}

export async function updateProfile(
  waiterId: string,
  input: { firstname: string; lastname: string; phoneNumber: string },
): Promise<Waiter> {
  return (await api.put<{ waiter: Waiter }>(`/waiters/${waiterId}/profile`, input)).data.waiter;
}

export async function setDuty(
  waiterId: string,
  onDuty: boolean,
): Promise<{ onDuty: boolean; dutyStartedAt?: string | null; message: string }> {
  return (await api.put(`/waiters/${waiterId}/duty`, { onDuty })).data;
}

export async function fetchSummary(waiterId: string): Promise<ShiftSummary> {
  return (await api.get<ShiftSummary>(`/waiters/${waiterId}/summary`)).data;
}

export async function registerPushToken(waiterId: string, token: string): Promise<void> {
  await api.post(`/waiters/${waiterId}/push-token`, { token });
}

export async function removePushToken(waiterId: string, token: string): Promise<void> {
  await api.delete(`/waiters/${waiterId}/push-token`, { data: { token } });
}

// --- Orders ------------------------------------------------------------------

export async function fetchOrders(restaurantId: string, tab: OrderTab): Promise<Order[]> {
  const res = await api.get<{ data: Order[] | null }>(`/waiters/restaurants/${restaurantId}/orders`, {
    params: { tab },
  });
  return (res.data.data ?? []).map((order) => ({ ...order, items: order.items ?? [] }));
}

/** Claims an order for this waiter and marks it served. */
export async function serveOrder(orderId: string, waiterId: string): Promise<Message> {
  return (await api.put<Message>(`/waiters/orders/${orderId}/status`, { orderStatus: "served", servedBy: waiterId })).data;
}

export async function cancelOrder(orderId: string, waiterId: string): Promise<Message> {
  return (await api.put<Message>(`/waiters/orders/${orderId}/status`, { orderStatus: "cancelled", servedBy: waiterId })).data;
}

/** Records the payment and closes the table. */
export async function closeOrder(
  orderId: string,
  payment: { paymentMethod: PaymentMethod; paymentReference?: string },
): Promise<Message> {
  return (
    await api.put<Message>(`/waiters/orders/${orderId}/complete`, {
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: payment.paymentMethod,
      paymentReference: payment.paymentReference?.trim() || undefined,
    })
  ).data;
}

// --- Floor -------------------------------------------------------------------

export async function fetchLiveFloor(restaurantId: string): Promise<LiveFloor> {
  const res = await api.get<LiveFloor>(`/waiters/restaurants/${restaurantId}/floor`);
  return {
    floors: res.data.floors ?? [],
    tables: (res.data.tables ?? []).map((t) => ({ ...t, chairs: t.chairs ?? [] })),
    counts: {
      free: res.data.counts?.free ?? 0,
      reserved: res.data.counts?.reserved ?? 0,
      occupied: res.data.counts?.occupied ?? 0,
    },
  };
}
