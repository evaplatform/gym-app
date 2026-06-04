import Text from "@/components/custom/Text";
import { TabProps } from "..";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { DEFAULT_TIME } from "@/shared/constants/general";
import { convertSecondsInMinutes } from "@/shared/utils/convertSecondsInMinutes";
import { formatDistance } from "@/shared/utils/formatDistance";
import { useState } from "react";
import Modal from "@/components/custom/Modal";
import RouteHistoryMap from "@/components/custom/RouteHistoryMap";
import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import { Ionicons } from "@expo/vector-icons";
import { log } from "@/shared/utils/log";

export default function HistoryTab({ hook, t }: TabProps) {
  const [selectedHistory, setSelectedHistory] =
    useState<IExerciseHistory | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const customStyles = {
    viewContainer: {
      borderBottomColor: hook.colors.gray300,
    },
    mapButton: {
      backgroundColor: hook.colors.tint,
    },
  };

  const handleShowMap = (historyItem: IExerciseHistory) => {
    setSelectedHistory(historyItem);
    setShowMapModal(true);
  };

  const handleCloseMap = () => {
    setShowMapModal(false);
    setSelectedHistory(null);
  };

  log(
    "HistoryTab routePoints:",
    hook.listExerciseHistory.map((r) => r.routePoints?.length),
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {hook.listExerciseHistory?.length === 0 ? (
          <Text>{t(AppMessagesEnum.EXERCISE_SCREEN_NO_HISTORY)}</Text>
        ) : (
          hook.listExerciseHistory.map((historyItem) => (
            <View
              style={[styles.viewContainer, customStyles.viewContainer]}
              key={historyItem.id}
            >
              {/* completedAt */}
              {!!historyItem.completedAt && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_COMPLETED_AT_LABEL)}: ${new Date(historyItem.completedAt).toLocaleString()}`}
                </Text>
              )}
              {/* duration */}
              {!!historyItem.duration && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_DURATION_LABEL)}: ${convertSecondsInMinutes(historyItem.duration)}`}
                </Text>
              )}
              {/* notes */}
              {!!historyItem.notes && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_NOTES_LABEL)}: ${historyItem.notes}`}
                </Text>
              )}
              {/* completedSets */}
              {!!historyItem.completedSets && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_COMPLETED_SETS_LABEL)}: ${historyItem.completedSets}`}
                </Text>
              )}
              {/* completedRepetitions */}
              {!!historyItem.completedRepetitions &&
                historyItem.completedRepetitions.length > 0 && (
                  <Text>
                    {`${t(AppMessagesEnum.USER_EXERCISE_COMPLETED_REPETITIONS_LABEL)}: ${historyItem.completedRepetitions.join(", ")}`}
                  </Text>
                )}
              {/* weightUsed */}
              {!!historyItem.weightUsed && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_WEIGHT_USED_LABEL)}: ${historyItem.weightUsed}kg`}
                </Text>
              )}
              {/* distance */}
              {!!historyItem.distance && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_DISTANCE_LABEL)}: ${formatDistance(historyItem.distance)}`}
                </Text>
              )}
              {/* pace */}
              {!!historyItem.pace && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_PACE_LABEL)}: ${historyItem.pace}`}
                </Text>
              )}
              {/* averageHeartRate */}
              {!!historyItem.averageHeartRate && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_AVG_HEART_RATE_LABEL)}: ${historyItem.averageHeartRate}`}
                </Text>
              )}
              {/* maxHeartRate */}
              {!!historyItem.maxHeartRate && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_MAX_HEART_RATE_LABEL)}: ${historyItem.maxHeartRate}`}
                </Text>
              )}
              {/* paceAverage */}
              {historyItem.paceAverage &&
                ![DEFAULT_TIME].includes(historyItem.paceAverage.trim()) && (
                  <Text>
                    {`${t(AppMessagesEnum.USER_EXERCISE_PACE_AVERAGE_LABEL)}: ${historyItem.paceAverage} min/km`}
                  </Text>
                )}
              {/* speedAverage */}
              {!!historyItem.speedAverage && (
                <Text>
                  {`${t(AppMessagesEnum.EXERCISE_SCREEN_SPEED_AVERAGE_LABEL)}: ${historyItem.speedAverage.toFixed(2)} km/h`}
                </Text>
              )}

              {/* perceivedEffort */}
              {!!historyItem.perceivedEffort && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_PERCEIVED_EFFORT_LABEL)}: ${historyItem.perceivedEffort}`}
                </Text>
              )}
              {/* feelingScore */}
              {historyItem.feelingScore && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_FEELING_SCORE_LABEL)}: ${historyItem.feelingScore}`}
                </Text>
              )}
              {/* completed */}
              <Text>
                {`${t(AppMessagesEnum.USER_EXERCISE_COMPLETED_LABEL)}: ${historyItem.completed ? t(AppMessagesEnum.YES_LABEL) : t(AppMessagesEnum.NO_LABEL)}`}
              </Text>
              {/* partiallyCompleted */}
              {!!historyItem.partiallyCompleted && (
                <Text>
                  {`${t(AppMessagesEnum.USER_EXERCISE_PARTIALLY_COMPLETED_LABEL)}: ${historyItem.partiallyCompleted ? t(AppMessagesEnum.YES_LABEL) : t(AppMessagesEnum.NO_LABEL)}`}
                </Text>
              )}
              {/* routePoints com botão para ver mapa */}
              {!!historyItem.routePoints &&
                historyItem.routePoints.length > 0 && (
                  <View style={styles.routePointsContainer}>
                    <Text>
                      {`${t(AppMessagesEnum.USER_EXERCISE_ROUTE_POINTS_LABEL)}: ${historyItem.routePoints.length} ${t(AppMessagesEnum.USER_EXERCISE_POINTS_LABEL)}`}
                    </Text>
                    <TouchableOpacity
                      style={[styles.mapButton, customStyles.mapButton]}
                      onPress={() => handleShowMap(historyItem)}
                    >
                      <Ionicons name="map" size={20} color="white" />
                      <Text style={styles.mapButtonText}>
                        {t(AppMessagesEnum.GPS_VIEW_ROUTE)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          ))
        )}
      </ScrollView>
      {/* Modal com o mapa */}
      <Modal
        visible={showMapModal}
        onClose={handleCloseMap}
        title={t(AppMessagesEnum.GPS_ROUTE_HISTORY)}
        showCancelButton={false}
        showConfirmButton={false}
        cancelText={t(AppMessagesEnum.CLOSE)}
      >
        {selectedHistory && <RouteHistoryMap historyItem={selectedHistory} />}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    width: "100%",
    paddingTop: 0,
    alignItems: "center",
    paddingBottom: 100,
  },
  viewContainer: {
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10,
    padding: 10,
  },
  routePointsContainer: {
    marginTop: 8,
    gap: 8,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
