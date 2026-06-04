import { useApi } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import { useEffect, useReducer } from "react";
import useFetchUser from "@/hooks/useFetchUser";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import groupReducer, { initialGroupState } from "../groupReducer";
import { GroupServices } from "@/services/GroupServices";

export default function useAddGroup() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();
  const { getUser } = useFetchUser();

  const [groupState, dispatch] = useReducer(groupReducer, initialGroupState);

  const addGroup = async () => {
    call({
      loading: true,
      try: async (toast) => {
        if (!groupState) throw new Error(t(AppMessagesEnum.GROUP_NOT_FOUND));

        delete groupState.updatedAt;
        delete groupState.createdAt;

        await GroupServices.create(groupState);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.GROUP_CREATED_SUCCESS),
        });

        router.back();
      },
    });
  };

  useEffect(() => {
    call({
      try: async () => {
        const data = await getUser();

        if (data.academyId) {
          dispatch({ type: "academyId", payload: data.academyId });
        }
      },
    });
  }, []);

  return {
    group: groupState,
    addGroup,
    dispatch,
  };
}
