import { Stack } from "expo-router";

export default function AddUserStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Outras subpáginas, se houver */}
    </Stack>
  );
}
