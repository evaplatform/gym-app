import { useReducer } from "react";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import academyReducer, { initialAcademyState } from "../academyReducer";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export default function useAddAcademy() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { imageAsset, setImageAsset } = useVideoImageStates();

  const [academy, dispatch] = useReducer(academyReducer, initialAcademyState);

  const addAcademy = async () => {
    let request: ApiRequestType<IAcademy>;
    call({
      loading: true,
      try: async (toast) => {
        const updatedTraining = createEmptyValuesObject(academy);

        request = {
          ...updatedTraining,
        };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
        });

        if (image?.url) request.imagePath = image.url;

        const res = await AcademyServices.create(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.ACADEMY_CREATED_SUCCESS),
        });

        router.back();
      },
      catch: async (error) => {
        if (error.code === "storage/object-not-found") {
          dispatch({ type: "currentImagePath", payload: undefined });
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

        if (request.imagePath) {
          await FirebaseHandler.deleteFile(request.imagePath);
        }
      },
    });
  };

  return {
    training: academy,
    dispatch,
    imageAsset,
    setImageAsset,
    addAcademy,
  };
}
