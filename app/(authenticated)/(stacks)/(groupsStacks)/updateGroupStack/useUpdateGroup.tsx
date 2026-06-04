import { useApi } from "@/hooks/useApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useReducer } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import groupReducer, { initialGroupState } from "../groupReducer";
import { GroupServices } from "@/services/GroupServices";
import useOnConfirm from "@/hooks/useOnConfirm";

export default function useUpdateGroup() {
  const { groupId } = useLocalSearchParams();
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { onConfirm } = useOnConfirm();

  const [groupState, dispatch] = useReducer(groupReducer, initialGroupState);

  const updateGroup = async () => {
    call({
      loading: true,
      try: async (toast) => {
        if (!groupState) throw new Error(t(AppMessagesEnum.GROUP_NOT_FOUND));

        await GroupServices.update(groupState);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.GROUP_UPDATED_SUCCESS),
        });

        router.back();
      },
    });
  };

  const onRemove = async () => {
    call({
      loading: true,
      try: async (toast) => {
        if (!groupState) throw new Error(t(AppMessagesEnum.GROUP_NOT_FOUND));

        await GroupServices.delete(groupId as string);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.GROUP_REMOVED_SUCCESS),
        });

        router.back();
      },
    });
  };

  const handleRemove = async () => {
    onConfirm({
      onConfirmCallback: onRemove,
      title: t(AppMessagesEnum.CONFIRM_REMOVE_GROUP_TITLE),
      message: t(AppMessagesEnum.CONFIRM_REMOVE_GROUP_MESSAGE),
    });
  };

  useEffect(() => {
    call({
      loading: true,
      try: async () => {
        const group = await GroupServices.getById(groupId as string);

        if (!group) throw new Error(t(AppMessagesEnum.GROUP_NOT_FOUND));

        dispatch({ type: "LOAD_ALL", payload: group });
      },
    });
  }, []);

  return {
    group: groupState,
    handleRemove,
    updateGroup,
    dispatch,
  };
}
