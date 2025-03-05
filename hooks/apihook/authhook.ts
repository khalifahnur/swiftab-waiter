import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AuthData, AuthResponse, ErrorResponse, setPassword, signUpData } from '@/types';
import Toast from 'react-native-toast-message';
import { loginUser, signUpWaiter, waiterSetPassword } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export function useLogin(): UseMutationResult<AuthResponse, ErrorResponse, AuthData> {
  return useMutation<AuthResponse, ErrorResponse, AuthData>({mutationFn:loginUser, 
    onSuccess: (data:AuthResponse) => {
      console.log('Login successful:', data);
    },
    onError: (error:ErrorResponse) => {
      console.error('Login error:', error.message);
    },
  });
}

export function useSignUp(): UseMutationResult<AuthResponse, ErrorResponse, signUpData> {
  return useMutation<AuthResponse, ErrorResponse, signUpData>({mutationFn:signUpWaiter,
    onSuccess: (response) => {
        Toast.show({
            type: 'success',
            text1: 'Verification Successful',
          });
      console.log('Waiter Sign-up successful:',response.data);
      AsyncStorage.setItem("waiterObj",JSON.stringify(response.data))
    },
    onError: (error:ErrorResponse) => {
        Toast.show({
            type: 'error',
            text1: 'Incorrect code or expired-code try again!',
          });
      console.error('Sign-up error:', error.message);
    },
  });
}

export function useSetPassword(): UseMutationResult<AuthResponse, ErrorResponse, setPassword> {
    return useMutation<AuthResponse, ErrorResponse, setPassword>({mutationFn:waiterSetPassword,
      onSuccess: (response) => {
          Toast.show({
              type: 'success',
              text1: 'Sign-up Successful',
            });
            router.navigate('/(tabs)')
      },
      onError: (error:ErrorResponse) => {
          Toast.show({
              type: 'error',
              text1: 'Error occured try again!',
            });
        console.error('Sign-up error:', error.message);
      },
    });
  }
