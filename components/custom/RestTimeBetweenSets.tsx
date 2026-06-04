import useCustomStyle from "@/hooks/useCustomStyle";
import { View, StyleSheet } from "react-native";
import Text from "@/components/custom/Text";
import Timer from "./Timer";
import { ButtonModeEnum } from "@/shared/enum/ButtonModeEnum";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Button } from "./Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";

type RestTimeBetweenSetsProps = {
  completedSets?: number;
  setCompletedSets: React.Dispatch<React.SetStateAction<number>>;
  restTime: number;
  sets: number;
};

export default function RestTimeBetweenSets({
  completedSets = 0,
  setCompletedSets,
  restTime,
  sets,
}: RestTimeBetweenSetsProps) {
  const { t } = useTranslation();
  const { colors } = useCustomStyle();

  const customStyles = {
    timelineItem: {
      backgroundColor: colors.background,
    },
    timelineText: {
      color: colors.notification.success,
    },
    timelineDot: {
      backgroundColor: colors.notification.success,
    },
    timelineConnector: {
      backgroundColor: colors.notification.success,
    },
    pendingDot: {
      borderColor: colors.tint,
    },
    pendingConnector: {
      backgroundColor: colors.tint,
    },
    allDoneText: {
      color: colors.notification.success,
    },
    checkmark: {
      color: colors.white,
    },
  };

  // callback ao finalizar o descanso
  // const handleFinish = () => {
  //   setCompletedSets((prev) => prev + 1);
  // };

  const onCompleteSet = () => {
    setCompletedSets((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {/* Timer regressivo entre séries */}
      {completedSets < sets ? (
        <View style={styles.timerContainer}>
          <Timer
            mode={ButtonModeEnum.DOWN}
            initialTime={restTime * 1000}
            onStart={onCompleteSet}
          />
          <Button
            title={t(AppMessagesEnum.FINISH_SET_WITHOUT_REST)}
            severity={SeverityEnum.SECONDARY}
            style={styles.finishSetButton}
            onPress={onCompleteSet}
          />
        </View>
      ) : (
        <Text style={[styles.allDoneText, customStyles.allDoneText]}>
          {t(AppMessagesEnum.SERIES_BETWEEN_SETS_ALL_SERIES_COMPLETED)} 🎉
        </Text>
      )}

      {/* Timeline visual dos sets */}
      <View style={styles.timeline}>
        {Array.from({ length: sets }).map((_, index) => {
          const isCompleted = index < completedSets;
          const isLast = index === sets - 1;

          return (
            <View key={index} style={styles.timelineItemContainer}>
              <View style={styles.timelineContent}>
                {/* Indicador do set (bolinha) */}
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted
                      ? [customStyles.timelineDot, styles.timelineDot]
                      : [customStyles.pendingDot, styles.pendingDot],
                  ]}
                >
                  {isCompleted && (
                    <Text style={[styles.checkmark, customStyles.checkmark]}>
                      ✓
                    </Text>
                  )}
                </View>

                {/* Conector entre os sets */}
                {!isLast && (
                  <View
                    style={[
                      styles.timelineConnector,
                      isCompleted && index + 1 < completedSets
                        ? customStyles.timelineConnector
                        : customStyles.pendingConnector,
                    ]}
                  />
                )}
              </View>

              {/* Texto do set */}
              <View style={styles.timelineTextContainer}>
                <Text
                  style={[
                    styles.timelineText,
                    isCompleted && customStyles.timelineText,
                  ]}
                >
                  {t(AppMessagesEnum.EXERCISE_SCREEN_SET)} {index + 1}
                  {isCompleted && (
                    <Text style={customStyles.timelineText}>
                      {" "}
                      {t(AppMessagesEnum.FINISHED)}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Status atual */}
      <Text style={styles.statusText}>
        {completedSets < sets
          ? `${t(AppMessagesEnum.EXERCISE_SCREEN_SET)} ${completedSets + 1} ${t(AppMessagesEnum.OF)} ${sets}`
          : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  timeline: {
    marginTop: 25,
    marginBottom: 10,
  },
  timelineItemContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timelineContent: {
    alignItems: "center",
    width: 30,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  pendingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timelineConnector: {
    width: 2,
    height: 30,
    marginTop: 5,
  },
  timelineTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  timelineText: {
    fontSize: 16,
  },
  allDoneText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  statusText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  finishSetButton: {
    marginTop: 15,
    width: 200,
  },
  timerContainer: {
    alignItems: "center",
  }
});
