import { TabProps } from "@/app/(authenticated)/(stacks)/(StacksByExercisesTab)/userExerciseStack";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";

export type KeyProperty = keyof IExerciseHistory | string;

export type ChartProperty = {
    key: KeyProperty;
    label: string;
    format?: (value: any) => any;
    chartType: "line" | "bar";
    color?: string;
};

export type ExerciseHistoryChartProps = {
    title?: string;
    defaultPropertyName?: KeyProperty;
} & TabProps;