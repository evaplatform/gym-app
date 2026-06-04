import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ExtendedExerciseState } from "../../(exercisesStacks)/exerciseReducer";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import useCustomStyle from "@/hooks/useCustomStyle";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import { IExercise } from "@/shared/models/IExercise";

export function useUserExerciseStack() {
  const { colors } = useCustomStyle();

  const { exercise: exerciseJson, trainingByUser: trainingByUserJson } =
    useLocalSearchParams();

  const { listExerciseHistory } = useSelector(
    (state: RootReduxState) => state.exerciseHistory
  );

  const [exercise, filteredHistory] = useMemo(() => {
    const exerciseObj = exerciseJson
      ? (JSON.parse(exerciseJson as string) as IExercise)
      : undefined;

    const filteredHistory = listExerciseHistory?.filter(
      (history: IExerciseHistory) => history.exerciseId === exerciseObj?.id
    ) as IExerciseHistory[];

    return [exerciseObj, filteredHistory];
  }, [exerciseJson, listExerciseHistory]);

  const trainingByUser = useMemo(
    () =>
      trainingByUserJson
        ? (JSON.parse(trainingByUserJson as string) as ITrainingByUser)
        : undefined,
    [trainingByUserJson]
  );

  return {
    exercise,
    trainingByUser,
    listExerciseHistory: filteredHistory,
    colors,
  };
}

export type UserExerciseStackReturnType = ReturnType<
  typeof useUserExerciseStack
>;
