import useCustomStyle from "@/hooks/useCustomStyle";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function AcademyStacksLayout() {
  const { t } = useTranslation();
  const { colors } = useCustomStyle();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      {/* <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.ACADEMY_LIST),
          title: t(AppMessagesEnum.ACADEMY_LIST),
        }}
      /> */}
      <Stack.Screen
        name="trainingListStack"
        options={({ route }) => {
          const userJson = (route as any).params?.user;
          const user = userJson ? JSON.parse(userJson) : null;

          return {
            headerTitle: user
              ? `${t(AppMessagesEnum.TRAININGS)} - ${user.name}`
              : t(AppMessagesEnum.TRAININGS),
          };
        }}
      />

      <Stack.Screen
        name="exercisesByTrainingListStack"
        options={({ route }) => {
          const trainingName = (route as any).params?.trainingName;
          const userJson = (route as any).params?.user;
          const user = userJson ? JSON.parse(userJson) : null;

          return {
            headerTitle: user && trainingName
              ? `${trainingName} - ${user.name}`
              : t(AppMessagesEnum.USER_EXERCISE_LIST),
          };
        }}
      />
      <Stack.Screen
        name="userExerciseStack"
        options={({ route }) => {
          const exerciseJSON = (route as any).params?.exercise;
          const userJson = (route as any).params?.user;

          const exercise = exerciseJSON ? JSON.parse(exerciseJSON) : null;
          const user = userJson ? JSON.parse(userJson) : null;

          return {
            headerTitle: user && exercise
              ? `${exercise.name} - ${user.name}`
              : t(AppMessagesEnum.EXERCISE_SCREEN_EXERCISE_DETAILS_TAB),
          };
        }}
      />
    </Stack>
  );
}
