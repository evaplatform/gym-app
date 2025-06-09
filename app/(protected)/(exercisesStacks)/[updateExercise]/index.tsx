import ExerciseScreen from "@/components/ui/ExerciseScreen";
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
    />
  );
}
