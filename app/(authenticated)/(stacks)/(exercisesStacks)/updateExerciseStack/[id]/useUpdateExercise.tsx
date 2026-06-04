import { useApi } from "@/hooks/useApi";
import { ExerciseServices } from "@/services/ExerciseServices";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useReducer, useState } from "react";
import { Alert } from "react-native";

import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";

import { useOverlay } from "@/contexts/overlayContext";
import { LOAD_ALL } from "@/shared/constants/reducerConsts";
import exerciseReducer, { initialExerciseState } from "../../exerciseReducer";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export default function useUpdateExercise(id: string) {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { showOverlay, hideOverlay } = useOverlay();

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [exercise, dispatch] = useReducer(
    exerciseReducer,
    initialExerciseState
  );

  const onUpdate = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const request = {
          ...exercise,
          id,
        };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
          oldPath: exercise.oldImagePath,
        });

        if (image?.url) request.imagePath = image.url;

        const video = await FirebaseHandler.storeVideo({
          assets: videoAsset,
          oldPath: exercise.oldVideoPath,
        });

        if (video?.url) request.videoPath = video.url;

        const res = await ExerciseServices.update(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.EXERCISE_EDITED_SUCCESS),
        });

        router.back();
      },
    });
  };

  const onRemoveExercise = async () => {
    call({
      try: async (toast) => {
        Alert.alert(
          t(AppMessagesEnum.CONFIRMATION),
          t(AppMessagesEnum.REMOVE_EXERCISE_CONFIRMATION),
          [
            {
              text: t(AppMessagesEnum.CANCEL),
              style: "cancel",
            },
            {
              text: t(AppMessagesEnum.REMOVE),
              style: "destructive",
              onPress: async () => {
                showOverlay();
                const resp = await ExerciseServices.delete(id);

                toast.show({
                  type: "success",
                  text1: resp,
                });

                exercise.currentImagePath &&
                  (await FirebaseHandler.deleteFile(exercise.currentImagePath));
                exercise.currentVideoPath &&
                  (await FirebaseHandler.deleteFile(exercise.currentVideoPath));

                hideOverlay();
                router.back();
              },
            },
          ]
        );
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      call({
        try: async () => {
          const exercise = await ExerciseServices.getById(id);

          dispatch({ type: LOAD_ALL, payload: exercise });
        },
        finally: () => setIsLoading(false),
      });
    }, [id])
  );

  return {
    exercise,
    isLoading,
    imageAsset,
    onUpdate,
    setImageAsset,
    onRemoveExercise,
    setVideoAsset,
    dispatch,
  };
}
