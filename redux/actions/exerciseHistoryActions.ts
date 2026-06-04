import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import { ExerciseHistoryServices } from "@/services/ExerciseHistoryServices";
import { toPlainObject } from "@/database/utils/toPlainObject";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = {
  dataBase?: LocalDatabaseServices;
  ignoreCheckState?: boolean;
} | void;

type Output = IExerciseHistory[] | null;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const fetchExerciseHistory = createAsyncThunk<Output, Input, State>(
  "exerciseHistory/fetchExerciseHistory",
  async (
    inputData,
    { getState, rejectWithValue, extra },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        const listExerciseHistory = state.exerciseHistory?.listExerciseHistory ?? [];
        if (listExerciseHistory.length > 0) {
          log("exercise history found in Redux state");
          return listExerciseHistory;
        }
      }

      // 2. Verificar no banco local
      const databaseLocalService =
        inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        return rejectWithValue("Database service not available");
      }

      const exerciseHistoryList =
        databaseLocalService.exerciseHistoryLocalService?.getAll();

      if (exerciseHistoryList?.length > 0) {
        log("exercise history found in the local database");

        // 🔥 Converter para objetos JS puros
        const plainList = toPlainObject(exerciseHistoryList) as Output;
        return plainList;
      }

      // 3. Buscar da API
      const user = state.user?.user;
      if (!user) {
        return rejectWithValue("User not authenticated") as any;
      }

      const userId = user.id;
      if (!userId) {
        return rejectWithValue("User ID not available") as any;
      }

      const res = await ExerciseHistoryServices.getAllByUserId(userId);

      if (res?.length > 0) {
        databaseLocalService.exerciseHistoryLocalService?.saveList(res);
        log("exercise history found in the API");
        return res;
      }

      return [];
    } catch (error) {
      log("Error fetching exercise history:", error);
      return rejectWithValue("Failed to fetch exercise history");
    }
  },
);

export const addNewExerciseHistory = createAsyncThunk<
  IExerciseHistory | null,
  IExerciseHistory,
  State
>(
  "exerciseHistory/addNewExerciseHistory",
  async (exerciseData, { rejectWithValue, extra }) => {
    try {
      //  1. Update in the API
      const res = await ExerciseHistoryServices.create(exerciseData);

      if (!res) {
        return rejectWithValue("No response from API");
      }

      // 2. Update in the local database
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        const res =
          await databaseLocalService?.exerciseHistoryLocalService?.add(
            exerciseData,
          );

        return res ?? null;
      }

      return null;

      // 3. Return the updated exercise
      // log("Exercise updated successfully:", res);
      // return res;
    } catch (error) {
      log("Error updating exercise:", error);
      return rejectWithValue("Failed to update exercise");
    }
  },
);

export const clearAllExerciseHistory = createAsyncThunk<void, void, State>(
  "exerciseHistory/clearAllExerciseHistory",
  async (_, { extra }) => {
    const databaseLocalService = extra.getDatabaseService();
    if (!databaseLocalService) {
      log("Database service not available");
      return;
    }
    await databaseLocalService?.exerciseHistoryLocalService?.resetAll();
  },
);
