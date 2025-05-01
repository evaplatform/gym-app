import { AuthContext } from "@/contexts/authContext";
import { useApi } from "@/hooks/useApi";
import { setUser } from "@/redux/slices/userSlice";
import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateReq } from "@/services/LoginServices/types";
import { assembleUser } from "@/shared/utils/assembleUser";
import { saveUserToStorage } from "@/store/userStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";

export default function useLogin() {
  const authContext = useContext(AuthContext);
  const { call } = useApi();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    call({
      try: async (toast) => {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();

        const { idToken, accessToken } = tokens;
        const authCode = userInfo?.data?.serverAuthCode;

        if (!authCode) {
          throw new Error("authCode is undefined");
        }

        const requestBody: ISigninCreateReq = {
          token: idToken,
          authCode,
          email: userInfo.data?.user.email,
        };

        const resp = await LoginServices.createOrLogin(requestBody);

        const apiUser = assembleUser(resp);

        if (apiUser) {
          toast.show({
            type: "success",
            text1: "Google Sign-In",
            text2: "You are now signed in with Google!",
          });

          authContext.logIn(resp);
          dispatch(setUser(apiUser));
          saveUserToStorage(resp);
        }
      },
      catch: (err) => {
        Alert.alert('Sign-In Error', err?.message || 'Erro desconhecido');
        console.error("Sign-In Error:", err);
      },
    });
  };

  return {
    handleGoogleSignIn,
  };
}
