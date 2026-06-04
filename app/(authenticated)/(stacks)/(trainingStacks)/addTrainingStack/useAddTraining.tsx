import { useReducer } from "react";
import { useVideoImageStates } from "@/hooks/useVideoImageStates";
import { ITraining } from "@/shared/models/ITraining";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import { FirebaseHandler } from "@/firebase/FirebaseHandler";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import { TrainingServices } from "@/services/TrainingServices";
import trainingReducer, {
  initialTrainingState,
} from "../trainingReducer";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";

export default function useAddTraining() {
  const { call } = useApi();
  const { t } = useTranslation();
  const router = useRouter();
  const { imageAsset, setImageAsset } = useVideoImageStates();

  const [training, dispatch] = useReducer(
    trainingReducer,
    initialTrainingState
  );

  const addTraining = async () => {
    let request: ApiRequestType<ITraining>;
    call({
      loading: true,
      try: async (toast) => {
        const updatedTraining = createEmptyValuesObject(training);

        request = { ...updatedTraining };

        const image = await FirebaseHandler.storeImage({
          assets: imageAsset,
        });

        if (image?.url) request.imagePath = image.url;

        const res = await TrainingServices.create(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.TRAINING_CREATED_SUCCESS),
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
    training: training,
    dispatch,
    imageAsset,
    setImageAsset,
    addTraining: addTraining,
  };
}
