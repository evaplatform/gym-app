import { i18n } from "@/i18n";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Dimensions } from "react-native";
import { ChartProperty } from "./types";
import { convertSecondsInMinutes } from "@/shared/utils/convertSecondsInMinutes";
import { log } from "@/shared/utils/log";

export const DEFAULT_SCREEN_WIDTH = Dimensions.get("window").width - 32;
export const MIN_ZOOM = 1; // Zoom mínimo (tamanho padrão)
export const MAX_ZOOM = 10; // Zoom máximo (10x o tamanho padrão)
export const ZOOM_STEP = 0.5; // Incremento/decremento do zoom

export const DECORATOR_POSITION = {
  x: 0,
  y: 0,
};

export const AVAILABLE_PROPERTIES: ChartProperty[] = [
  {
    key: "completedSets",
    label: i18n.translate(AppMessagesEnum.USER_EXERCISE_COMPLETED_SETS_LABEL),
    chartType: "bar",
    color: "#36A2EB",
  },
  {
    key: "weightUsed",
    label: i18n.translate(AppMessagesEnum.USER_EXERCISE_WEIGHT_USED_LABEL),
    chartType: "line",
    color: "#FFCE56",
  },
  {
    key: "distance",
    label: i18n.translate(AppMessagesEnum.USER_EXERCISE_DISTANCE_LABEL),
    chartType: "line",
    color: "#4BC0C0",
  },
  {
    key: "paceAverage",
    label: i18n.translate(AppMessagesEnum.USER_EXERCISE_PACE_AVERAGE_LABEL),
    chartType: "line",
    format: (value) => {
      // Se o valor for null, undefined ou não for uma string, retorna 0
      if (!value || typeof value !== "string") return 0;

      try {
        // Converte string "mm:ss" para segundos
        const parts = value.split(":");
        if (parts.length === 2) {
          const minutes = parseInt(parts[0], 10);
          const seconds = parseInt(parts[1], 10);

          // Verifica se os valores são números válidos
          if (isNaN(minutes) || isNaN(seconds)) return 0;

          return minutes * 60 + seconds; // Retorna o total em segundos
        }
        return 0;
      } catch (error) {
        console.warn("Erro ao converter paceAverage:", error);
        return 0;
      }
    },
    color: "#8B5CF6",
  },
  {
    key: "duration",
    label: i18n.translate(AppMessagesEnum.EXERCISE_SCREEN_ELAPSED_TIME_LABEL),
    chartType: "line",
    color: "#FF6384",
  },
  {
    key: "speedAverage",
    label: i18n.translate(AppMessagesEnum.EXERCISE_SCREEN_SPEED_AVERAGE_LABEL),
    chartType: "line",
    color: "#9966FF",
  },
  {
    key: "avgRepetitions",
    label: i18n.translate(AppMessagesEnum.USER_EXERCISE_AVG_REPETITIONS_LABEL),
    format: (history) => {
      if (!history.completedRepetitions?.length) return 0;
      return (
        history.completedRepetitions.reduce(
          (sum: number, rep: number) => sum + rep,
          0,
        ) / history.completedRepetitions.length
      );
    },
    chartType: "line",
    color: "#FF9F40",
  },
];