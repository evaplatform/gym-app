import { LocalDatabaseServices } from "@/database/types/LocalDatabaseServices";
import { log } from "@/shared/utils/log";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootReduxState } from "../index";
import { PaymentSubscriptionService } from "@/services/PaymentSubscriptionServices";
import { ISubscriptionByUserData } from "@/services/PaymentSubscriptionServices/interfaces";

/**
 * @description the first parameter from  async (input: Input, { getState, rejectWithValue })
 */
type Input = {
  ignoreCheckState?: boolean;
} | void;

type Output = ISubscriptionByUserData[] | null;

type State = {
  state: RootReduxState;
  rejectValue: string;
  extra: {
    databaseService: LocalDatabaseServices;
    getDatabaseService: () => LocalDatabaseServices | null;
  };
};

export const fetchSubscription = createAsyncThunk<Output, Input, State>(
  "subscription/fetchSubscription",
  async (
    inputData,
    { getState, rejectWithValue, extra },
  ): Promise<Output | ReturnType<typeof rejectWithValue>> => {
    try {
      const state: RootReduxState = getState();

      // 1. Verificar no estado Redux
      if (!inputData?.ignoreCheckState) {
        if ((state.subscription?.subscriptionList ?? []).length > 0) {
          log("subscription found in Redux state");
          return state.subscription?.subscriptionList ?? [];
        }
      }

      const user = state.user?.user;

      if (!user) {
        return rejectWithValue("User ID not found in state");
      }

      // 2. Buscar na API
      const res = await PaymentSubscriptionService.listSubscriptionsByUser(
        user.email,
      );

      if (res && res.subscriptions && res.subscriptions.length > 0) {
        return res.subscriptions;
      }

      log("No subscriptions found");
      return [];
    } catch (error) {
      log("Error fetching subscriptions:", error);
      return rejectWithValue("Failed to fetch subscriptions");
    }
  },
);

//     'exercise/updateExercise',
//     async (exerciseData, { getState, rejectWithValue, extra }) => {
//         try {

//             //  1. Update in the API
//             if (!exerciseData?.changeOnlyLocally) {
//                 const res = await ExerciseServices.update(exerciseData);

//                 if (!res) {
//                     return rejectWithValue('No response from API');
//                 }
//             }

//             //  2. Update in the local database
//             const databaseLocalService = extra.getDatabaseService();

//             if (databaseLocalService && exerciseData?.id) {
//                 const res = await databaseLocalService.exerciseLocalService?.createOrUpdate(exerciseData.id, exerciseData);
//                 if (!res) {
//                     return rejectWithValue('Failed to update exercise in local database');
//                 }
//                 return res;
//             }

//             return null;
//         } catch (error) {
//             log("Error updating exercise:", error);
//             return rejectWithValue('Failed to update exercise');
//         }
//     }
// );
