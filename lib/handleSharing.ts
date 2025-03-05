import { Share } from "react-native";
import calculateTotal from "./calculateTotal";
import { OrderData } from "@/types";

const handleShare = async ({orderData}:OrderData): Promise<void> => {
    try {
      const total = calculateTotal(orderData.menu);
      const message = `Receipt Details:\n\n` +
        `Table: ${orderData.tableNumber}\n` +
        `Floor: ${orderData.floor}\n` +
        `Order Items:\n${orderData.menu.map(item => 
          `${item.name} x${item.quantity} - $${item.amount * item.quantity}`
        ).join('\n')}\n\n` +
        `Total: $${total}\n` +
        `Reservation ID: ${orderData.reservationId}`;

      await Share.share({
        message,
        title: 'Receipt Details',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  export default handleShare