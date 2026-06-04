import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import useCustomStyle from "@/hooks/useCustomStyle";
import { IExercise } from "@/shared/models/IExercise";
import { ExerciseHistoryServices } from "@/services/ExerciseHistoryServices";

export function useUserExerciseStack() {
  const { colors } = useCustomStyle();

  const { exercise: exerciseJson, user: userJson } = useLocalSearchParams();

  const [listExerciseHistory, setListExerciseHistory] = useState<
    IExerciseHistory[]
  >([]);

  const exerciseObj = exerciseJson
    ? (JSON.parse(exerciseJson as string) as IExercise)
    : undefined;

  const loadData = useCallback(async () => {
    const userObj = userJson ? JSON.parse(userJson as string) : undefined;
    const userId = userObj?.id;

    const listExerciseHistory =
      await ExerciseHistoryServices.getAllByUserId(userId);

    const filteredHistory = listExerciseHistory?.filter(
      (history: IExerciseHistory) => history.exerciseId === exerciseObj?.id,
    ) as IExerciseHistory[];

    setListExerciseHistory(filteredHistory);
  }, [exerciseJson, userJson]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const trainingByUser = undefined;

  return {
    exercise: exerciseObj,
    trainingByUser,
    listExerciseHistory,
    colors,
  };
}
