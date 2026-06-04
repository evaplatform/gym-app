import { useLocalSearchParams } from "expo-router";

import ExerciseScreen from "@/components/pages/ExerciseScreen";
import { ITraining } from "@/shared/models/ITraining";
import useAddExercise from "./useAddExercise";
import { IAcademy } from "@/shared/models/IAcademy";
import { UserWithTokens } from "@/services/AuthServices/types";

export default function Page() {
  const {
    trainingList: trainings,
    academyList,
    user: userData,
  } = useLocalSearchParams();

  const trainingList = trainings
    ? (JSON.parse(trainings as string) as ITraining[])
    : [];

  const academies = academyList
    ? (JSON.parse(academyList as string) as IAcademy[])
    : [];

  const user = userData
    ? (JSON.parse(userData as string) as UserWithTokens)
    : null;

  const hooks = useAddExercise();

  return (
    <ExerciseScreen
      isLoading={false}
      newRegister={true}
      exercise={hooks.exercise}
      onSave={hooks.addExercise}
      setImageAsset={hooks.setImageAsset}
      setVideoExerciseAsset={hooks.setVideoAsset}
      dispatch={hooks.dispatch}
      trainingList={trainingList}
      academyList={academies}
      user={user}
    />
  );
}
