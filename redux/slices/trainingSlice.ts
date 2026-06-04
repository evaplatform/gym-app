import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { clearAllTrainings, fetchTraining } from "../actions/trainingActions";
import { ITraining } from "@/shared/models/ITraining";

export interface TrainingState {
  list: ITraining[] | null;
  loading: boolean;
  error?: string;
}

const initialState: TrainingState = {
  list: [],
  loading: false,
  error: undefined,
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTraining: (state, action: PayloadAction<ITraining[]>) => {
      state.list = action.payload;
    },
    clearTrainingState: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchTraining.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchTraining.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTraining.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearAllTrainings.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllTrainings.fulfilled, (state) => {
      state.list = [];
      state.loading = false;
    });
    builder.addCase(clearAllTrainings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setTraining, clearTrainingState } = trainingSlice.actions;
export default trainingSlice.reducer;
