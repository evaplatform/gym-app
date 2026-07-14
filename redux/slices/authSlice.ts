// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserWithTokens } from "@/services/AuthServices/types";
import { log } from "@/shared/utils/log";

export interface AuthState {
  isLoggedIn: boolean;
  isReady: boolean;
  loginMessage?: string;
  isInitialLoadingFinished?: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isReady: false,
  loginMessage: undefined,
  isInitialLoadingFinished: false,
};

export const setAuthHeaders = (user: UserWithTokens | null) => {
  if (user) {
    log("Saving tokens to AsyncStorage");
    log("User token:", user.token);
    log("User refresh token:", user.googleTokens?.refresh_token);

    api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    api.defaults.headers.common["x-refresh-token"] =
      user.googleTokens?.refresh_token;
  } else {
    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["x-refresh-token"];
  }
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user: UserWithTokens, { dispatch }) => {
    try {
      log("Logging in user:", user);
      setAuthHeaders(user);
      dispatch(setLoggedIn(true));
      return user;
    } catch (error) {
      log("Error during login:", error);
      throw error;
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (message: string | undefined = undefined, { dispatch }) => {
    try {
      setAuthHeaders(null);
      dispatch(setLoggedIn(false));
      if (message) {
        dispatch(setLoginMessage(message));
      }
      return true;
    } catch (error) {
      log("Error during logout:", error);
      throw error;
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setReady: (state, action) => {
      state.isReady = action.payload;
    },
    setLoginMessage: (state, action) => {
      state.loginMessage = action.payload;
    },
    setInitialLoadingFinished: (state, action) => {
      state.isInitialLoadingFinished = action.payload;
    },
  },
});

export const { setLoggedIn, setReady, setLoginMessage, setInitialLoadingFinished } = authSlice.actions;

export default authSlice.reducer;
