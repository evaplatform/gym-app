import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Platform, StatusBar } from "react-native";
import UserImage from "@/components/custom/UserImage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UserWithTokens } from "@/services/AuthServices/types";
import { useApi } from "@/hooks/useApi";
import { fetchUser } from "@/redux/actions/userActions";
import { RootReduxState, waitForDatabase } from "@/redux";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import useCustomStyle from "@/hooks/useCustomStyle";
import {
  DrawerNavigationOptions,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";

export default function DrawerLayout() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { call, isLoading } = useApi();
  const { colors } = useCustomStyle();
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);

  const [user, setUser] = useState<UserWithTokens | undefined>(undefined);

  const onNavigateToSettings = () => {
    const router = useRouter();
    router.push({
      pathname: "(stacks)/userSettingsStack",
      params: {
        user: user ? JSON.stringify(user) : undefined,
      },
    });
  };

  useEffect(() => {
    call({
      try: async () => {
        const dataBase = await waitForDatabase();
        if (!dataBase) throw new Error("Database not initialized");
        const data = await dispatch(fetchUser({ dataBase }));
        setUser(data.payload);
      },
    });
  }, []);

  const CustomHeader = () => (
    <Pressable onPress={onNavigateToSettings} disabled={isLoading || !user}>
      <UserImage isLoading={isLoading} user={user} width={40} height={40} />
    </Pressable>
  );

  // Specific settings to fix the header spacing
  const headerOptions: DrawerNavigationOptions = {
    headerShown: true,
    headerRight: () => <CustomHeader />,

    headerLeft: () => {
      if (!unifiedGroup.drawerMenu.home?.permitted) {
        return null;
      }

      return <DrawerToggleButton tintColor={colors.text} />;
    },

    // Responsive style for the header
    headerStyle: {
      position: "relative",
      backgroundColor: colors.background,
      height: Platform.OS === "ios" ? 56 : 64, // Slightly larger but standardized height
    },

    // Style for the title container
    headerTitleContainerStyle: {
      flex: 1,
      position: "absolute",
      left: 40,
      right: 0,
      bottom: 8,
    },
    // Style for the left container
    headerLeftContainerStyle: {
      position: "absolute",
      left: 0,
      bottom: 0,
      justifyContent: "center",
    },

    // Style for the right container
    headerRightContainerStyle: {
      position: "absolute",
      right: 5,
      bottom: 5,
      justifyContent: "center",
    },

    // StatusBar settings
    statusBarStyle: Platform.OS === "ios" ? "dark" : "light",
    statusBarTranslucent: false,

    // Drawer settings
    drawerActiveBackgroundColor: colors.backgroundSelected,
    drawerActiveTintColor: colors.selectedOptions,
    drawerInactiveTintColor: colors.gray900,
    drawerInactiveBackgroundColor: "transparent",
  } as unknown as DrawerNavigationOptions;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.background} />
      <Drawer screenOptions={headerOptions}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_HOME),
            title: t(AppMessagesEnum.DRAWER_HOME),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.home?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="userListDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_USER_LIST),
            title: t(AppMessagesEnum.DRAWER_USER_LIST),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.users?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="academyListDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_ACADEMY_LIST),
            title: t(AppMessagesEnum.DRAWER_ACADEMY_LIST),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.academies?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="exerciseListDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_EXERCISE_LIST),
            title: t(AppMessagesEnum.DRAWER_EXERCISE_LIST),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.exercises?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="trainingDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_TRAINING_LIST),
            title: t(AppMessagesEnum.DRAWER_TRAINING_LIST),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.trainings?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="trainingByUserListDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_TRAININGS_BY_USER_LIST),
            title: t(AppMessagesEnum.DRAWER_TRAININGS_BY_USER_LIST),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.trainingByUserList?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="userSettingsDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.DRAWER_USER_SETTINGS),
            title: t(AppMessagesEnum.DRAWER_USER_SETTINGS),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.userSettings?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="chartsDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.CHARTS_DRAWER),
            title: t(AppMessagesEnum.CHARTS_DRAWER),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.charts?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="groupsDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.GROUPS_DRAWER),
            title: t(AppMessagesEnum.GROUPS_DRAWER),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.groups?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="subscriptionByUserDrawer"
          options={{
            drawerLabel: t(AppMessagesEnum.MY_SUBSCRIPTION),
            title: t(AppMessagesEnum.MY_SUBSCRIPTION),
            drawerItemStyle: {
              display: unifiedGroup.drawerMenu.mySubscription?.permitted
                ? "flex"
                : "none",
            },
          }}
        />

        <Drawer.Screen
          name="logoutDrawer"
          options={{
            headerTitle: t(AppMessagesEnum.DRAWER_LOGOUT),
            drawerLabel: t(AppMessagesEnum.DRAWER_LOGOUT),
            title: t(AppMessagesEnum.DRAWER_LOGOUT),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
