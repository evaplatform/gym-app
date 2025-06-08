import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateRes } from "@/services/LoginServices/types";
import { IUser } from "@/shared/interfaces/IUser";
import { loginUser } from "@/shared/utils/loginUser";
import { getUserFromStorage, saveUserToStorage } from "@/shared/utils/userStore";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { assembleUser } from "@/shared/utils/assembleUser";

interface UserState {
    user: IUser | null;
    loading: boolean;
    error?: string;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: undefined,
};

export const fetchUser = createAsyncThunk<IUser, void, { state: RootState }>('user/fetchUser', async (_, { getState, rejectWithValue }) => {
    // try {
    // look for user in local storage
    const state = getState();
    if (state.user?.user) return state.user.user;

    // if not found, fetch user from local storage
    const localUser = await getUserFromStorage();
    if (localUser) return assembleUser(localUser);

    // if not found, fetch user from API
    const requestBody = await loginUser();
    const userData = await LoginServices.createOrLogin(requestBody);
    saveUserToStorage(userData);

    const data = assembleUser(userData);

    return data;
    // } catch (_) {
    //     return rejectWithValue('Failed to fetch user');
    // }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
