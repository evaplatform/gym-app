import { get, post, remove } from "../api";
import {
  ICreateSubscriptionRequest,
  ICreateSubscriptionResponse,
  ISetupIntentRequest,
  ISetupIntentResponse,
  ISubscriptionByUserResponse,
} from "./intefaces";

export class PaymentSubscriptionService {
  static async setupIntent(body: ISetupIntentRequest) {
    return post<ISetupIntentRequest, ISetupIntentResponse>(
      "/payment-subscription/setup-intent",
      body,
    );
  }

  static async createFromSetupIntent(body: ICreateSubscriptionRequest) {
    return post<ICreateSubscriptionRequest, ICreateSubscriptionResponse>(
      "/payment-subscription/create-from-setup",
      body,
    );
  }

  static async listSubscriptionsByUser(email: string) {
    return get<ISubscriptionByUserResponse>(
      "/payment-subscription?email=" + email,
    );
  }

  static async cancelSubscription(subscriptionId: string) {
    return remove(`/payment-subscription/${subscriptionId}`);
  }
}
