import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { LoginServices } from "@/services/LoginServices";
import { ISigninCreateReq } from "@/services/LoginServices/types";

GoogleSignin.configure({
  scopes: ["profile", "email"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true, // necessário para conseguir refresh token
});

export default function Page() {
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
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="title">Login</ThemedText>

      <TouchableOpacity disabled={isAuthenticated} onPress={handleGoogleSignIn}>
        <Text>Google</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

/*
  await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ' ': refreshToken, // opcional, usado se o accessToken expirar
    },
  });
  */
