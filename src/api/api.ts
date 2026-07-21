import { AuthData, AuthResponse, setPassword, signUpData } from "../../types";
import { baseUrl } from "./baseUrl";

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await baseUrl.post<AuthResponse>("/waiters/login", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error);
  }
};

export const signUpWaiter = async (data: signUpData): Promise<AuthResponse> => {
  try {
    const response = await baseUrl.post<AuthResponse>("/waiters/verify", data);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage = error?.response?.data?.error;
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
    const response = await baseUrl.post<AuthResponse>(
      "/waiters/password",
      data,
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage = error?.response?.data?.error;
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from server.");
    }
  }
};

export const fetchOrdersByTab = async (restaurantId: string, tab: string) => {
  try {
    const response = await baseUrl.get(
      `/waiters/restaurants/${restaurantId}/orders`,
      {
        params: { tab },
      },
    );
    return response.data.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage = error?.response?.data?.error;
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from server.");
    }
  }
};
