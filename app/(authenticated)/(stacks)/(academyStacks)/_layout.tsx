import useCustomStyle from "@/hooks/useCustomStyle";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Stack } from "expo-router";

export default function AcademyStacksLayout() {
  const { t } = useTranslation();
  const { colors } = useCustomStyle();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t(AppMessagesEnum.ACADEMY_LIST),
          title: t(AppMessagesEnum.ACADEMY_LIST),
        }}
      />
      <Stack.Screen
        name="addAcademyStack"
        options={{
          headerTitle: t(AppMessagesEnum.ACADEMY_ADD),
          title: t(AppMessagesEnum.ACADEMY_ADD),
        }}
      />
      <Stack.Screen
        name="updateAcademyStack"
        options={{
          headerTitle: t(AppMessagesEnum.ACADEMY_EDIT),
          title: t(AppMessagesEnum.ACADEMY_EDIT),
        }}
      />
    </Stack>
  );
}
