import useAddExercise from "./useAddExercise";
import ExerciseScreen from "@/components/ExerciseScreen";

export default function Page() {
  const hooks = useAddExercise();

  return (
    <ExerciseScreen
      description={hooks.description}
      setDescription={hooks.setDescription}
      name={hooks.name}
      setName={hooks.setName}
      onSave={hooks.addExercise}
      setExerciseImage={hooks.setCurrentImagePath}
      exerciseImage={hooks.currentImagePath}
      setImageAsset={hooks.setImageAsset}
    />
  );
}
