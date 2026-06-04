import { useTranslation } from "@/hooks/useTranslation";
import { Stack } from "expo-router";

export default function UpdateUserStackLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[userId]" />
    </Stack>
  );
}
