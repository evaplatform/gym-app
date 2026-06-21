import { i18n } from "@/i18n";
import { AppMessagesEnum } from "./AppMessagesEnum";

export enum SubscriptionsStatusEnum {
  ACTIVE = "active",
  CANCELED = "canceled",
  PAST_DUE = "past_due",
  INCOMPLETE = "incomplete",
  UNPAID = "unpaid",
}

export const getStatusText = (status: string, cancelAtPeriodEnd: boolean) => {
  if (cancelAtPeriodEnd)
    return i18n.translate(AppMessagesEnum.SUBSCRIPTION_CANCELING);

  switch (status) {
    case SubscriptionsStatusEnum.ACTIVE:
      return i18n.translate(AppMessagesEnum.SUBSCRIPTION_STATUS_ACTIVE);
    case SubscriptionsStatusEnum.CANCELED:
      return i18n.translate(AppMessagesEnum.SUBSCRIPTION_STATUS_CANCELED);
    case SubscriptionsStatusEnum.INCOMPLETE:
      return i18n.translate(AppMessagesEnum.SUBSCRIPTION_STATUS_INCOMPLETE);
    case SubscriptionsStatusEnum.PAST_DUE:
      return i18n.translate(AppMessagesEnum.SUBSCRIPTION_STATUS_PAST_DUE);
    case SubscriptionsStatusEnum.UNPAID:
      return i18n.translate(AppMessagesEnum.SUBSCRIPTION_STATUS_UNPAID);
    default:
      return status;
  }
};
