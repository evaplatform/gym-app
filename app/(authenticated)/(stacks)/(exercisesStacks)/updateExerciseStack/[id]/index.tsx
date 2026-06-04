import ExerciseScreen from "@/components/pages/ExerciseScreen";
import useUpdateExercise from "./useUpdateExercise";
import { useLocalSearchParams } from "expo-router";
import { ITraining } from "@/shared/models/ITraining";
import { IAcademy } from "@/shared/models/IAcademy";
import { UserWithTokens } from "@/services/AuthServices/types";

export default function Page() {
  const { id, trainingList: trainings, academyList, user: userData } = useLocalSearchParams();
  const trainingList = trainings
    ? (JSON.parse(trainings as string) as ITraining[])
    : [];

  const academies = academyList
    ? (JSON.parse(academyList as string) as IAcademy[])
    : [];

  const user = userData ? (JSON.parse(userData as string) as UserWithTokens) : null;

  const hooks = useUpdateExercise(id as string);

  return (
    <ExerciseScreen
      isLoading={hooks.isLoading}
      exercise={hooks.exercise}
      onSave={hooks.onUpdate}
      setImageAsset={hooks.setImageAsset}
      setVideoExerciseAsset={hooks.setVideoAsset}
      onRemoveExercise={hooks.onRemoveExercise}
      dispatch={hooks.dispatch}
      trainingList={trainingList}
      academyList={academies}
      user={user}
    />
  );
}
