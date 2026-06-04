import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { i18n } from "@/i18n";
import Text from "@/components/custom/Text";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de ter esta dependência instalada
import {
  AVAILABLE_PROPERTIES,
  DECORATOR_POSITION,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_STEP,
} from "./constants";
import { ChartProperty, ExerciseHistoryChartProps } from "./types";
import useChartScreen from "./useChartScreen";
import { styles } from "./styles";
import { Button } from "@/components/custom/Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";

const getUnitLabel = (selectedProperty: ChartProperty) => {
  switch (selectedProperty.key) {
    case "duration":
      return "min";
    case "weightUsed":
      return "kg";
    case "distance":
      return "km";
    case "paceAverage":
      return "min/km";
    case "speedAverage":
      return "km/h";
    case "avgRepetitions":
      return "reps";
    default:
      return "";
  }
};

export default function ChartsScreen({
  title = i18n.translate(AppMessagesEnum.EXERCISE_SCREEN_HISTORY_CHART_TITLE),
  defaultPropertyName,
  hook: parentHook,
  t,
}: ExerciseHistoryChartProps) {
  const hook = useChartScreen(parentHook, defaultPropertyName);

  // Funções para controlar o zoom
  const handleZoomIn = () => {
    if (hook.zoomLevel < MAX_ZOOM) {
      hook.setZoomLevel((prevZoom) => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM));
    }
  };

  const handleZoomOut = () => {
    if (hook.zoomLevel > MIN_ZOOM) {
      hook.setZoomLevel((prevZoom) => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM));
    }
  };

  const renderDecorator = () => {
    const unitLabel = getUnitLabel(hook.selectedProperty);
    if (unitLabel) {
      return (
        <View
          style={{
            position: "absolute",
            top: DECORATOR_POSITION.y,
            left: DECORATOR_POSITION.x,
            backgroundColor: hexToRgba(
              parentHook.colors.backgroundSecondary,
              0.8,
            ),
            borderWidth: 1,
            borderColor: parentHook.colors.tint,
            padding: 8,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: parentHook.colors.text, fontSize: 12 }}>
            {t(AppMessagesEnum.UNIT)}: {unitLabel}
          </Text>
        </View>
      );
    }
    return null;
  };

  // Render appropriate chart based on selected type
  const renderChart = () => {
    if (hook.selectedProperty.chartType === "bar") {
      return (
        <View>
          <BarChart
            data={hook.chartData}
            width={hook.chartWidth}
            height={220}
            chartConfig={hook.chartConfig}
            verticalLabelRotation={30}
            fromZero={true}
            showValuesOnTopOfBars={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
          {renderDecorator()}
        </View>
      );
    } else {
      return (
        <LineChart
          data={hook.chartData}
          width={hook.chartWidth}
          height={220}
          chartConfig={hook.chartConfig}
          bezier
          renderDotContent={({ x, y, index, indexData }) => {
            const displayValue = hook.formatLabels(
              hook.selectedProperty.key,
              indexData.toString(),
            );

            return hook.showChartValues ? (
              <View
                key={`dot-label-${index}`}
                style={{
                  position: "absolute",
                  left: x - 15, // Centraliza no ponto
                  top: y , // Posiciona acima do ponto
                  backgroundColor: hexToRgba(
                    parentHook.colors.backgroundSecondary,
                    0.8,
                  ),
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: parentHook.colors.text,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {displayValue}
                </Text>
              </View>
            ) : null;
          }}
          decorator={() => {
            const unitLabel = getUnitLabel(hook.selectedProperty);

            return (
              <>
                {unitLabel && (
                  <View
                    style={{
                      position: "absolute",
                      top: DECORATOR_POSITION.y,
                      left: DECORATOR_POSITION.x,
                      backgroundColor: hexToRgba(parentHook.colors.black, 0.7),
                      padding: 8,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>
                      {t(AppMessagesEnum.UNIT)}: {unitLabel}
                    </Text>
                  </View>
                )}
              </>
            );
          }}
          verticalLabelRotation={30}
          fromZero={true}
          style={styles.chartWrapper}
          formatYLabel={(value: string) =>
            hook.formatLabels(hook.selectedProperty.key, value)
          }
        />
      );
    }
  };

  if (hook.historyData.length === 0) {
    return (
      <View style={styles.pageContainer}>
        <Text>{t(AppMessagesEnum.NO_HISTORY_DATA)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <View style={[styles.container, hook.customStyle.container]}>
        <Text style={styles.title}>{title}</Text>

        <ScrollView
          ref={hook.scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.propertiesContainer}
        >
          {AVAILABLE_PROPERTIES.map((prop) => (
            <TouchableOpacity
              key={prop.key}
              style={[
                styles.propertyButton,
                hook.customStyle.propertyButton,
                hook.selectedProperty.key === prop.key &&
                  hook.customStyle.selectedPropertyButton,
              ]}
              onPress={() => {
                hook.setSelectedProperty(prop);
                hook.setZoomLevel(1);
              }}
              onLayout={(event) => hook.handleButtonLayout(prop.key, event)}
            >
              <Text
                style={[
                  styles.propertyButtonText,
                  hook.customStyle.propertyButtonText,
                  hook.selectedProperty.key === prop.key &&
                    hook.customStyle.selectedPropertyText,
                ]}
              >
                {prop.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Controles de Zoom */}
        <View style={styles.controlsContainer}>
          <View style={styles.zoomControlContainer}>
            <TouchableOpacity
              style={[styles.zoomButton, hook.customStyle.zoomButton]}
              onPress={handleZoomOut}
              disabled={hook.zoomLevel <= MIN_ZOOM}
            >
              <Ionicons
                name="remove"
                size={24}
                color={
                  hook.zoomLevel <= MIN_ZOOM
                    ? parentHook.colors.gray300
                    : parentHook.colors.text
                }
              />
            </TouchableOpacity>

            <Text style={[styles.zoomText, hook.customStyle.zoomButtonText]}>
              {Math.round(hook.zoomLevel * 100)}%
            </Text>

            <TouchableOpacity
              style={[styles.zoomButton, hook.customStyle.zoomButton]}
              onPress={handleZoomIn}
              disabled={hook.zoomLevel >= MAX_ZOOM}
            >
              <Ionicons
                name="add"
                size={24}
                color={
                  hook.zoomLevel >= MAX_ZOOM
                    ? parentHook.colors.gray300
                    : parentHook.colors.text
                }
              />
            </TouchableOpacity>
          </View>

          <Button
            icon={hook.showChartValues ? "visibility" : "visibility-off"}
            onPress={() => hook.setShowChartValues((e) => !e)}
            style={{ width: 35 }}
            severity={SeverityEnum.INFO}
            rounded
          />
        </View>

        {/* ScrollView para o gráfico quando tiver zoom */}
        <ScrollView
          ref={hook.chartScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.chartScrollContainer}
        >
          <View style={styles.chartContainer}>{renderChart()}</View>
        </ScrollView>
      </View>
    </View>
  );
}
