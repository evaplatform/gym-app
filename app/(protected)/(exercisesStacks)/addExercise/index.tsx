import useAddExercise from "./useAddExercise";
import ExerciseScreen from "@/components/ui/ExerciseScreen";

export default function Page() {
  const hooks = useAddExercise();

  return (
    <ExerciseScreen
      description={hooks.description}
      setDescription={hooks.setDescription}
      name={hooks.name}
      setName={hooks.setName}
      onSave={hooks.addExercise}
    />
  );
}
