import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { log } from "@/shared/utils/log";

import {
  clearAllExercises,
  fetchExercise,
  updateExercise,
} from "../actions/exerciseActions";
import { IExercise } from "@/shared/models/IExercise";

export interface ExerciseState {
  list: IExercise[] | null;
  loading: boolean;
  error?: string;
}

const initialState: ExerciseState = {
  list: [],
  loading: false,
  error: undefined,
};

const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setExercise: (state, action: PayloadAction<IExercise[]>) => {
      state.list = action.payload;
    },
    clearExerciseState: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchExercise.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchExercise.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchExercise.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // updating data
    builder.addCase(updateExercise.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateExercise.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateExercise.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearAllExercises.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllExercises.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(clearAllExercises.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setExercise, clearExerciseState } = exerciseSlice.actions;
export default exerciseSlice.reducer;
