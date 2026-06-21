import { get, post, put, remove } from "../api";
import {
  ICreateSubscriptionRequest,
  ICreateSubscriptionResponse,
  IReactivateSubscriptionRequest,
  IRetryPaymentRequest,
  ISetupIntentRequest,
  ISetupIntentResponse,
  ISubscriptionByUserResponse,
  IUpdatePaymentMethodRequest,
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

  static async updatePaymentMethod(body: IUpdatePaymentMethodRequest) {
    return put<IUpdatePaymentMethodRequest, { message: string }>(
      `/payment-subscription/${body.subscriptionId}/payment-method`,
      body,
    );
  }

  // Tentar cobrar novamente (para assinaturas past_due)
  static async retryPayment(subscriptionId: string) {
    return post<IRetryPaymentRequest, { message: string; status: string }>(
      `/payment-subscription/${subscriptionId}/retry-payment`,
      { subscriptionId },
    );
  }

  // Reativar assinatura cancelada
  static async reactivateSubscription(body: IReactivateSubscriptionRequest) {
    return post<IReactivateSubscriptionRequest, ICreateSubscriptionResponse>(
      "/payment-subscription/reactivate",
      body,
    );
  }
}
