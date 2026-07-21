import { fetchOrdersByTab } from "@/api/api";
import { baseUrl } from "@/api/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

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
  orderStatus: string;
  servedBy: string;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      orderStatus,
      servedBy,
    }: UpdateOrderPayload) => {
      const response = await baseUrl.put(`/waiters/orders/${orderId}/status`, {
        orderStatus,
        servedBy,
      });
      return response.data;
    },
    onSuccess: async (responseData, variables) => {
      const { orderId } = variables;
      await queryClient.setQueriesData(
        { queryKey: ["orders"] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.filter((order: any) => order._id !== orderId);
        },
      );
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      Toast.show({
        type: "success",
        text1: `${responseData.message}`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error;
      Toast.show({
        type: "error",
        text1: `${errorMessage}`,
      });
    },
  });
};

interface CompleteOrderPayload {
  orderId: string;
  status: string;
  paymentStatus: string;
}

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      paymentStatus,
    }: CompleteOrderPayload) => {
      const response = await baseUrl.put(
        `/waiters/orders/${orderId}/complete`,
        {
          status,
          paymentStatus,
        },
      );
      return response.data;
    },
    onSuccess: async (responseData) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      Toast.show({
        type: "success",
        text1: `${responseData.message}`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error;
      Toast.show({
        type: "error",
        text1: `${errorMessage}`,
      });
    },
  });
};
