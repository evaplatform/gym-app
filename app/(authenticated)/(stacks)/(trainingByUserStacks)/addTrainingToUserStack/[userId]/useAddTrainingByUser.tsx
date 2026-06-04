import { useApi } from "@/hooks/useApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useReducer } from "react";

import { useVideoImageStates } from "@/hooks/useVideoImageStates";

import { UserServices } from "@/services/UserServices";
import { IUser } from "@/shared/models/IUser";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import { ITraining } from "@/shared/models/ITraining";
import { IExercise } from "@/shared/models/IExercise";
import { IdType } from "@/shared/interfaces/IdType";
import { TrainingByUserServices } from "@/services/TrainingByUserServices";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import trainingByUserReducer, { initialTrainingByUserState } from "../../trainingByUserReducer";

export default function useAddTrainingByUser() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();

  const {
    userId,
    exerciseList: exerciseListJson,
    trainingList: trainingListJson,
    trainingsFromUser: trainingsFromUserJson,
    user: userJson,
  } = useLocalSearchParams();


    const [trainingByUser, dispatch] = useReducer(
      trainingByUserReducer,
      initialTrainingByUserState
    );
  

  const trainingsFromUser = useMemo(
    () => JSON.parse(trainingsFromUserJson as string) as ITraining[],
    [trainingsFromUserJson]
  );

  const user = useMemo(
    () => JSON.parse(userJson as string) as IUser,
    [userJson]
  );

  const exerciseList = useMemo(
    () => JSON.parse(exerciseListJson as string) as IExercise[],
    [exerciseListJson]
  );

  const trainingList = useMemo(
    () => JSON.parse(trainingListJson as string) as ITraining[],
    [trainingListJson]
  );

  const { imageAsset, setImageAsset, videoAsset, setVideoAsset } =
    useVideoImageStates();

  const onSave = async (trainingIds: IdType[]) => {
    call({
      loading: true,
      try: async (toast) => {
        if(!user.academyId){
          throw new Error(t(AppMessagesEnum.ACADEMY_ID_NOT_FOUND));
        }

        const data: ApiRequestType<ITrainingByUser> = {
          userId: userId as string,
          trainingId: trainingByUser.trainingId,
          academyId: user.academyId,
          weekDays: trainingByUser.weekDays,
        };

        await TrainingByUserServices.create(data);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.TRAINING_BY_USER_ADDED_SUCCESS),
        });

        router.replace({
          pathname: `/(authenticated)/(drawers)/trainingByUserListDrawer`,
        });
      },
    });
  };

  return {
    isLoading: false,
    trainingList,
    trainingsFromUser,
    exerciseList,
    imageAsset,
    onSave,
    setImageAsset,
    setVideoAsset,
    user,
    trainingByUser,
    dispatch,
  };
}
