
import ExerciseScreen from "@/components/ExerciseScreen";
import useAddBlock from "./useAddBlock";
import BlockScreen from "@/components/BlockScreen";
import useAddExercise from "../../(exercisesStacks)/addExercise/useAddExercise";


    // id: string;
    // name: string; 
    // imagePath: string;
    // academyId: IdType;
    // exerciseType: BlockTypeEnum;
    // createdAt: Date;
    // updatedAt?: Date;

export default function Page() {
  const hooks = useAddExercise();

  return (
    <BlockScreen
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
