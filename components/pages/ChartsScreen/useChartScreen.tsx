import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { RootReduxState } from "@reduxjs/toolkit";
import { useState, useRef, useMemo, useEffect } from "react";
import { ScrollView, LayoutChangeEvent } from "react-native";
import { useSelector } from "react-redux";
import { AVAILABLE_PROPERTIES, DEFAULT_SCREEN_WIDTH } from "./constants";
import { ChartProperty } from "./types";
import { UserExerciseStackReturnType } from "@/app/(authenticated)/(stacks)/(StacksByExercisesTab)/userExerciseStack/useUserExerciseStack";
import { convertSecondsInMinutes } from "@/shared/utils/convertSecondsInMinutes";
import { formatDistance } from "@/shared/utils/formatDistance";

export default function useChartScreen(
  hook: UserExerciseStackReturnType,
  defaultPropertyName = "weightUsed",
) {
  const { currentLanguage } = useSelector(
    (state: RootReduxState) => state.language,
  );

  const defaultProperty = useMemo(
    () =>
      AVAILABLE_PROPERTIES.find((prop) => prop.key === defaultPropertyName) ??
      AVAILABLE_PROPERTIES[1],
    [defaultPropertyName],
  );

  const [showChartValues, setShowChartValues] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] =
    useState<ChartProperty>(defaultProperty);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const chartScrollViewRef = useRef<ScrollView>(null);
  const buttonLayoutsRef = useRef<{
    [key: string]: { x: number; width: number };
  }>({});

  const historyData = useMemo(
    () => hook.listExerciseHistory || [],
    [hook.listExerciseHistory],
  );

  // Calcular a largura do gráfico com base no zoom
  const chartWidth = useMemo(() => {
    return DEFAULT_SCREEN_WIDTH * zoomLevel;
  }, [zoomLevel]);

  const customStyle = useMemo(() => {
    return {
      container: {
        backgroundColor: hook.colors.backgroundSecondary,
        shadowColor: hook.colors.shadow,
      },
      propertyButton: {
        backgroundColor: hook.colors.gray500,
      },
      selectedPropertyButton: {
        backgroundColor: hook.colors.tint,
      },
      propertyButtonText: {
        color: hook.colors.gray300,
      },
      selectedPropertyText: {
        color: hook.colors.text,
      },
      emptyText: {
        color: hook.colors.gray300,
      },
      zoomButton: {
        backgroundColor: hook.colors.gray500,
      },
      zoomButtonText: {
        color: hook.colors.text,
      },
    };
  }, [hook.colors]);

  // Sort data by date
  const sortedData = useMemo(() => {
    return [...historyData].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    );
  }, [historyData]);

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const labels = sortedData.map((item) => {
      if (currentLanguage === "en") {
        return new Date(item.completedAt).toLocaleDateString(currentLanguage, {
          month: "2-digit",
          day: "2-digit",
        });
      } else {
        return new Date(item.completedAt).toLocaleDateString(currentLanguage, {
          day: "2-digit",
          month: "2-digit",
        });
      }
    });

    const datasets = [
      {
        data: sortedData.map((item) => {
          let value;

          if (selectedProperty.key === "avgRepetitions") {
            value = selectedProperty.format ? selectedProperty.format(item) : 0;
          } else {
            const rawValue =
              item[selectedProperty.key as keyof IExerciseHistory];
            value =
              selectedProperty.format &&
              (typeof rawValue === "number" || typeof rawValue === "string")
                ? selectedProperty.format(rawValue)
                : (rawValue as number) || 0;
          }

          // Garantir que o valor seja um número válido
          return isNaN(value) ? 0 : value;
        }),
        color: (opacity = 1) =>
          selectedProperty.color || `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ];

    return {
      labels,
      datasets,
      legend: [selectedProperty.label],
    };
  }, [sortedData, selectedProperty, currentLanguage]);

  // Chart configuration
  const chartConfig = {
    backgroundColor: hook.colors.backgroundSecondary,
    backgroundGradientFrom: hook.colors.backgroundSecondary,
    backgroundGradientTo: hook.colors.backgroundSecondary,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => hexToRgba(hook.colors.text, opacity),
    color: (opacity = 1) => hexToRgba(hook.colors.text, opacity),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  // Function to handle button layout measurement
  const handleButtonLayout = (key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    buttonLayoutsRef.current[key] = { x, width };
  };
  // Function to scroll to the selected button
  const scrollToSelectedButton = () => {
    // Precisamos garantir que todos os botões tenham sido medidos
    if (
      scrollViewRef.current &&
      buttonLayoutsRef.current[selectedProperty.key]
    ) {
      const layout = buttonLayoutsRef.current[selectedProperty.key];

      // Calcular a posição central do ScrollView
      const scrollViewWidth = DEFAULT_SCREEN_WIDTH;
      const centerPosition = layout.x - scrollViewWidth / 2 + layout.width / 2;

      // Usar requestAnimationFrame para garantir que a UI foi atualizada
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          x: Math.max(0, centerPosition),
          animated: true,
        });
      });
    }
  };

  const formatLabels = (key: string, value: string) => {
    switch (key) {
      case "speedAverage": {
        const numValue = parseFloat(value.toString());
        if (isNaN(numValue)) return "0 km/h";

        return `${numValue.toFixed(2)} km/h`;
      }
      case "paceAverage": {
        const numValue = parseFloat(value.toString());
        if (isNaN(numValue)) return "0:00";

        const minutes = Math.floor(numValue / 60);
        const seconds = Math.floor(numValue % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }
      case "duration": {
        const convetedValue = convertSecondsInMinutes(Number(value));
        return convetedValue;
      }
      case "distance": {
        return formatDistance(Number(value));
      }
      default: {
        return value;
      }
    }
  };

  // Effect to scroll to selected property on initial render
  useEffect(() => {
    // Use a small delay to garantir que todos os layouts foram calculados
    const timer = setTimeout(() => {
      if (Object.keys(buttonLayoutsRef.current).length > 0) {
        scrollToSelectedButton();
      }
    }, 300); // Um tempo maior para garantir que todos os layouts foram medidos

    return () => clearTimeout(timer);
  }, [selectedProperty]);

  return {
    selectedProperty,
    setSelectedProperty,
    zoomLevel,
    chartData,
    chartWidth,
    chartConfig,
    customStyle,
    scrollViewRef,
    chartScrollViewRef,
    handleButtonLayout,
    setZoomLevel,
    historyData,
    showChartValues,
    setShowChartValues,
    formatLabels,
  };
}
