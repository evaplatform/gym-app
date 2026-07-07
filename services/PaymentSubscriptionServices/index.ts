import { get, post, put, remove } from "../api";
import {
  IBillingDayPreviewRequest,
  IBillingDayPreviewResponse,
  ICreateSubscriptionRequest,
  ICreateSubscriptionResponse,
  IReactivateSubscriptionRequest,
  IRetryPaymentRequest,
  ISetupIntentRequest,
  ISetupIntentResponse,
  ISubscriptionByUserResponse,
  IUpdateBillingDayRequest,
  IUpdatePaymentMethodRequest,
} from "./interfaces";

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

  static async updatePaymentMethod(body: IUpdatePaymentMethodRequest) {
    return put<IUpdatePaymentMethodRequest, { message: string }>(
      `/payment-subscription/${body.subscriptionId}/payment-method`,
      body,
    );
  }

  static async retryPayment(subscriptionId: string) {
    return post<IRetryPaymentRequest, { message: string; status: string }>(
      `/payment-subscription/${subscriptionId}/retry-payment`,
      { subscriptionId },
    );
  }

  static async reactivateSubscription(body: IReactivateSubscriptionRequest) {
    return post<IReactivateSubscriptionRequest, ICreateSubscriptionResponse>(
      "/payment-subscription/reactivate",
      body,
    );
  }

  // ── Billing Day ──────────────────────────────

  static async previewBillingDay(body: IBillingDayPreviewRequest) {
    return post<IBillingDayPreviewRequest, IBillingDayPreviewResponse>(
      "/payment-subscription/billing-day/preview",
      body,
    );
  }

  static async updateBillingDay(body: IUpdateBillingDayRequest) {
    return put<IUpdateBillingDayRequest, { message: string }>(
      `/payment-subscription/${body.subscriptionId}/billing-day`,
      body,
    );
  }
}