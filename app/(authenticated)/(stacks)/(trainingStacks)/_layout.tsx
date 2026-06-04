import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.TRAINING_LIST),
          title: t(AppMessagesEnum.TRAINING_LIST),
        }}
      />
      <Stack.Screen
        name="addTrainingStack"
        options={{
          headerTitle: t(AppMessagesEnum.TRAINING_UPDATE),
          title: t(AppMessagesEnum.TRAINING_UPDATE),
        }}
      />
      <Stack.Screen
        name="updateTrainingStack"
        options={{
          headerTitle: t(AppMessagesEnum.TRAINING_UPDATE),
          title: t(AppMessagesEnum.TRAINING_UPDATE),
        }}
      />
    </Stack>
  );
}
