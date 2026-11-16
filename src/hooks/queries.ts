import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as API from "@/api/api";
import { useAuthStore, useWaiter } from "@/store/useAuthStore";
import type { Order, OrderTab, PaymentMethod } from "@/types";

/** Cache keys, in one place so writes refresh exactly what they change. */
export const keys = {
  orders: (restaurantId: string, tab: OrderTab) => ["orders", restaurantId, tab] as const,
  allOrders: ["orders"] as const,
  summary: (waiterId: string) => ["summary", waiterId] as const,
  floor: (restaurantId: string) => ["floor", restaurantId] as const,
};

/** How often the live queues refresh on their own. */
const LIVE = 12 * 1000;

const requireWaiter = () => {
  const waiter = useAuthStore.getState().session?.waiter;
  if (!waiter?._id) throw new Error("Please sign in again.");
  return waiter;
};

// --- Orders ------------------------------------------------------------------

/** One queue of orders. The open queues refresh on their own; closed orders rarely change. */
export function useOrders(tab: OrderTab) {
  const restaurantId = useWaiter()?.restaurantId;
  return useQuery({
    queryKey: keys.orders(restaurantId ?? "", tab),
    queryFn: () => API.fetchOrders(restaurantId!, tab),
    enabled: Boolean(restaurantId),
    staleTime: 5 * 1000,
    refetchInterval: tab === "completed" ? 60 * 1000 : LIVE,
  });
}

function useOrderWrite<TInput extends { orderId: string }>(write: (input: TInput) => Promise<{ message: string }>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: write,
    onSuccess: (_result, input) => {
      // Take the order out of whichever queue shows it, then confirm with the server.
      client.setQueriesData<Order[]>({ queryKey: keys.allOrders }, (old) => old?.filter((o) => o._id !== input.orderId));
      client.invalidateQueries({ queryKey: keys.allOrders });
      client.invalidateQueries({ queryKey: ["summary"] });
      client.invalidateQueries({ queryKey: ["floor"] });
    },
    onError: () => {
      // Another waiter may have got there first: show what is true now.
      client.invalidateQueries({ queryKey: keys.allOrders });
    },
  });
}

export const useServeOrder = () => useOrderWrite((input: { orderId: string }) => API.serveOrder(input.orderId, requireWaiter()._id));

export const useCancelOrder = () => useOrderWrite((input: { orderId: string }) => API.cancelOrder(input.orderId, requireWaiter()._id));

export const useCloseOrder = () =>
  useOrderWrite((input: { orderId: string; paymentMethod: PaymentMethod; paymentReference?: string }) =>
    API.closeOrder(input.orderId, input),
  );

// --- Shift -------------------------------------------------------------------

/** Queue sizes and today's numbers for this waiter. */
export function useSummary() {
  const waiterId = useWaiter()?._id;
  return useQuery({
    queryKey: keys.summary(waiterId ?? ""),
    queryFn: () => API.fetchSummary(waiterId!),
    enabled: Boolean(waiterId),
    staleTime: 5 * 1000,
    refetchInterval: LIVE,
  });
}

export function useSetDuty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (onDuty: boolean) => API.setDuty(requireWaiter()._id, onDuty),
    onSuccess: (result) => {
      useAuthStore.getState().setWaiter({ onDuty: result.onDuty, dutyStartedAt: result.dutyStartedAt ?? null });
      client.invalidateQueries({ queryKey: ["summary"] });
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: { firstname: string; lastname: string; phoneNumber: string }) =>
      API.updateProfile(requireWaiter()._id, input),
    onSuccess: (waiter) => useAuthStore.getState().setWaiter(waiter),
  });
}

// --- Floor -------------------------------------------------------------------

export function useLiveFloor() {
  const restaurantId = useWaiter()?.restaurantId;
  return useQuery({
    queryKey: keys.floor(restaurantId ?? ""),
    queryFn: () => API.fetchLiveFloor(restaurantId!),
    enabled: Boolean(restaurantId),
    staleTime: 5 * 1000,
    refetchInterval: LIVE,
  });
}
