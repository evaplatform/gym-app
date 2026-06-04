import "expo-constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/components/custom/useColorScheme";
import { AuthProvider } from "@/contexts/authContext";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux";
import { OverlayProvider } from "@/contexts/overlayContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { RealmProvider } from "@/database/RealmProvider";
import { ActivityIndicator, View } from "react-native";
import { AppInitProvider } from "@/contexts/appInitializerContext";
import useCustomStyle from "@/hooks/useCustomStyle";

export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const toastConfig = {
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14, flexWrap: "wrap" }}
    />
  ),
  success: (props: any) => (
    <BaseToast
      {...props}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14, flexWrap: "wrap" }}
    />
  ),
};

function RootLayoutNav() {
  const { colors } = useCustomStyle();
  const colorScheme = useColorScheme();

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <RealmProvider>
          <OverlayProvider>
            <AppInitProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="login" />
                  <Stack.Screen name="(authenticated)" />
                </Stack>
                <StatusBar backgroundColor={colors.background} />
                <Toast config={toastConfig} />
              </ThemeProvider>
            </AppInitProvider>
          </OverlayProvider>
        </RealmProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootLayoutNav />;
}
