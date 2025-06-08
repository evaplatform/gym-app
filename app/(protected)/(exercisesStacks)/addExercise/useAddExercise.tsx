import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useState } from "react";

export default function useAddExercise() {
  const { call } = useApi();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addExercise = async () => {
    // call({
    //   try: async (toast) => {
    try {
      const request: Partial<IExercise> = {
        name,
        description,
      };

      const res = await ExerciseServices.create(request);
    } catch (e) {
      console.error("Error creating exercise:", e);
      console.error("Error creating exercise:", e);
    }
    // toast.show({
    //   type: "success",
    //   text1: "Exercício criado",
    //   text2: `O exercício "${res.name}" foi criado com sucesso!`,
    // });
    //   },
    // });
  };

  return {
    addExercise,
    name,
    setName,
    description,
    setDescription,
  };
}
