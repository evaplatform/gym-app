import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "@/redux/slices/exampleSlice";
import userReducer from "@/redux/slices/userSlice";

export const store = configureStore({
    reducer: {
        example: exampleReducer,
        user: userReducer
    },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
