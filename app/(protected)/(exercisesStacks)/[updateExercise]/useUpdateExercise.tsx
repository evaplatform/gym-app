import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function useUpdateExercise(id: string) {
  const { call } = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onSave = async () => {
    call({
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

  return {
    name,
    setName,
    description,
    setDescription,
    onSave,
  };
}
