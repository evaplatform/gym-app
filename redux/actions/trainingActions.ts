import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { ITraining } from "@/shared/models/ITraining";
import { TrainingServices } from "@/services/TrainingServices";
import { toPlainObject } from "@/database/utils/toPlainObject";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = { dataBase?: LocalDatabaseServices; ignoreCheckState?: boolean } | void;

type Output = ITraining[] | null;

type State = {
    state: RootReduxState;
    rejectValue: string;
    extra: { databaseService: LocalDatabaseServices, getDatabaseService: () => LocalDatabaseServices | null }
};

export const fetchTraining = createAsyncThunk<Output, Input, State>(
  'training/fetchTraining',
  async (inputData, { getState, rejectWithValue, extra }): Promise<Output | ReturnType<typeof rejectWithValue>> => {

    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        if ((state.training?.list ?? []).length > 0) {
          log("training found in Redux state");
          return state.training?.list ?? [];
        }
      }

      // 2. Verificar no banco local
      const databaseLocalService = inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        return rejectWithValue('Database service not available');
      }

      const trainingList = databaseLocalService.trainingLocalService?.getAll();

      if (trainingList?.length > 0) {
        log("training found in the local database");
        
        // 🔥 Converter para objetos JS puros
        const plainList = toPlainObject(trainingList) as Output;
        return plainList;
      }

      // 3. Buscar da API
      const res = await TrainingServices.getAllByUserId();
      
      if (res?.length > 0) {
        databaseLocalService.trainingLocalService?.saveList(res);
        log("trainings added in the local database");
        return res;
      }

      log("No trainings found");
      return [];
    } catch (error) {
      log("Error fetching trainings:", error);
      return rejectWithValue('Failed to fetch trainings');
    }
  }
);
export const clearAllTrainings = createAsyncThunk<void, void, State>(
    'training/clearAllTrainings',
    async (_, { extra }) => {
        const databaseLocalService = extra.getDatabaseService();

        if (!databaseLocalService) {
            log('Database service not available');
            return;
        }
        await databaseLocalService.trainingLocalService?.resetAll();
        log('All trainings cleared from local database');
    }       
);                  