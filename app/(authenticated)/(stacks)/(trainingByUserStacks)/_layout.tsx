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
          headerTitle: t(AppMessagesEnum.USER_EXERCISE_LIST),
          title: t(AppMessagesEnum.USER_EXERCISE_LIST),
        }}
      />
      <Stack.Screen
        name="addTrainingToUserStack"
        options={{
          headerTitle: t(AppMessagesEnum.USER_ADD_TRAINING_TO_USER_BUTTON),
          title: t(AppMessagesEnum.USER_ADD_TRAINING_TO_USER_BUTTON),
        }}
      />
      <Stack.Screen
        name="updateTrainingToUserStack"
        options={{
          headerTitle: t(AppMessagesEnum.USER_EDIT_TRAINING_TO_USER_BUTTON),
          title: t(AppMessagesEnum.USER_EDIT_TRAINING_TO_USER_BUTTON),
        }}
      />
      <Stack.Screen
        name="trainingByUserListStack"
        options={({ route }) => {
          const trainingName = (route as any).params?.trainingName;

          return {
            headerTitle: trainingName ?? t(AppMessagesEnum.USER_EXERCISE_LIST),
          };
        }}
      />
    </Stack>
  );
}
