import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSentry } from "../config/sentry.js";
import * as Sentry from '@sentry/react-native';

// Initialize Sentry as early as possible
initSentry();

const RootLayoutBase = () => {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        if (!hasSeenOnboarding) {
          router.replace("/(onboarding)");
        }
        setIsReady(true);
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error during initialization:', error);
        setIsReady(true);
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
          <Stack.Screen name="(onboarding)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

// Wrap the root component with Sentry error boundary
export default Sentry.wrap(RootLayoutBase);
