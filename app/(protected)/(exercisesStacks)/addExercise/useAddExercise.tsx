import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useState } from "react";

export default function useAddExercise() {
  const { call } = useApi();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addExercise = async () => {
    call({
      try: async (toast) => {
        const request: Partial<IExercise> = {
          name,
          description,
        };

        const res = await ExerciseServices.create(request);
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
