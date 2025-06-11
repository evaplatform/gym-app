import { AuthContext } from "@/contexts/authContext";
import { useApi } from "@/hooks/useApi";
import { setUser } from "@/redux/slices/userSlice";
import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateReq } from "@/services/LoginServices/types";
import { assembleUser } from "@/shared/utils/assembleUser";
import { saveUserToStorage } from "@/shared/utils/userStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";

export default function useLogin() {
  const authContext = useContext(AuthContext);
  const { call } = useApi();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    call({
      loading: true,
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

        // add Google credentials to Firebase Auth
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, credential);
        // --

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
        Alert.alert("Sign-In Error", err?.message || "Erro desconhecido");
        console.error("Sign-In Error:", err);
      },
    });
  };

  return {
    handleGoogleSignIn,
  };
}
