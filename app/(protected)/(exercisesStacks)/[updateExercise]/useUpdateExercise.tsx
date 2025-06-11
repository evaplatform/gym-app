import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

export default function useUpdateExercise(id: string) {
  const { call } = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onSave = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const request: Partial<IExercise> = {
          id,
          name,
          description,
        };

        const res = await ExerciseServices.update(request);

        toast.show({
          type: "success",
          text1: "Exercicío editado com sucesso!",
        });

        router.back();
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      ExerciseServices.getById(id).then((exercise) => {
        setName(exercise.name);
        exercise.description && setDescription(exercise.description);
      });
    }, [id])
  );

  return {
    name,
    setName,
    description,
    setDescription,
    onSave,
  };
}
