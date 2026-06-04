import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";
import { HapticTab } from "@/components/custom/HapticTab";
import TabBarBackground from "@/components/custom/TabBarBackground";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { EventArg } from "@react-navigation/native";
import useCustomStyle from "@/hooks/useCustomStyle";
import { useSelector } from "react-redux";
import { RootReduxState } from "@reduxjs/toolkit";
import { log } from "@/shared/utils/log";

export default function TabLayout() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { colors } = useCustomStyle();
  const { t } = useTranslation();

  // Função para mostrar uma mensagem quando a tab bloqueada for clicada
  const handleLockedTabPress = (
    e: EventArg<"tabPress", true, undefined>,
    permission: boolean,
  ) => {
    if (!permission) {
      e.preventDefault();
    }
  };

  log(
    "Unified Group Permissions in TabLayout:",
    unifiedGroup.drawerMenu.home.tabs,
  );

  type IconProps = {
    IconComponent: React.ElementType;
    permission: boolean;
    name: string;
    size: number;
    color: string;
  };

  const TreatedIcon: React.FC<IconProps> = ({
    IconComponent,
    permission,
    name,
    size,
    color,
  }) => {

    const isPermitted = unifiedGroup.drawerMenu.home.tabs.permitted && permission;
    const blockedColor = !isPermitted ? { color: colors.gray500 } : { color };

    return (
      <>
        <IconComponent name={name} size={size} {...blockedColor} />
        {!isPermitted && (
          <MaterialIcons
            name="lock"
            size={12}
            color={colors.gray500}
            style={{
              position: "absolute",
              top: -1,
              right: -1,
            }}
          />
        )}
      </>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(AppMessagesEnum.TAB_HOME),
          tabBarIcon: ({ color }) => (
            <TreatedIcon
              IconComponent={MaterialCommunityIcons}
              permission={unifiedGroup.drawerMenu.home.tabs.home.permitted}
              name="home"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) =>
            handleLockedTabPress(
              e,
              unifiedGroup.drawerMenu.home.tabs.home.permitted,
            ),
        }}
      />
      <Tabs.Screen
        name="calendarTab"
        options={{
          title: t(AppMessagesEnum.TAB_CALENDAR),
          tabBarIcon: ({ color }) => (
            <TreatedIcon
              IconComponent={FontAwesome5}
              permission={unifiedGroup.drawerMenu.home.tabs.calendar.permitted}
              name="calendar-alt"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) =>
            handleLockedTabPress(
              e,
              unifiedGroup.drawerMenu.home.tabs.calendar.permitted,
            ),
        }}
      />

      <Tabs.Screen
        name="exercisesTab"
        options={{
          title: t(AppMessagesEnum.TAB_EXERCISES),
          tabBarIcon: ({ color }) => (
            <TreatedIcon
              IconComponent={MaterialCommunityIcons}
              permission={unifiedGroup.drawerMenu.home.tabs.exercises.permitted}
              name="weight-lifter"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) =>
            handleLockedTabPress(
              e,
              unifiedGroup.drawerMenu.home.tabs.exercises.permitted,
            ),
        }}
      />
      <Tabs.Screen
        name="cardioTab"
        options={{
          title: t(AppMessagesEnum.TAB_CARDIO),
          tabBarIcon: ({ color }) => (
            <TreatedIcon
              IconComponent={FontAwesome5}
              permission={unifiedGroup.drawerMenu.home.tabs.cardio.permitted}
              name="running"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) =>
            handleLockedTabPress(
              e,
              unifiedGroup.drawerMenu.home.tabs.cardio.permitted,
            ),
        }}
      />

      <Tabs.Screen
        name="financialTab"
        options={{
          title: t(AppMessagesEnum.TAB_FINANCIAL),
          tabBarIcon: ({ color }) => (
            <TreatedIcon
              IconComponent={MaterialIcons}
              permission={unifiedGroup.drawerMenu.home.tabs.financial.permitted}
              name="attach-money"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10,
                color: colors.gray500,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              {t(AppMessagesEnum.TAB_FINANCIAL)}
            </Text>
          ),
        }}
        listeners={{
          tabPress: (e) =>
            handleLockedTabPress(
              e,
              unifiedGroup.drawerMenu.home.tabs.financial.permitted,
            ),
        }}
      />
    </Tabs>
  );
}
