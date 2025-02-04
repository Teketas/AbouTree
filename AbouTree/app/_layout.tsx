import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    checkAuthStatus();
  }, []);
  console.log("App Ready:", appReady);
  console.log("Is Authenticated:", isAuthenticated);
  
  useEffect(() => {
    if (appReady) {
      if (isAuthenticated) {
        router.replace("/(tabs)"); // Redirect to tabs after app is ready
      } else {
        router.replace("/login"); // Redirect to login if not authenticated
      }
    }
  }, [appReady, isAuthenticated]);

  if (!appReady) {
    // Optional loading screen while the app checks authentication
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
  
}
