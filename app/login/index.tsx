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
import { useLogin } from "./useLogin";

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
  const { handleGoogleSignIn } = useLogin();

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
