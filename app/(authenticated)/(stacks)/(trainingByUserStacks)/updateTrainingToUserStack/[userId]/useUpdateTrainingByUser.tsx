import { useApi } from "@/hooks/useApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useReducer } from "react";

import { useVideoImageStates } from "@/hooks/useVideoImageStates";

import { IUser } from "@/shared/models/IUser";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import { ITraining } from "@/shared/models/ITraining";
import { IExercise } from "@/shared/models/IExercise";
import { IdType } from "@/shared/interfaces/IdType";
import { TrainingByUserServices } from "@/services/TrainingByUserServices";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import trainingByUserReducer, {
  initialTrainingByUserState,
} from "../../trainingByUserReducer";

export default function useUpdateTrainingByUser() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();

  const {
    userId,
    selectedTraining: trainingJson,
    selectedTrainingByUser: trainingsByUserJson,
    trainingsFromUser: trainingsFromUserJson,
    completeTrainingList: trainingListJson,
    user: userJson,
  } = useLocalSearchParams();

  const completeTrainingList = useMemo(
    () => JSON.parse(trainingListJson as string) as ITraining[],
    [trainingListJson]
  );

  const selectedTrainingByUser = useMemo(
    () => JSON.parse(trainingsByUserJson as string) as ITrainingByUser,
    [trainingsByUserJson]
  );

  const trainingsFromUser = useMemo(
    () => JSON.parse(trainingsFromUserJson as string) as ITraining[],
    [trainingsFromUserJson]
  );

  const user = useMemo(
    () => JSON.parse(userJson as string) as IUser,
    [userJson]
  );

  const selectedTraining = useMemo(
    () => JSON.parse(trainingJson as string) as ITraining,
    [trainingJson]
  );

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const [trainingByUserState, dispatch] = useReducer(
    trainingByUserReducer,
    selectedTrainingByUser
  );

  const onSave = async (trainingIds: IdType[]) => {
    call({
      loading: true,
      try: async (toast) => {
        if (!user.academyId) {
          throw new Error(t(AppMessagesEnum.ACADEMY_ID_NOT_FOUND));
        }

        const data: ApiRequestType<ITrainingByUser> = {
          id: selectedTrainingByUser.id,
          userId: userId as string,
          trainingId: trainingByUserState.trainingId,
          academyId: user.academyId,
          weekDays: trainingByUserState.weekDays,
        };

        await TrainingByUserServices.update(data);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.TRAINING_BY_USER_UPDATED_SUCCESS),
        });

        router.replace({
          pathname: `/(authenticated)/(drawers)/trainingByUserListDrawer`,
        });
      },
    });
  };

  return {
    isLoading: false,
    trainingList: completeTrainingList,
    trainingsFromUser,
    imageAsset,
    onSave,
    setImageAsset,
    setVideoAsset,
    selectedTrainingByUser,
    selectedTraining,
    dispatch,
  };
}
