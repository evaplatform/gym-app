import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { UserWithTokens } from "@/services/AuthServices/types";
import { log } from "@/shared/utils/log";
import { RootReduxState, createAsyncThunk } from "@reduxjs/toolkit";
import { logoutUser } from "../slices/authSlice";
import { toPlainObject } from "@/database/utils/toPlainObject";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = { dataBase?: LocalDatabaseServices } | void;

type Output = UserWithTokens;
type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

/**
 * @description thunk to fetch user data
 * 1. Check local state first
 * 2. If not found, check local storage
 * 3. If not found, fetch from API
 * 4. Save to local storage for future use
 * @TODO - currently the API fetch is commented out as it requires auth token handling
 *
 * @returns UserWithTokens object
 */
export const fetchUser = createAsyncThunk<Output, Input, State>(
  "user/fetchUser",
  async (
    inputData,
    { getState, rejectWithValue, extra, dispatch },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      log("Buscando usuário no estado Redux:", state.user?.user);

      // 1. Verificar no estado Redux primeiro
      if (state.user?.user) {
        log("Usuário encontrado no estado Redux");
        return state.user.user;
      }

      log(
        "Usuário não encontrado no estado Redux, verificando no banco local...",
      );

      // 2. Verificar no banco local
      const databaseLocalService =
        inputData?.dataBase ?? extra.getDatabaseService();

      if (!databaseLocalService) {
        log("Database service não disponível!");
        return rejectWithValue("Database service not available");
      }

      const user = databaseLocalService.userLocalService?.getUser();

      if (user) {
        log("Usuário encontrado no banco local:", user);

        // 🔥 Converter para objeto JS puro
        const userPlain = toPlainObject(user);
        return userPlain as Output;
      }

      // 3. Se não encontrado, deslogar
      log("Usuário não encontrado no banco local, deslogando...");
      await dispatch(logoutUser());

      return rejectWithValue("User not found in any source") as any;
    } catch (error) {
      log("Erro ao buscar usuário:", error);
      return rejectWithValue("Failed to fetch user");
    }
  },
);

export const addUser = createAsyncThunk<
  UserWithTokens,
  UserWithTokens,
  {
    rejectValue: string;
    extra: { getDatabaseService: () => LocalDatabaseServices | null };
  }
>("user/saveUser", async (userData, { rejectWithValue, extra }) => {
  try {
    const { getDatabaseService } = extra;
    const databaseLocalService = getDatabaseService();

    if (!databaseLocalService) {
      log("Database service não disponível!");
      return rejectWithValue("Database service not available");
    }

    log("Salvando usuário no banco local:", userData);

    const newUser = databaseLocalService.userLocalService.saveUser(userData);
    log("Usuário salvo com sucesso:", newUser);

    return newUser;
  } catch (error) {
    log("Erro ao criar usuário:", error);
    return rejectWithValue("Failed to create user");
  }
});

export const clearUser = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
    extra: { getDatabaseService: () => LocalDatabaseServices | null };
  }
>("user/clearUser", async (_, { rejectWithValue, extra }) => {
  try {
    const { getDatabaseService } = extra;
    const databaseLocalService = getDatabaseService();
    if (!databaseLocalService) {
      log("Database service não disponível!");
      return rejectWithValue("Database service not available");
    }
    log("Limpando dados do usuário no banco local...");
    await databaseLocalService.userLocalService.resetAll();
    log("Dados do usuário limpos com sucesso");
  } catch (error) {
    log("Erro ao limpar dados do usuário:", error);
    return rejectWithValue("Failed to clear user data");
  }
});
