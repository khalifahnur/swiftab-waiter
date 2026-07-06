import { fetchOrdersByTab } from "@/api/api";
import { api } from "@/api/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWaiterOrders = (
  restaurantId: string | undefined,
  tab: string,
) => {
  return useQuery({
    queryKey: ["orders", restaurantId, tab],
    queryFn: () => fetchOrdersByTab(restaurantId as string, tab),
    enabled: !!restaurantId && restaurantId !== "undefined",
    staleTime: 1000 * 30,
  });
};

interface UpdateOrderPayload {
  orderId: string;
  status: string;
  servedBy: string;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, servedBy }: UpdateOrderPayload) => {
      const response = await api.put(`/orders/update-status/${orderId}`, {
        status,
        servedBy,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    },
  });
};
