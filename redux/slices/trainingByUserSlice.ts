import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import {
  clearAllTrainingsByUser,
  fetchTrainingByUser,
} from "../actions/trainingByUsersActions";

export interface TrainingByUserState {
  trainingByUserList: ITrainingByUser[] | null;
  loading: boolean;
  error?: string;
}

const initialState: TrainingByUserState = {
  trainingByUserList: [],
  loading: false,
  error: undefined,
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTrainingByUser: (state, action: PayloadAction<ITrainingByUser[]>) => {
      state.trainingByUserList = action.payload;
    },
    clearTrainingByUserState: (state) => {
      state.trainingByUserList = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchTrainingByUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchTrainingByUser.fulfilled, (state, action) => {
      state.trainingByUserList = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTrainingByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearAllTrainingsByUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllTrainingsByUser.fulfilled, (state) => {
      state.trainingByUserList = initialState.trainingByUserList;
      state.loading = false;
    });
    builder.addCase(clearAllTrainingsByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setTrainingByUser, clearTrainingByUserState } = trainingSlice.actions;
export default trainingSlice.reducer;
