import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/models/IExercise";
import { useRouter } from "expo-router";
import { useEffect, useReducer } from "react";
import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";
import exerciseReducer, { initialExerciseState } from "../exerciseReducer";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import useFetchUser from "@/hooks/useFetchUser";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export default function useAddExercise() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { getUser } = useFetchUser();

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const [exercise, dispatch] = useReducer(
    exerciseReducer,
    initialExerciseState
  );

  const addExercise = async () => {
    let request: ApiRequestType<IExercise>;
    call({
      loading: true,
      try: async (toast) => {
        const updatedExercise = createEmptyValuesObject(exercise);

        request = { ...updatedExercise };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
        });

        if (image?.url) request.imagePath = image.url;

        const video = await FirebaseHandler.storeVideo({
          assets: videoAsset,
        });

        if (video?.url) request.videoPath = video.url;

        const res = await ExerciseServices.create(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.EXERCISE_CREATED_SUCCESS),
        });

        router.back();
      },
      catch: async (error) => {
        if (error.code === "storage/object-not-found") {
          dispatch({ type: "currentImagePath", payload: undefined });
          setImageAsset(null);
          setVideoAsset(undefined);
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

        if (request.imagePath) {
          await FirebaseHandler.deleteFile(request.imagePath);
        }
        if (request.videoPath) {
          await FirebaseHandler.deleteFile(request.videoPath);
        }
      },
    });
  };

  useEffect(() => {
    call({
      try: async () => {
        const data = await getUser();

        if (data.academyId) {
          dispatch({ type: "academyId", payload: data.academyId });
        }
      },
    });
  }, []);

  return {
    exercise,
    imageAsset,
    addExercise,
    setImageAsset,
    setVideoAsset,
    dispatch,
  };
}
