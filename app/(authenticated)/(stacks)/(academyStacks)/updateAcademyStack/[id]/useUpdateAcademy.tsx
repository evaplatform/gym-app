import { useApi } from "@/hooks/useApi";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useReducer, useState } from "react";
import { Alert } from "react-native";

import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";
import { useOverlay } from "@/contexts/overlayContext";
import { LOAD_ALL } from "@/shared/constants/reducerConsts";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import academyReducer, { initialAcademyState } from "../../academyReducer";
import { AcademyServices } from "@/services/AcademyServices";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export default function useUpdateAcademy(id: string) {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { showOverlay, hideOverlay } = useOverlay();

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [academy, dispatch] = useReducer(academyReducer, initialAcademyState);

  const onUpdate = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const updateAcademy = createEmptyValuesObject(academy);

        const request = { ...updateAcademy, id };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
          oldPath: academy.oldImagePath,
        });

        if (image?.url) request.imagePath = image.url;

        const res = await AcademyServices.update(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.ACADEMY_EDITED_SUCCESS),
        });

        router.back();
      },
    });
  };

  const onRemoveAcademy = async () => {
    call({
      try: async (toast) => {
        Alert.alert(
          t(AppMessagesEnum.CONFIRMATION),
          t(AppMessagesEnum.ACADEMY_REMOVE_CONFIRMATION),
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
                const resp = await AcademyServices.delete(id);

                toast.show({
                  type: "success",
                  text1: resp,
                });

                academy.currentImagePath &&
                  (await FirebaseHandler.deleteFile(academy.currentImagePath));

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
          const academy = await AcademyServices.getById(id);

          dispatch({ type: LOAD_ALL, payload: academy });
        },
        finally: () => setIsLoading(false),
      });
    }, [id])
  );

  return {
    academy,
    isLoading,
    imageAsset,
    onUpdate,
    setImageAsset,
    onRemoveAcademy,
    setVideoAsset,
    dispatch,
  };
}
