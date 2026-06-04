import { View, StyleSheet, Alert } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { UserWithTokens } from "@/services/AuthServices/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import Text from "@/components/custom/Text";
import UserImage from "@/components/custom/UserImage";
import { Button } from "@/components/custom/Button";
import { use, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetAllUserDatabase } from "@/redux/actions/resetDatabaseActions";
import { useApi } from "@/hooks/useApi";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { AppInitContext } from "@/contexts/appInitializerContext";
import { RootReduxState } from "@reduxjs/toolkit";

const IMAGE_SIZE = 120;

export default function UserSettingsStack() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { initializeUserData } = useContext(AppInitContext);
  const router = useRouter();

  const { user: userData } = useLocalSearchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { call } = useApi();

  const user = userData
    ? (JSON.parse(userData as string) as UserWithTokens)
    : undefined;

  const onResetData = () => {
    call({
      loading: true,
      try: async (toast) => {
        await dispatch(resetAllUserDatabase({ resetUser: false, fetchAll: true })).unwrap();

        toast.show({
          type: "success",
          text1: t(AppMessagesEnum.SETTINGS_DATA_RESET_SUCCESS),
        });

        await initializeUserData({ willFetchUser: false });
        router.replace("/");
      },
    });
  };

  const onConfirmResetData = () => {
    Alert.alert(
      t(AppMessagesEnum.SETTINGS_RESET_DATA_BUTTON),
      t(AppMessagesEnum.SETTINGS_RESET_DATA_CONFIRMATION),
      [
        {
          text: t(AppMessagesEnum.CANCEL),
          style: "cancel",
        },
        {
          text: t(AppMessagesEnum.FINALIZE),
          onPress: onResetData,
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <UserImage
        isLoading={false}
        user={user}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
      />

      <Button
        disabled={
          !unifiedGroup.drawerMenu.userSettings.resetDataButton.permitted
        }
        title={t(AppMessagesEnum.SETTINGS_RESET_DATA_BUTTON)}
        icon="refresh"
        onPress={onConfirmResetData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
});
