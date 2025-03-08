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

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!isMounted) return;

        const parsedUser = waiterData ? JSON.parse(waiterData) : null;
        const authToken = parsedUser?.token;

        // Handle navigation
        if (hasSeenOnboard === null) {
          router.replace('/(onboard)');
        } else if (authToken) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)');
        }

        if (isMounted) {
          await ExpoSplashScreen.hideAsync();
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          router.replace('/(auth)/SigninScreen');
          await ExpoSplashScreen.hideAsync();
        }
      }
    };

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return <View />;
}
