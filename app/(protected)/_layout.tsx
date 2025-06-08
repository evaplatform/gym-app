import { AuthContext } from "@/contexts/authContext";
import { useApi } from "@/hooks/useApi";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);
  const { call } = useApi();

  if (!authState.isReady) {
    return null; // or a loading spinner
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  if (authState.isLoggedIn) {
    call({
      try: async () => {
        authState.addCredentialsItsLoggedIn();
      },
    });
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(exercisesStacks)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
