import useUpdateTrainingByUser from "./useUpdateTrainingByUser";
import TrainingByUserScreen from "@/components/pages/TrainingByUserScreen";

export default function Page() {
  const hooks = useUpdateTrainingByUser();

  return (
    <TrainingByUserScreen
      isLoading={hooks.isLoading}
      trainingList={hooks.trainingList}
      trainingsFromUser={hooks.trainingsFromUser}
      trainingByUser={hooks.selectedTrainingByUser}
      onSave={hooks.onSave}
      dispatch={hooks.dispatch}
    />
  );
}
