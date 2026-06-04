import { useApi } from "@/hooks/useApi";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useReducer, useState } from "react";
import { Alert } from "react-native";

import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";
import { useOverlay } from "@/contexts/overlayContext";
import { LOAD_ALL } from "@/shared/constants/reducerConsts";
import { TrainingServices } from "@/services/TrainingServices";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import trainingReducer, {
  initialTrainingState,
} from "../../trainingReducer";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";

export default function useUpdateTraining(id: string) {
  const { call } = useApi();
  const { t } = useTranslation();
  const router = useRouter();
  const { showOverlay, hideOverlay } = useOverlay();

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [training, dispatch] = useReducer(
    trainingReducer,
    initialTrainingState
  );
  const onUpdate = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const updatedTraining = createEmptyValuesObject(training);

        const request = {
          ...updatedTraining,
          id,
        };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
          oldPath: training.oldImagePath,
        });

        if (image?.url) request.imagePath = image.url;

        const res = await TrainingServices.update(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.TRAINING_EDITED_SUCCESS),
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
          t(AppMessagesEnum.TRAINING_REMOVE_CONFIRMATION),
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
                const resp = await TrainingServices.delete(id);

                toast.show({
                  type: "success",
                  text1: resp,
                });

                training.currentImagePath &&
                  (await FirebaseHandler.deleteFile(
                    training.currentImagePath
                  ));

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
          const exercise = await TrainingServices.getById(id);

          dispatch({ type: LOAD_ALL, payload: exercise });
        },
        finally: () => setIsLoading(false),
      });
    }, [id])
  );

  return {
    training,
    isLoading,
    imageAsset,
    onUpdate,
    setImageAsset,
    onRemoveExercise,
    setVideoAsset,
    dispatch,
  };
}
