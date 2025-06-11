import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function useAddExercise() {
  const { call } = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addExercise = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const request: Partial<IExercise> = {
          name,
          description,
        };

        const res = await ExerciseServices.create(request);

        toast.show({
          type: "success",
          text1: "Exercicío criado com sucesso!",
        });

        router.back();
      },
    });
  };

  return {
    addExercise,
    name,
    setName,
    description,
    setDescription,
  };
}
