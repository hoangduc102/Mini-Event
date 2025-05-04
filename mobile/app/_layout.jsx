import { Stack, useRouter ,useSegments} from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();


  const {checkAuth, user, token} = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, []);

  // Kiểm tra xem người dùng đã xem onboarding chưa
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
          router.replace("/(onboarding)");
          await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    checkOnboarding();
  }, []);

  //handle navigation based on the auth state
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if(!isSignedIn && !inAuthScreen){
      router.replace("/(auth)");
    }else if(isSignedIn && inAuthScreen){
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{headerShown : false}}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
