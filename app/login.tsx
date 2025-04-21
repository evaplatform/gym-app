import { useContext, useState } from "react";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { ImageBackground, StyleSheet, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useApi } from "@/hooks/useApi";
import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateReq } from "@/services/LoginServices/types";
import { assembleUser } from "@/shared/utils/assembleUser";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { saveUserToStorage } from "@/store/userStore";
import { AuthContext } from "@/contexts/authContext";

const backgroundImg = require("@assets/images/background.jpg");
const logoImg = require("@assets/images/google-logo.png");

GoogleSignin.configure({
  scopes: ["profile", "email"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true, // necessário para conseguir refresh token
});

export default function Login() {
  const authContext = useContext(AuthContext);
  const { call } = useApi();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    call({
      try: async (toast) => {
        await GoogleSignin.hasPlayServices();
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

        console.log("API User:", apiUser);
        console.log("resp:", resp);

        if (apiUser) {
          dispatch(setUser(apiUser));
          saveUserToStorage(resp);
        }

        toast.show({
          type: "success",
          text1: "Google Sign-In",
          text2: "You are now signed in with Google!",
        });

        setIsAuthenticated(true);
        router.replace("/");
      },
      catch: (err) => {
        console.error("Sign-In Error:", err);
        setIsAuthenticated(false);
      },
    });
  };

  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.content}>
        <Button
          title="Acessar com Google"
          transparent
          imageSource={logoImg}
          onPress={authContext.logIn}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    padding: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});
