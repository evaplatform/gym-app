import ExerciseScreen from "@/components/ExerciseScreen";
import useUpdateExercise from "./useUpdateExercise";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { updateExercise: id } = useLocalSearchParams();
  const hooks = useUpdateExercise(id as string);

  return (
    <ExerciseScreen
      description={hooks.description}
      setDescription={hooks.setDescription}
      name={hooks.name}
      setName={hooks.setName}
      onSave={hooks.onSave}
      currentImagePath={hooks.currentImagePath}
      setExerciseImage={hooks.setCurrentImagePath}
      exerciseImage={hooks.currentImagePath}
      setImageAsset={hooks.setImageAsset}
    />
  );
}
