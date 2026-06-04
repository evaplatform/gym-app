import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserWithTokens } from "@/services/AuthServices/types";
import { addUser, fetchUser } from "../actions/userActions";
import { log } from "@/shared/utils/log";

export interface UserState {
  user: UserWithTokens | null;
  loading: boolean;
  error?: string;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserWithTokens>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      log("Clearing user from state...");
      state.user = null;
      log("User cleared from state.");
    },
  },
  extraReducers: (builder) => {
    // getting user
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      log("User fetched successfully:", action.payload);
      // Aqui o usuário é salvo no estado Redux, independente da origem dos dados
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // add user
    builder.addCase(addUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
