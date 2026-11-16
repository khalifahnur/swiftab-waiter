/** Shapes exchanged with the Swiftab API (see swiftab-server). */

export interface Waiter {
  _id: string;
  restaurantId?: string;
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  email?: string;
  onDuty?: boolean;
  dutyStartedAt?: string | null;
  restaurantName?: string;
  restaurantImage?: string;
}

export interface Session {
  token?: string;
  waiter: Waiter;
}

export interface OrderItem {
  _id: string;
  name: string;
  cost: number;
  quantity: number;
  note?: string;
}

export interface OrderCustomer {
  _id: string;
  name: string;
  phoneNumber?: string;
}

/** The queues the API serves orders in. */
export type OrderTab = "not-taken" | "served" | "payment" | "completed";

export type OrderStatus = "placed" | "served" | "ready_to_pay" | "completed" | "cancelled" | (string & {});

export type PaymentMethod = "mpesa" | "cash" | "card" | "airtel_money";

export interface Order {
  _id: string;
  orderId?: string;
  tableNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  userId?: OrderCustomer | null;
  guests?: number;
  /** When the order was placed (ISO). */
  time: string;
  updatedAt?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  servedBy?: string | null;
  /** Name of the waiter who served it. */
  waiter?: string;
}

export interface ShiftSummary {
  onDuty: boolean;
  dutyStartedAt?: string | null;
  queues: { "not-taken": number; served: number; payment: number };
  today: { tablesServed: number; tablesClosed: number; salesClosed: number };
}

export interface Floor {
  id: string;
  name: string;
}

export interface Chair {
  id: string;
  position: string;
}

export type TableLiveStatus = "free" | "reserved" | "occupied";

export interface LiveTable {
  id: string;
  name: string;
  floorId: string;
  shape: string;
  position: { x: number; y: number };
  rotation?: number;
  size: { width: number; height: number };
  chairs: Chair[];
  seats: number;
  live: {
    status: TableLiveStatus;
    guests: number;
    /** Guest name for a reservation, or the order state for a seated table. */
    detail?: string;
    since?: string;
    until?: string;
  };
}

export interface LiveFloor {
  floors: Floor[];
  tables: LiveTable[];
  counts: Record<TableLiveStatus, number>;
}
