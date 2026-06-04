import useAddTrainingByUser from "./useAddTrainingByUser";
import TrainingByUserScreen from "@/components/pages/TrainingByUserScreen";

export default function Page() {
  const hooks = useAddTrainingByUser();

  return (
    <TrainingByUserScreen
      isLoading={hooks.isLoading}
      trainingList={hooks.trainingList}
      trainingsFromUser={hooks.trainingsFromUser}
      onSave={hooks.onSave}
      dispatch={hooks.dispatch}
    />
  );
}
