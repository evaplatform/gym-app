import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  deleteFromFirebase,
  uploadToFirebase,
} from "@/firebase/uploadToFirebase";

export default function useUpdateExercise(id: string) {
  const { call } = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [oldImagePath, setOldImagePath] = useState<string | undefined>(
    undefined
  );
  const [currentImagePath, setCurrentImagePath] = useState<string | undefined>(
    undefined
  );
  const [imageAsset, setImageAsset] = useState<
    ImagePicker.ImagePickerAsset[] | null
  >(null);

  const onSave = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const request: Partial<IExercise> = {
          id,
          name,
          description,
        };

        if (imageAsset && imageAsset.length > 0) {
          if (oldImagePath) {
            // Delete old image from Firebase
            await deleteFromFirebase(oldImagePath);
          }
          const fileName = imageAsset[0].fileName || `image-${Date.now()}.jpg`;
          const url = await uploadToFirebase(
            imageAsset[0].uri,
            `uploads/images/${fileName}`
          );

          request.imagePath = url;
        }

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
        if (exercise.imagePath) {
          setCurrentImagePath(exercise.imagePath);
          setOldImagePath(exercise.imagePath);
        }
      });
    }, [id])
  );

  return {
    name,
    setName,
    description,
    setDescription,
    currentImagePath,
    setCurrentImagePath,
    onSave,
    imageAsset,
    setImageAsset,
  };
}
