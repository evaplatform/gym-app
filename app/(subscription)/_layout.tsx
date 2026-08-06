import { AuthContext } from "@/contexts/authContext";
import { Redirect, Stack } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { setLoginMessage } from "@/redux/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomStyle from "@/hooks/useCustomStyle";
import { fetchSubscription } from "@/redux/actions/subscriptionActions";
import { RootReduxState } from "@/redux";
import { log } from "@/shared/utils/log";
import { SubscriptionsStatusEnum } from "@/shared/enum/SubscriptionsStatusEnum";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";

export default function StacksLayout() {
  const { colors } = useCustomStyle();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: "modal",
          headerStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="newSubscription"
          options={{
            headerTitle: t(AppMessagesEnum.DRAWER_SUBSCRIPTION),
            title: t(AppMessagesEnum.DRAWER_SUBSCRIPTION),
          }}
        />
        <Stack.Screen
          name="subscriptionByUserDrawer"
          options={{
            headerTitle: t(AppMessagesEnum.MY_SUBSCRIPTION),
            title: t(AppMessagesEnum.MY_SUBSCRIPTION),
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
