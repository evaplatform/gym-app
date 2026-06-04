import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { useTranslation } from "./useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export function useCheckInternetConnection() {
  const { t } = useTranslation();

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected || !state.isInternetReachable) {
      throw new Error(t(AppMessagesEnum.INTERNET_CONNECTION_ERROR));
    }
  };

  return { checkInternetConnection };
}
