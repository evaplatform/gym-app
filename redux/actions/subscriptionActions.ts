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
  email?: string; // ✅ novo parâmetro
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
  async (inputData, { getState, rejectWithValue }) => {
    try {
      const state: RootReduxState = getState();

      if (!inputData?.ignoreCheckState) {
        if ((state.subscription?.subscriptionList ?? []).length > 0) {
          return state.subscription?.subscriptionList ?? [];
        }
      }

      // ✅ Usa email do parâmetro OU do Redux
      const email = inputData?.email ?? state.user?.user?.email;

      if (!email) {
        return rejectWithValue("User email not found");
      }

      const res =
        await PaymentSubscriptionService.listSubscriptionsByUser(email);

      if (res && res.subscriptions && res.subscriptions.length > 0) {
        return res.subscriptions;
      }

      return [];
    } catch (error) {
      return rejectWithValue("Failed to fetch subscriptions");
    }
  },
);
