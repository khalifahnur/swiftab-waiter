import { AuthData, AuthResponse, setPassword, signUpData } from "../../types";
import { api } from "./baseUrl";

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/waiter/waiter-app-signin",
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

export const signUpWaiter = async (data: signUpData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/waiter/signup", data);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign up.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from server.");
    }
  }
};

export const waiterSetPassword = async (
  data: setPassword,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/waiter/waiter-new-password",
      data,
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during setting password.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchOrdersByTab = async (restaurantId: string, tab: string) => {
  try {
    const response = await api.get(`/orders/fetch-all-order/${restaurantId}`, {
      params: { tab },
    });
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      console.error(`Error fetching ${tab} orders:`, error.response.data.error);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while fetching orders.";
      throw new Error(errorMessage);
    } else {
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};
