import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Alert } from "react-native";
import { useTranslation } from "./useTranslation";

export type UseOnConfirmType = {
  onConfirmCallback: () => Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
};

export default function useOnConfirm() {
  const { t } = useTranslation();

  const onConfirm = ({
    onConfirmCallback,
    title,
    message,
    confirmText = t(AppMessagesEnum.CONFIRM_TITLE),
  }: UseOnConfirmType) => {
    Alert.alert(
      title ?? t(AppMessagesEnum.CONFIRM_TITLE),
      message ?? t(AppMessagesEnum.CONFIRM_TEXT),
      [
        {
          text: t(AppMessagesEnum.CANCEL),
          style: "cancel",
        },
        {
          text: confirmText,
          onPress: onConfirmCallback,
        },
      ],
    );
  };

  return { onConfirm };
}
