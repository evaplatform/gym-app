import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.DRAWER_ADD_GROUP_TITLE),
          title: t(AppMessagesEnum.DRAWER_ADD_GROUP_TITLE),
        }}
      />
      <Stack.Screen
        name="addGroupStack"
        options={{
          headerTitle: t(AppMessagesEnum.DRAWER_ADD_GROUP_TITLE),
          title: t(AppMessagesEnum.DRAWER_ADD_GROUP_TITLE),
        }}
      />
      <Stack.Screen
        name="updateGroupStack"
        options={{
          headerTitle: t(AppMessagesEnum.DRAWER_EDIT_GROUP_TITLE),
          title: t(AppMessagesEnum.DRAWER_EDIT_GROUP_TITLE),
        }}
      />
    </Stack>
  );
}
