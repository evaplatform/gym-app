import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { IGpsMetricsTemp } from "@/shared/models/IGpsMetricsTemp";
import { toPlainObject } from "@/database/utils/toPlainObject";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = {
  dataBase?: LocalDatabaseServices;
  ignoreCheckState?: boolean;
} | void;

type Output = IGpsMetricsTemp[] | null;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const fetchGpsMetricsTemp = createAsyncThunk<Output, Input, State>(
  "gpsMetricsTemp/fetchGroups",
  async (
    inputData,
    { getState, rejectWithValue, extra },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        const gpsMetricsTempList = state.gpsMetricsTemp.list ?? [];
        if (gpsMetricsTempList.length > 0) {
          log("GPS metrics temp found in Redux state");
          return gpsMetricsTempList;
        }
      }

      // 2. Verificar no banco local
      const databaseLocalService = inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        return rejectWithValue("Database service not available");
      }

      const gpsMetricsTempList = databaseLocalService.gpsMetricsTempLocalService?.getAll();

      log("Fetched GPS metrics temp from local database:", gpsMetricsTempList);

      if (Array.isArray(gpsMetricsTempList) && gpsMetricsTempList.length > 0) {
        log("GPS metrics temp found in the local database");
        
        // 🔥 Converter para objetos JS puros (já estava convertendo manualmente, agora usa helper)
        const plainList = toPlainObject(gpsMetricsTempList) as Output;
        return plainList;
      }

      return [];
    } catch (error) {
      log("Error fetching GPS metrics temp:", error);
      return rejectWithValue("Failed to fetch GPS metrics temp");
    }
  },
);

export const updateGpsMetricsTemp = createAsyncThunk<
  IGpsMetricsTemp | null,
  ApiRequestType<IGpsMetricsTemp & { changeOnlyLocally?: boolean }>,
  State
>(
  "gpsMetricsTemp/updateGpsMetricsTemp",
  async (gpsMetricsTempData, { getState, rejectWithValue, extra }) => {
    try {
      //  1. Update in the local database
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService && gpsMetricsTempData?.exerciseId) {
        const res =
          databaseLocalService.gpsMetricsTempLocalService?.createOrUpdate(
            gpsMetricsTempData.exerciseId,
            gpsMetricsTempData as IGpsMetricsTemp,
          );
        if (!res) {
          return rejectWithValue(
            "Failed to update GPS metrics temp in local database",
          );
        }
        return res;
      }

      return null;
    } catch (error) {
      log("Error updating GPS metrics temp:", error);
      return rejectWithValue("Failed to update GPS metrics temp");
    }
  },
);

export const clearGpsMetricsTemp = createAsyncThunk<string, string, State>(
  "gpsMetricsTemp/clearGpsMetricsTemp",
  async (exerciseId, { getState, rejectWithValue, extra }) => {
    try {
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        databaseLocalService.gpsMetricsTempLocalService?.deleteByExerciseId(
          exerciseId,
        );
      }

      return exerciseId; // Retorna o exerciseId deletado
    } catch (error) {
      log("Error clearing GPS metrics temp:", error);
      return rejectWithValue("Failed to clear GPS metrics temp");
    }
  },
);

export const clearAllGpsMetricsTemp = createAsyncThunk<void, void, State>(
  "gpsMetricsTemp/clearAllGpsMetricsTemp",
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        databaseLocalService.gpsMetricsTempLocalService?.resetAll();
      }
    } catch (error) {
      log("Error clearing all GPS metrics temp:", error);
      return rejectWithValue("Failed to clear all GPS metrics temp");
    }
  },
);
