import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSentry } from "../config/sentry.js";
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import SplashModule from '../config/SplashModule.js';

// Khởi tạo Sentry sớm nhất có thể
initSentry();

// Đảm bảo splash screen không tự động ẩn
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

const RootLayoutBase = () => {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error during initialization:', error);
      } finally {
        setIsReady(true);
        // Đợi một chút trước khi ẩn splash screen
        setTimeout(async () => {
          try {
            await SplashScreen.hideAsync();
          } catch (e) {
            console.warn('Error hiding splash screen:', e);
          }
        }, 500);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

// Wrap the root component with Sentry error boundary
export default Sentry.wrap(RootLayoutBase);

