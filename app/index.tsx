import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";

GoogleSignin.configure({
  scopes: ["profile", "email"],
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
});

export default function Page() {
  const { call } = useApi();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    call({
      try: async (toast) => {
        const resp = await GoogleSignin.signIn();
        console.log("Google Sign-In response:", resp);

        if (resp.data?.idToken) {
          // Here you can send the idToken to your backend for verification
          // and to create a session for the user.
          toast.show({
            type: "success",
            text1: "Google Sign-In",
            text2: "You are now signed in with Google!",
          });
          setIsAuthenticated(true);
        }
      },
      catch: () => setIsAuthenticated(false),
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
