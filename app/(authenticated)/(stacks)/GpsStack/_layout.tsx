import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function AddUserStackLayout() {
  const { t } = useTranslation();

  return (
    <Stack >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
