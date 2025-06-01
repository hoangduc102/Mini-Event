import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { initSentry } from "../config/sentry.js";
import * as Sentry from '@sentry/react-native';
import SplashModule from '../config/SplashModule.js';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
// Khởi tạo Sentry sớm nhất có thể
initSentry();

// Đảm bảo splash screen không tự động ẩn
SplashModule.internalPreventAutoHideAsync().catch(() => {
  /* ignore error */
});

const RootLayoutBase = () => {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);
  const { checkAuth, user, token } = useAuthStore();

  // Chỉ chạy một lần khi khởi động để xác định route ban đầu
  useEffect(() => {
    const initialize = async () => {
      try {
        // Trong môi trường development, xóa trạng thái onboarding
        if (__DEV__) {
          await AsyncStorage.removeItem('hasSeenOnboarding');
        }

        // Kiểm tra song song cả auth và onboarding
        const [authResult, hasSeenOnboarding] = await Promise.all([
          checkAuth(),
          AsyncStorage.getItem('hasSeenOnboarding')
        ]);

        // Xác định route ban đầu
        if (hasSeenOnboarding !== 'true') {
          setInitialRoute('/(onboarding)');
        } else if (!user || !token) {
          setInitialRoute('/(auth)');
        } else {
          setInitialRoute('/(tabs)');
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error during initialization:', error);
        setInitialRoute('/(auth)'); // Fallback to auth screen
      } finally {
        setIsReady(true);
        setTimeout(async () => {
          try {
            await SplashModule.internalMaybeHideAsync();
          } catch (e) {
            console.warn('Error hiding splash screen:', e);
          }
        }, 500);
      }
    };

    initialize();
  }, []);

  // Effect để điều hướng sau khi đã xác định được route ban đầu
  useEffect(() => {
    if (isReady && initialRoute) {
      router.replace(initialRoute);
    }
  }, [isReady, initialRoute]);

  // Effect theo dõi thay đổi trạng thái đăng nhập
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    // Chỉ xử lý điều hướng khi đã xem onboarding và không ở màn onboarding
    if (!inOnboardingGroup) {
      if (user && token && inAuthGroup) {
        // Nếu đã đăng nhập thành công và đang ở màn auth, chuyển đến tabs
        router.replace('/(tabs)');
      } else if ((!user || !token) && !inAuthGroup) {
        // Nếu chưa đăng nhập và không ở màn auth, chuyển đến auth
        router.replace('/(auth)');
      }
    }
  }, [user, token, segments, isReady]);

  if (!isReady || !initialRoute) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <Toast />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

// Wrap the root component with Sentry error boundary
export default Sentry.wrap(RootLayoutBase);

