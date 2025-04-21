import { AUTH_STORAGE_KEY } from "@/constants/storeKeys";
import { api } from "@/services/api";
import { ISigninCreateRes } from "@/services/LoginServices/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: (data: ISigninCreateRes) => void;
  logOut: () => void;
};

const initialState: AuthState = {
  isLoggedIn: false,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
};

export const AuthContext = createContext<AuthState>(initialState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error storing auth state:", error);
    }
  };

  const logIn = (data: ISigninCreateRes) => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    api.defaults.headers.common["x-refresh-token"] = data.googleTokens.refresh_token;

    router.replace("/");
  };

  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });

    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["x-refresh-token"];

    router.replace("/login");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      await new Promise((res) => setTimeout(() => res(null), 1000));

      try {
        const value = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsLoggedIn(parsedValue.isLoggedIn);
        }
      } catch (error) {
        console.error("Error retrieving auth state:", error);
      }
      setIsReady(true);
    };

    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ isReady, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
