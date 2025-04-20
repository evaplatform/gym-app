import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageBackground, StyleSheet, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useApi } from "@/hooks/useApi";
import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateReq } from "@/services/LoginServices/types";

const backgroundImg = require("@assets/images/background.jpg");
const logoImg = require("@assets/images/google-logo.png");

GoogleSignin.configure({
  scopes: ["profile", "email"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true, // necessário para conseguir refresh token
});

export default function App() {
  const { call } = useApi();
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

        await LoginServices.createOrLogin(requestBody);

        toast.show({
          type: "success",
          text1: "Google Sign-In",
          text2: "You are now signed in with Google!",
        });
        setIsAuthenticated(true);
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
          onPress={handleGoogleSignIn}
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
