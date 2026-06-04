import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGpsMetricsTemp } from "@/shared/models/IGpsMetricsTemp";
import {
  clearAllGpsMetricsTemp,
  clearGpsMetricsTemp,
  fetchGpsMetricsTemp,
  updateGpsMetricsTemp,
} from "../actions/gpsMetricsTempLocalActions";

export interface GpsMetricsTempLocalState {
  list: IGpsMetricsTemp[] | null;
  loading: boolean;
  error?: string;
}

const initialState: GpsMetricsTempLocalState = {
  list: [],
  loading: false,
  error: undefined,
};

const gpsMetricsTempLocalSlice = createSlice({
  name: "gpsMetricsTempLocal",
  initialState,
  reducers: {
    setGpsMetricsTemp: (state, action: PayloadAction<IGpsMetricsTemp[]>) => {
      state.list = action.payload;
    },
    resetAllGpsMetricsTempState: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchGpsMetricsTemp.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchGpsMetricsTemp.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchGpsMetricsTemp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearGpsMetricsTemp.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearGpsMetricsTemp.fulfilled, (state, action) => {
      state.list =
        state.list?.filter((metric) => metric.exerciseId !== action.payload) ||
        [];
      state.loading = false;
    });
    builder.addCase(clearGpsMetricsTemp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing all data
    builder.addCase(clearAllGpsMetricsTemp.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllGpsMetricsTemp.fulfilled, (state, action) => {
      state.list = initialState.list;
      state.loading = false;
    });
    builder.addCase(clearAllGpsMetricsTemp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // updating data
    builder.addCase(updateGpsMetricsTemp.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateGpsMetricsTemp.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && state.list) {
        state.list = state.list.map((metric) =>
          action.payload && metric.exerciseId === action.payload.exerciseId
            ? action.payload
            : metric,
        );
      }
    });
    builder.addCase(updateGpsMetricsTemp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setGpsMetricsTemp, resetAllGpsMetricsTempState} =
  gpsMetricsTempLocalSlice.actions;
export default gpsMetricsTempLocalSlice.reducer;
