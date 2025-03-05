import { createOrder } from '@/api/api';
import { CreateOrder, OrderResponse} from '@/types';
import { useMutation } from '@tanstack/react-query';



// Add interface for success callback props
interface UseCreateReservationOptions {
  onSuccess?: (data: OrderResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateOrder = (options?: UseCreateReservationOptions) => {
    return useMutation({
      mutationFn: (orderData: CreateOrder) => createOrder(orderData),
      onSuccess: (data) => {
        options?.onSuccess?.(data);
      },
      onError: (error: Error) => {
        console.error("Failed to create order:", error);
        options?.onError?.(error);
      },
    });
  };

// export function userCancellationReservation() {
//   return useMutation({
//     mutationFn:({id,userId,restaurantId,reservationId}:userCancelReservationParams) => userCancelReservation({id,userId,restaurantId,reservationId}),
//     onSuccess: () => {
//         Toast.show({
//           type: 'success',
//           text1: 'Reservation cancelled',
//         });
//         AsyncStorage.removeItem("reservationData")
//     },
//     onError: (error) => {
//       // Handle errors
//       console.error('Failed to cancel reservation:', error.message);
//       Toast.show({
//         type: 'error',
//         text2: 'Reservation cancelled error : Please try again.',
//       });
//     },
//   });
// }