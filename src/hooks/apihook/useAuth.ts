import { loginUser, signUpWaiter, waiterSetPassword } from "@/api/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  AuthData,
  AuthResponse,
  ErrorResponse,
  setPassword,
  signUpData,
} from "../../../types";

export function useLogin(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  AuthData
> {
  const setWaiterData = useAuthStore((state) => state.setWaiterData);

  return useMutation<AuthResponse, ErrorResponse, AuthData>({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      setWaiterData(data);
    },
    onError: (error: ErrorResponse) => {
      Toast.show({
        type: "error",
        text1: `${error.message}`,
      });
    },
  });
}

export function useSignUp(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  signUpData
> {
  return useMutation<AuthResponse, ErrorResponse, signUpData>({
    mutationFn: signUpWaiter,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Verification Successful",
      });
    },
    onError: (error: ErrorResponse) => {
      Toast.show({
        type: "error",
        text1: `${error.message}`,
      });
    },
  });
}

export function useSetPassword(): UseMutationResult<
  AuthResponse,
  ErrorResponse,
  setPassword
> {
  return useMutation<AuthResponse, ErrorResponse, setPassword>({
    mutationFn: waiterSetPassword,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Sign-up Successful",
      });
      router.navigate("/(auth)/signin");
    },
    onError: (error: ErrorResponse) => {
      Toast.show({
        type: "error",
        text1: `${error.message}`,
      });
    },
  });
}
