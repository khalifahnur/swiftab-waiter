import axios from "axios";
import {
  AuthData,
  AuthResponse,
  CreateOrder,
  OrderResponse,
  setPassword,
  signUpData,
} from "@/types";

const api = axios.create({
  baseURL: "https://server-production-2ee7.up.railway.app/swiftab",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/waiter/waiter-app-signin", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

export const signUpWaiter = async (data: signUpData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/waiter/waiter-app-signup",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Sign-up error details:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign up.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const waiterSetPassword = async (
  data: setPassword
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/waiter/waiter-new-password",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Set password error details:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during setting password.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const createOrder = async (
  orderData: CreateOrder
): Promise<OrderResponse> => {
  try {
    const response = await api.post<OrderResponse>(
      "/orders/take-order-route",
      orderData
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Failed to create order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during order creation.";
      throw new Error(errorMessage);
    } else {
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};


/** 
 * /swiftab/orders/fetch-all-order/:restaurantId
 * /swiftab/orders/fetch-served-order/:restaurantId
 * /swiftab/orders/fetch-not-served-order/:restaurantId
 * /swiftab/orders/fetch-paid-order/:restaurantId
 * /swiftab/orders/fetch-un-paid-order/:restaurantId
 * /swiftab/orders/fetch-latest-order/:restaurantId
 * */

export const fetchAllOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-all-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-all-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-all-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchServedOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-served-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-served-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-served-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchNotServedOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-not-served-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-not-served-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-not-served-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchPaidOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-paid-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-paid-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-paid-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchUnPaidOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-un-paid-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching fetch-un-paid-order:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-un-paid-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchLatestOrders = async (restaurantId: string) => {
  try {
    const response = await api.get(`/orders/fetch-latest-order/${restaurantId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetch-latest-order reservation:", error.response);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during fetch-latest-order.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};


