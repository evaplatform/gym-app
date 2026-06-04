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
          headerTitle: t(AppMessagesEnum.EXERCISE_LIST),
          title: t(AppMessagesEnum.EXERCISE_LIST),
        }}
      />
      <Stack.Screen
        name="addExerciseStack"
        options={{
          headerTitle: t(AppMessagesEnum.EXERCISE_ADD),
          title: t(AppMessagesEnum.EXERCISE_ADD),
        }}
      />
      <Stack.Screen
        name="updateExerciseStack"
        options={{
          headerTitle: t(AppMessagesEnum.EXERCISE_EDIT),
          title: t(AppMessagesEnum.EXERCISE_EDIT),
        }}
      />
    </Stack>
  );
}
