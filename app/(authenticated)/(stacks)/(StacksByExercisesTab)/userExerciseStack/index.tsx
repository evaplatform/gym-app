import Container from "@/components/custom/Container";
import {
  UserExerciseStackReturnType,
  useUserExerciseStack,
} from "./useUserExerciseStack";
import Tabs, { TabsType } from "@/components/custom/Tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import ExerciseTab from "./partials/ExerciseTab";
import DescriptionTab from "./partials/DescriptionTab";
import HistoryTab from "./partials/HistoryTab";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import ChartsTab from "./partials/ChartsTab";


export type TabProps = {
  hook: UserExerciseStackReturnType;
  t: (code: AppMessagesEnum) => string;
};

export default function UserExerciseStack() {
  const hook = useUserExerciseStack();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      activateKeepAwakeAsync();
      return () => {
        deactivateKeepAwake();
      };
    }, []),
  );

  const tabs: TabsType[] = [
    {
      title: t(AppMessagesEnum.EXERCISE_SCREEN_EXERCISE_DETAILS_TAB),
      content: <ExerciseTab hook={hook} t={t} />,
    },
    {
      title: t(AppMessagesEnum.EXERCISE_SCREEN_DESCRIPTION_TAB),
      content: <DescriptionTab hook={hook} t={t} />,
    },
    {
      title: t(AppMessagesEnum.EXERCISE_SCREEN_HISTORY_TAB),
      content: <HistoryTab hook={hook} t={t} />,
    },
    {
      title: t(AppMessagesEnum.TAB_REPORTS),
      content: <ChartsTab hook={hook} t={t} />,
    },
  ];

  return (
    <Container noTopPadding style={{ backgroundColor: hook.colors.background }}>
      <Tabs tabs={tabs} displayNoneHiddenTabs />
    </Container>
  );
}
