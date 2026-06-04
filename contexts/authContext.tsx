import { UserWithTokens } from "@/services/AuthServices/types";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { log } from "@/shared/utils/log";
import { Alert } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useDispatch, useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import {
  loginUser,
  logoutUser,
  setAuthHeaders,
  setReady,
} from "@/redux/slices/authSlice";
import { resetAllUserDatabase } from "@/redux/actions/resetDatabaseActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  loginMessage?: string;
  logIn: (data: UserWithTokens) => void;
  logOut: () => void;
  addCredentialIfItsLoggedIn: (user: UserWithTokens) => Promise<void>;
};

const initialState: AuthState = {
  isLoggedIn: false,
  isReady: false,
  loginMessage: undefined,
  logIn: () => {},
  logOut: () => {},
  addCredentialIfItsLoggedIn: (user: UserWithTokens) => Promise.resolve(),
};

export const AuthContext = createContext<AuthState>(initialState);

export function AuthProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  // Obtenha o estado de autenticação do Redux
  const { isLoggedIn, isReady, loginMessage } = useSelector(
    (state: RootReduxState) => state.auth,
  );

  const logIn = async (data: UserWithTokens) => {
    log("Attempting to log in with data:", data);
    setAuthHeaders(data);
    try {
      await dispatch(loginUser(data)).unwrap();
      router.replace("/");
    } catch (error: any) {
      log("Error during login:", error);
      Alert.alert(t(AppMessagesEnum.LOGIN_ERROR));
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      log("Error clearing storage:", error);
    }
  };

  const logOut = async () => {
    try {
      await clearStorage();

      dispatch(
        resetAllUserDatabase({ resetUser: true, fetchAll: false }),
      ).unwrap();

      dispatch(logoutUser()).unwrap();

      router.replace("/login");
    } catch (error) {
      Alert.alert(
        t(AppMessagesEnum.LOGOUT_ERROR),
        t(AppMessagesEnum.LOGOUT_ERROR_MESSAGE),
      );
    }
  };



  const addCredentialIfItsLoggedIn = async (user: UserWithTokens) => {
    log("User found in local database:", user);

    setAuthHeaders(user);
    await dispatch(loginUser(user)).unwrap();
    dispatch(setReady(true));

    return;
  };

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        loginMessage,
        logIn,
        logOut,
        addCredentialIfItsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
