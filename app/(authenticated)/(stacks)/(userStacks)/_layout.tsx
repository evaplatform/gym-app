import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function UserStacksLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.USER_LIST),
        }}
      />
      <Stack.Screen
        name="addUserStack"
        options={{
          headerTitle: t(AppMessagesEnum.USER_ADD),
        }}
      />
      <Stack.Screen
        name="updateUserStack"
        options={{
          headerTitle: t(AppMessagesEnum.USER_EDIT),
        }}
      />
    </Stack>
  );
}