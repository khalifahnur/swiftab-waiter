import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        const [hasSeenOnboard, waiterData] = await Promise.all([
          AsyncStorage.getItem('hasSeenOnboard'),
          AsyncStorage.getItem('waiterObj')
        ]);

        // Add minimum 1s delay for better UX
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1000)),
          ExpoSplashScreen.hideAsync()
        ]);

        if (!isMounted) return;

        const parsedUser = waiterData ? JSON.parse(waiterData) : null;
        const authToken = parsedUser?.token;

        // Handle navigation
        if (!hasSeenOnboard) {
          router.replace('/(onboard)');
        } else if (authToken) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)');
        }

      } catch (error) {
        console.error(error);
        router.replace('/(auth)/SigninScreen');
      }
    };

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return <View />;
}