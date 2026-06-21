import { AuthContext } from "@/contexts/authContext";
import { useApi } from "@/hooks/useApi";
import { Redirect, Stack } from "expo-router";
import { useCallback, useContext, useEffect } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setLoginMessage } from "@/redux/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomStyle from "@/hooks/useCustomStyle";

export default function StacksLayout() {
  const { colors } = useCustomStyle();
  const authState = useContext(AuthContext);
  const dispatch = useDispatch();
  const { call } = useApi();

  const requestCameraPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para usar a câmera!");
    }
  }, []);

  const requestMediaLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permissão de Acesso Negada",
        text2: "Você precisa permitir o acesso à galeria para continuar.",
      });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      return; // No need to request permissions on web
    }

    requestMediaLibraryPermission();
    requestCameraPermission();
  }, [requestCameraPermission, requestMediaLibraryPermission]);

  if (!authState.isReady) {
    return null; // or a loading spinner
  }

  if (!authState.isLoggedIn) {
    if (authState.loginMessage) {
      Toast.show({
        type: "info",
        text1: "atenção",
        text2: authState.loginMessage,
      });

      dispatch(setLoginMessage(undefined));
    }

    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: "modal",
          headerStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(drawers)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(stacks)/(academyStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(exercisesStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(userStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(trainingStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(trainingByUserStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(StacksByExercisesTab)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/GpsStack"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/userSettingsStack"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(chartsStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(groupsStacks)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(stacks)/(subscriptionStacks)"
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaView>
  );
}
