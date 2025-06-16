import { AuthContext } from "@/contexts/authContext";
import { useApi } from "@/hooks/useApi";
import { Redirect, Stack } from "expo-router";
import { useCallback, useContext, useEffect } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);
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
    return <Redirect href="/login" />;
  }

  if (authState.isLoggedIn) {
    call({
      loading: true,
      try: async () => {
        authState.addCredentialsItsLoggedIn();
      },
    });
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(exercisesStacks)" options={{ headerShown: false }} />
      <Stack.Screen name="(blockExercisesStack)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
