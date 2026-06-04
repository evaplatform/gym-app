import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import { TrainingByUserServices } from "@/services/TrainingByUserServices";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { toPlainObject } from "@/database/utils/toPlainObject";

type Input = {
  dataBase?: LocalDatabaseServices;
  ignoreCheckState?: boolean;
} | void;

type Output = ITrainingByUser[] | null;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const fetchTrainingByUser = createAsyncThunk<Output, Input, State>(
  "trainingByUser/fetchTrainingByUser",
  async (
    inputData,
    { getState, rejectWithValue, extra },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        const trainingByUserList = state.trainingByUser.trainingByUserList ?? [];
        if (trainingByUserList.length > 0) {
          log("training by user found in Redux state");
          return trainingByUserList;
        }
      }

      const id = state.user?.user?.id;
      if (!id) {
        return rejectWithValue("User ID not found in state");
      }

      // 2. Verificar no banco local
      const databaseLocalService =
        inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        return rejectWithValue("Database service not available");
      }

      const trainingByUserList =
        databaseLocalService.trainingByUserLocalService?.getAll();

      if (trainingByUserList?.length > 0) {
        log("training by user found in the local database");

        // 🔥 Converter para objetos JS puros
        const plainList = toPlainObject(trainingByUserList) as Output;
        return plainList;
      }

      // 3. Buscar da API
      const res = await TrainingByUserServices.getByUserId(id);

      if (res?.length > 0) {
        databaseLocalService.trainingByUserLocalService?.saveList(res);
        log("trainings added in the local database");
        return res;
      }

      log("No trainings found");
      return [];
    } catch (error) {
      log("Error fetching trainings:", error);
      return rejectWithValue("Failed to fetch trainings");
    }
  },
);

export const clearAllTrainingsByUser = createAsyncThunk<void, void, State>(
  "trainingByUser/clearAllTrainingsByUser",
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        databaseLocalService.trainingByUserLocalService?.resetAll();
      }
    } catch (error) {
      log("Error clearing all trainings by user:", error);
      return rejectWithValue("Failed to clear all trainings by user");
    }
  },
);

export const updateManyTrainingByUser = createAsyncThunk<
  ITrainingByUser[],
  Partial<ITrainingByUser & { changeOnlyLocally?: boolean }>[],
  State
>(
  "trainingByUser/updateManyTrainingByUser",
  async (trainingsByUserData, { getState, rejectWithValue, extra }) => {
    try {
      // 1. Update in the API
      for (const trainingByUserData of trainingsByUserData) {
        if (!trainingByUserData?.changeOnlyLocally) {
          // const trainingDataWithoutUserNotes = { ...trainingByUserData };
          // delete trainingDataWithoutUserNotes.userNotes;

          const res = await TrainingByUserServices.update(
            trainingByUserData as ApiRequestType<ITrainingByUser>,
          );
          if (!res) {
            log("No response from API for trainingByUser:", trainingByUserData);
          }
        }
      }

      // 2. Update in the local database
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        const res =
          await databaseLocalService.trainingByUserLocalService?.updateMany(
            trainingsByUserData,
          );
        return res;
      }

      return [];
    } catch (error) {
      log("Error updating many exerciseByUser:", error);
      return rejectWithValue("Failed to update many exerciseByUser");
    }
  },
);
