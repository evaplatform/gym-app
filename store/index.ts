import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "@store/slices/exampleSlice";

export const store = configureStore({
    reducer: {
        example: exampleReducer,
    },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
