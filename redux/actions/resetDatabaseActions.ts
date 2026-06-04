import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { createAsyncThunk, RootReduxState } from "@reduxjs/toolkit";
import { fetchExercise } from "./exerciseActions";
import { fetchTraining } from "./trainingActions";
import { fetchExerciseHistory } from "./exerciseHistoryActions";
import { fetchTrainingByUser } from "./trainingByUsersActions";
import { fetchGroups } from "./groupActions";
import { clearTrainingState } from "../slices/trainingSlice";
import { clearExerciseState } from "../slices/exerciseSlice";
import { clearExerciseHistoryState } from "../slices/exerciseHistorySlice";
import { clearGroupsState } from "../slices/groupSlice";
import { clearTrainingByUserState } from "../slices/trainingByUserSlice";
import { resetAllGpsMetricsTempState } from "../slices/gpsMetricsTempLocalSlice";
import { fetchGpsMetricsTemp } from "./gpsMetricsTempLocalActions";
import { clearUser } from "../slices/userSlice";

type Input = { resetUser?: boolean; fetchAll?: boolean } | void;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const resetAllUserDatabase = createAsyncThunk<boolean, Input, State>(
  "resetDatabase/resetAllUserDatabase",
  async (inputData, { getState, rejectWithValue, extra, dispatch }) => {
    try {
      const database = extra.getDatabaseService();

      if (!database) {
        return rejectWithValue("Database service not available");
      }

      console.log("[RESET] - Iniciando limpeza...");

      //  Limpar APENAS o estado Redux (não o banco ainda)
      console.log("[RESET] - Limpando estado Redux...");
      await Promise.all([
        dispatch(clearTrainingState()),
        dispatch(clearExerciseState()),
        dispatch(clearExerciseHistoryState()),
        dispatch(clearGroupsState()),
        dispatch(clearTrainingByUserState()),
        dispatch(resetAllGpsMetricsTempState()),
      ]);

      if (inputData?.resetUser) {
        dispatch(clearUser());
      }

      // // clean storage
      // const storagesArray = Object.values(StoragesEnum);
      // await AsyncStorage.multiRemove(storagesArray)

      //  limpar o banco de dados
      console.log("[RESET] - Limpando banco de dados...");
      await Promise.all([
        database.academyLocalService.resetAll(),
        database.trainingLocalService.resetAll(),
        database.exerciseLocalService.resetAll(),
        database.exerciseHistoryLocalService.resetAll(),
        database?.groupLocalService?.resetAll(),
        database.trainingByUserLocalService.resetAll(),
        database.gpsMetricsTempLocalService?.resetAll(),
        inputData?.resetUser ? database.userLocalService.resetAll() : Promise.resolve(),
      ]);

      // if (inputData?.resetUser) {
      //   await database.userLocalService.resetAll();
      // }

      //  Buscar novos dados
      if (inputData?.fetchAll) {
        console.log("[RESET] - Buscando novos dados...");
        await Promise.all([
          dispatch(fetchTraining({ ignoreCheckState: true })),
          dispatch(fetchExercise({ ignoreCheckState: true })),
          dispatch(fetchExerciseHistory({ ignoreCheckState: true })),
          dispatch(fetchGroups({ ignoreCheckState: true })),
          dispatch(fetchTrainingByUser({ ignoreCheckState: true })),
          dispatch(fetchGpsMetricsTemp({ ignoreCheckState: true })),
        ]);
      }

      console.log("[RESET] - Concluído!");
      return true;
    } catch (error: any) {
      console.error("[RESET] - Erro:", error);
      return rejectWithValue(error.message);
    }
  },
);
