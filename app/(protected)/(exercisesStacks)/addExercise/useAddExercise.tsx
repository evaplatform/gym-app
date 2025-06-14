import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/interfaces/IExercise";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  deleteFromFirebase,
  uploadToFirebase,
} from "@/firebase/uploadToFirebase";

export default function useAddExercise() {
  const { call } = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [currentImagePath, setCurrentImagePath] = useState<string | undefined>(
    undefined
  );
  const [imageAsset, setImageAsset] = useState<
    ImagePicker.ImagePickerAsset[] | null
  >(null);

  const addExercise = async () => {
    call({
      loading: true,
      catch: async (error) => {
        if (error.code === "storage/object-not-found") {
          setCurrentImagePath(undefined);
          setImageAsset(null);
          return;
        }

        if (error.code === "storage/unauthorized") {
          // User doesn't have permission to access the object
          return;
        }

        if (error.code === "storage/canceled") {
          // User canceled the upload
          return;
        }

        if (error.code === "storage/unknown") {
          // Unknown error occurred, inspect the server response
          return;
        }
      },
      try: async (toast) => {
        const request: Partial<IExercise> = {
          name,
          description,
        };

        if (imageAsset && imageAsset.length > 0) {
          const fileName = imageAsset[0].fileName || `image-${Date.now()}.jpg`;
          const url = await uploadToFirebase(
            imageAsset[0].uri,
            `uploads/images/${fileName}`
          );

          request.imagePath = url;
        }

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
    currentImagePath,
    setCurrentImagePath,
    setImageAsset,
  };
}
