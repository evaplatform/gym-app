import { useApi } from "@/hooks/useApi";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useReducer, useState } from "react";
import { Alert } from "react-native";

import { useOverlay } from "@/contexts/overlayContext";
import { LOAD_ALL } from "@/shared/constants/reducerConsts";;
import { UserServices } from "@/services/UserServices";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import userReducer, { initialUser } from "../../userReducer";

export default function useUpdateUser(id: string) {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { showOverlay, hideOverlay } = useOverlay();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [user, dispatch] = useReducer(userReducer, initialUser);

  const onUpdate = async () => {
    call({
      loading: true,
      try: async (toast) => {
        const request = {
          ...user,
          id,
        };

        const res = await UserServices.update(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.USER_EDITED_SUCCESS),
        });

        router.back();
      },
    });
  };

  const onRemoveUser = async () => {
    call({
      try: async (toast) => {
        Alert.alert(
          t(AppMessagesEnum.CONFIRMATION),
          t(AppMessagesEnum.USER_REMOVE_CONFIRMATION),
          [
            {
              text: t(AppMessagesEnum.CANCEL),
              style: "cancel",
            },
            {
              text: t(AppMessagesEnum.REMOVE),
              style: "destructive",
              onPress: async () => {
                showOverlay();
                const resp = await UserServices.delete(id);

                toast.show({
                  type: "success",
                  text1: resp,
                });

                hideOverlay();
                router.back();
              },
            },
          ],
        );
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      call({
        try: async () => {
          const exercise = await UserServices.getById(id);

          dispatch({ type: LOAD_ALL, payload: exercise });
        },
        finally: () => setIsLoading(false),
      });
    }, [id]),
  );

  return {
    user,
    isLoading,
    onUpdate,
    onRemoveUser,
    dispatch,
  };
}
