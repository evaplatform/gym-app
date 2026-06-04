import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <Stack>
      {/* <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.EXERCISE_LIST),
          title: t(AppMessagesEnum.EXERCISE_LIST),
        }}
      /> */}

      <Stack.Screen
        name="trainingByUserListStack"
        options={({ route }) => {
          const trainingName = (route as any).params?.trainingName;

          return {
            headerTitle: trainingName ?? t(AppMessagesEnum.USER_EXERCISE_LIST),
          };
        }}
      />

      <Stack.Screen
        name="userExerciseStack"
        options={({ route }) => {
          const exerciseJson = (route as any).params?.exercise;
          const exercise = exerciseJson ? JSON.parse(exerciseJson) : null;

          return {
            headerTitle:
              exercise?.name || t(AppMessagesEnum.EXERCISE_SCREEN_TITLE),
          };
        }}
      />
    </Stack>
  );
}
