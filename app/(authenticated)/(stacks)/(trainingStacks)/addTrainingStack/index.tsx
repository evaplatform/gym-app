import { useLocalSearchParams } from "expo-router";
import useAddTraining from "./useAddTraining";
import TrainingScreen from "@/components/pages/TrainingScreen";
import { UserWithTokens } from "@/services/AuthServices/types";
import { IAcademy } from "@/shared/models/IAcademy";
import { ITraining } from "@/shared/models/ITraining";

export default function Page() {
  const hooks = useAddTraining();
  const { user: userData, academyList, trainingList: trainingListJson } = useLocalSearchParams();

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
      training={hooks.training}
      dispatch={hooks.dispatch}
      isLoading={false}
      newRegister={true}
      setImageAsset={hooks.setImageAsset}
      onSave={hooks.addTraining}
      user={user}
      academyList={academies}
    />
  );
}
