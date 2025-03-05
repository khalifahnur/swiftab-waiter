export interface CirclePropTypes {
  imageStyle?: object;
  circleSize: number;
  face: { id: number; imageUrl: string };
  offset: number;
}

export interface FacePilePropTypes {
  faces: { id: number; imageUrl: string }[];
  circleSize?: number;
  hideOverflow?: boolean;
  containerStyle?: object;
  circleStyle?: object;
  imageStyle?: object;
  overflowStyle?: object;
  overflowLabelStyle?: object;
  render?: () => React.ReactNode;
  numFaces?: number;
  offset?: number;
}
export interface PrinterDevice {
  name?: string;
  address?: string;
  ip?: string;
  port?: number;
  type: PrinterType;
  status?: PrinterStatus;
}

export type PrinterType = "bluetooth" | "wifi" | "usb";

export type PrinterStatus = "connected" | "disconnected" | "error";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  id?: string;
}

export interface PrinterError extends Error {
  code?: string;
  deviceId?: string;
}

export interface ReceiptConfig {
  storeName: string;
  storeAddress?: string;
  phoneNumber?: string;
  taxRate: number;
  currency: string;
}

export interface MenuItem {
  name: string;
  description: string;
  amount: number;
  image: string;
  quantity: number;
}

export interface OrderData {
  restaurantId: string;
  userId: string;
  reservationId: string;
  paid: 'paid' | 'unpaid';
  served: boolean;
  menu: MenuItem[];
  floor: number;
  tableNumber: number;
}

export interface ReceiptProps {
  orderData: OrderData;
  onShare?: () => Promise<void>;
  onPrint?: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
  onFavorite?: () => void;
}

export interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}


/** api @types */

export interface AuthData {
  email: string;
  password:string;
  // validationcode:string;
}

export interface signUpData{
  email:string;
  validationcode:string
}

export interface setPassword {
  email: string;
  password:string;
}

export interface AuthResponse {
  token?: string;
  data: {
    restaurantId?: string;
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
    email?:string;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface MenuItem {
    _id: string;
    image: string;
    cost: number;
    rate: number;
    description: string;
    name: string;
}

export interface CreateOrder{
  menu:MenuItem[];
  userId:string,
  restaurantId  :string;
  reservationId:string;
  //diningArea:string;
  tableNumber:string;
}

export interface OrderResponse {
  message: string;
}

export interface FetchOrder{
    __v: number;
    _id: string;
    createdAt: string;
    menu: MenuItem[];
    orderId: string;
    paid: "Paid" | "Unpaid";
    reservationId: string;
    restaurantId: string;
    status: "Served" | "Not-served";
    tableNumber: string;
    takenBy: string;
    userId: string;
  }
