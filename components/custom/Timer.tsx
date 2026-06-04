import React, { useEffect, useRef, useState, useMemo } from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import Text from "./Text";
import { Button } from "./Button";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useCustomStyle from "@/hooks/useCustomStyle";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { ButtonModeEnum } from "@/shared/enum/ButtonModeEnum";

type TimerProps = {
  mode: ButtonModeEnum; // ButtonModeEnum.UP para cronômetro, ButtonModeEnum.DOWN para regressivo
  initialTime?: number; // ms (obrigatório se mode=ButtonModeEnum.DOWN)
  onFinish?: () => void; // callback quando countdown termina
  onStart?: () => void; // callback quando o timer inicia
};

export default function Timer({
  mode,
  initialTime = 0,
  onFinish,
  onStart,
}: TimerProps) {
  const { t } = useTranslation();
  // const colorScheme = useColorScheme();
  // const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);
  const { colors } = useCustomStyle();

  // estado
  const [time, setTime] = useState(
    mode === ButtonModeEnum.DOWN ? initialTime : 0,
  );

  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef(0);

  // estilos com tema
  const customStyle = useMemo(() => {
    return {
      timeDisplay: { color: colors.text },
      startButton: { backgroundColor: colors.notification.success },
      pauseButton: { backgroundColor: colors.notification.warn },
      resetButton: { backgroundColor: colors.notification.danger },
    };
  }, [colors]);
  // -----------------------------------------
  //  ⏱️ Lógica principal unificada
  // -----------------------------------------
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startTimestampRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimestampRef.current;

      setTime((prev) => {
        if (mode === ButtonModeEnum.UP) {
          // STOPWATCH NORMAL
          return prev + elapsed;
        } else {
          // COUNTDOWN
          const newTime = prev - elapsed;

          if (newTime <= 0) return 0;

          return newTime;
        }
      });

      startTimestampRef.current = Date.now(); // importante para suavizar o tick
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current!);
      }
    };
  }, [isRunning, mode]);

  useEffect(() => {
    if (mode === ButtonModeEnum.DOWN && time === 0 && isRunning) {
      setIsRunning(false); // Agora é seguro
      onFinish?.(); // Agora é seguro

      setTimeout(() => {
        setTime(initialTime); // resetar para o tempo inicial
      }, 100);
    }
  }, [time, isRunning, mode]);

  // -----------------------------------------
  //  🧮 Formatação
  // -----------------------------------------
  const formatTime = () => {
    const totalSeconds = Math.floor(time / 1000);
    const ms = Math.floor((time % 1000) / 10);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${minutes}:${seconds}:${String(ms).padStart(2, "0")}`;
  };

  // -----------------------------------------
  //  Ações
  // -----------------------------------------
  const handleToggle = () => {
    if (!isRunning) {
      onStart?.();
    }
    setIsRunning((v) => !v);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(mode === ButtonModeEnum.DOWN ? initialTime : 0);
  };

  // -----------------------------------------
  //  UI
  // -----------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeDisplay, customStyle.timeDisplay]}>
          {formatTime()}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {mode === ButtonModeEnum.UP && (
          <>
            <Button
              title={t(AppMessagesEnum.STOPWATCH_RESET)}
              onPress={reset}
              severity={SeverityEnum.DANGER}
              style={{ width: 100 }}
              icon="refresh"
            />

            <Button
              title={
                isRunning
                  ? t(AppMessagesEnum.STOPWATCH_PAUSE)
                  : t(AppMessagesEnum.STOPWATCH_START)
              }
              icon={isRunning ? "pause" : "play"}
              onPress={handleToggle}
              severity={SeverityEnum.SUCCESS}
              style={{ width: 100 }}
            />
          </>
        )}

        {mode === ButtonModeEnum.DOWN && (
          <Button
            disabled={isRunning}
            title={t(AppMessagesEnum.STOPWATCH_REST)}
            severity={SeverityEnum.SUCCESS}
            style={{ width: 100 }}
            icon="hourglass-half"
            onPress={() => {
              setIsRunning(true);
              onStart?.();
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingHorizontal: 16,
  },
  timeContainer: {
    marginBottom: 20,
  },
  timeDisplay: {
    fontSize: 60,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  button: {
    width: 100,
  },
});
