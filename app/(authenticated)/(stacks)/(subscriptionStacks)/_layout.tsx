import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="newSubscription"
        options={{
          headerTitle: t(AppMessagesEnum.DRAWER_SUBSCRIPTION),
          title: t(AppMessagesEnum.DRAWER_SUBSCRIPTION),
        }}
      />
    </Stack>
  );
}
