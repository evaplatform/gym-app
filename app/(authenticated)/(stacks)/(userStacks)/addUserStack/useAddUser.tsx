import { useApi } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import { useReducer } from "react";
import createEmptyValuesObject from "@/shared/utils/createEmptyValuesObject";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { IUser } from "@/shared/models/IUser";
import { reducerHelper } from "@/shared/utils/reducer";
import { UserServices } from "@/services/UserServices";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import userReducer, { initialUser } from "../userReducer";

export default function useAddUser() {
  const { t } = useTranslation();
  const { call } = useApi();
  const router = useRouter();


  const [user, dispatch] = useReducer(userReducer, initialUser);

  const addUser = async () => {
    let request: ApiRequestType<IUser>;
    call({
      loading: true,
      try: async (toast) => {
        const updatedUser = createEmptyValuesObject(user);

        request = { ...updatedUser };

        request.refreshToken = '';

        await UserServices.create(request);

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.USER_CREATED_SUCCESS),
        });

        router.back();
      },
      catch: async (error) => {
        if (error.code === "storage/object-not-found") {
          return;
        }

        if (error.code === "storage/unauthorized") {
          // User doesn't have permission to access the object
          return;
        }

        if (error.code === "storage/canceled") {
          // User canceled the upload
          return;
        }

        if (error.code === "storage/unknown") {
          // Unknown error occurred, inspect the server response
          return;
        }
      },
    });
  };

  return {
    user,
    addUser,
    dispatch,
  };
}
