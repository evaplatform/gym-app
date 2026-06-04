import React from "react";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { i18n } from "@/i18n";
import ChartsScreen from "@/components/pages/ChartsScreen";
import { ExerciseHistoryChartProps } from "@/components/pages/ChartsScreen/types";

export default function ChartsTab({
  title = i18n.translate(AppMessagesEnum.EXERCISE_SCREEN_HISTORY_CHART_TITLE),
  defaultPropertyName,
  hook,
  t,
}: ExerciseHistoryChartProps) {
  return (
    <ChartsScreen
      title={title}
      defaultPropertyName={defaultPropertyName}
      hook={hook}
      t={t}
    />
  );
}
