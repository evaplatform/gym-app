import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import {
  fetchExerciseHistory,
  addNewExerciseHistory,
  clearAllExerciseHistory,
} from "../actions/exerciseHistoryActions";

export interface ExerciseHistoryState {
  listExerciseHistory: IExerciseHistory[] | null;
  loading: boolean;
  error?: string;
}

const initialState: ExerciseHistoryState = {
  listExerciseHistory: [],
  loading: false,
  error: undefined,
};

const exerciseHistorySlice = createSlice({
  name: "exerciseHistory",
  initialState,
  reducers: {
    setExerciseHistory: (state, action: PayloadAction<IExerciseHistory[]>) => {
      state.listExerciseHistory = action.payload;
    },
    clearExerciseHistoryState: (state) => {
      state.listExerciseHistory = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchExerciseHistory.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchExerciseHistory.fulfilled, (state, action) => {
      state.listExerciseHistory = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchExerciseHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // updating data
    builder.addCase(addNewExerciseHistory.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(addNewExerciseHistory.fulfilled, (state, action) => {
      if (action.payload) {
        state.listExerciseHistory = [
          ...(state.listExerciseHistory || []),
          action.payload,
        ];
      }
      state.loading = false;
    });
    builder.addCase(addNewExerciseHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearAllExerciseHistory.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllExerciseHistory.fulfilled, (state) => {
      state.listExerciseHistory = [];
      state.loading = false;
    });
    builder.addCase(clearAllExerciseHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setExerciseHistory,  clearExerciseHistoryState } =
  exerciseHistorySlice.actions;
export default exerciseHistorySlice.reducer;
