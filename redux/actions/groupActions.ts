import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { IGroup } from "@/shared/models/IGroup";
import { GroupServices } from "@/services/GroupServices";
import { toPlainObject } from "@/database/utils/toPlainObject";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = {
  dataBase?: LocalDatabaseServices;
  ignoreCheckState?: boolean;
} | void;

type Output = IGroup[] | null;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const fetchGroups = createAsyncThunk<Output, Input, State>(
  "group/fetchGroups",
  async (
    inputData,
    { getState, rejectWithValue, extra },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        if (
          Array.isArray(state.group.groupList) &&
          state.group.groupList.length > 0
        ) {
          log("group found in Redux state");
          return state.group.groupList;
        }
      }

      // 2. Verificar no banco local
      const databaseLocalService =
        inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        return rejectWithValue("Database service not available");
      }

      const groupList = databaseLocalService.groupLocalService?.getAll();

      if (Array.isArray(groupList) && groupList.length > 0) {
        log("groups found in the local database");
        // 🔥 Converter para objetos JS puros
        const plainList = toPlainObject(groupList) as Output;
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

      const res = await GroupServices.getByUserId(userId);

      if (res?.length > 0) {
        databaseLocalService.groupLocalService?.saveList(res);
        log("groups found in the API");
        return res;
      }

      return [];
    } catch (error) {
      log("Error fetching groups:", error);
      return rejectWithValue("Failed to fetch groups");
    }
  },
);

export const updateGroup = createAsyncThunk<
  IGroup | null,
  ApiRequestType<IGroup & { changeOnlyLocally?: boolean }>,
  State
>(
  "group/updateGroup",
  async (groupData, { getState, rejectWithValue, extra }) => {
    try {
      //  1. Update in the API
      if (!groupData?.changeOnlyLocally) {
        const res = await GroupServices.update(groupData);

        if (!res) {
          return rejectWithValue("No response from API");
        }
      }

      //  2. Update in the local database
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService && groupData?.id) {
        const res =
          await databaseLocalService.groupLocalService?.createOrUpdate(
            groupData.id,
            groupData,
          );
        if (!res) {
          return rejectWithValue("Failed to update group in local database");
        }
        return res;
      }

      return null;
    } catch (error) {
      log("Error updating group:", error);
      return rejectWithValue("Failed to update group");
    }
  },
);

export const clearAllGroups = createAsyncThunk<void, void, State>(
  "group/clearAllGroups",
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      const databaseLocalService = extra.getDatabaseService();

      if (databaseLocalService) {
        databaseLocalService.groupLocalService?.resetAll();
      }
    } catch (error) {
      log("Error clearing all groups:", error);
      return rejectWithValue("Failed to clear all groups");
    }
  },
);
