import { useLocalSearchParams } from "expo-router";
import TrainingScreen from "@/components/pages/TrainingScreen";
import useUpdateTraining from "./useUpdateTraining";
import { UserWithTokens } from "@/services/AuthServices/types";
import { IAcademy } from "@/shared/models/IAcademy";
import { ITraining } from "@/shared/models/ITraining";

export default function Page() {
  const {
    id,
    user: userData,
    academyList,
    trainingList: trainingListJson,
  } = useLocalSearchParams();
  const hooks = useUpdateTraining(id as string);

  const user = userData
    ? (JSON.parse(userData as string) as UserWithTokens)
    : null;

  const academies = academyList
    ? (JSON.parse(academyList as string) as IAcademy[])
    : [];

  const trainingList = trainingListJson
    ? (JSON.parse(trainingListJson as string) as ITraining[])
    : [];

  return (
    <TrainingScreen
      isLoading={hooks.isLoading}
      training={hooks.training}
      onSave={hooks.onUpdate}
      setImageAsset={hooks.setImageAsset}
      onRemove={hooks.onRemoveExercise}
      dispatch={hooks.dispatch}
      user={user}
      academyList={academies}
      trainingList={trainingList}
    />
  );
}
