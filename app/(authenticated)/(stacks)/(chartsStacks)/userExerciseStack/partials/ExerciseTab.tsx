import { ImageWrapper } from "@/components/custom/ImageWrapper";
import Text from "@/components/custom/Text";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Timer from "@/components/custom/Timer";
import useCustomStyle from "@/hooks/useCustomStyle";
import Card from "@/components/custom/Card";
import { TabProps } from "..";
import RestTimeBetweenSets from "@/components/custom/RestTimeBetweenSets";
import { ButtonModeEnum } from "@/shared/enum/ButtonModeEnum";
import Collapsable from "@/components/custom/Collapsable";
import { RootReduxState } from "@/redux";

const Repetitions = ({ hook, t }: TabProps) => {
  if (!hook.exercise?.repetitions) {
    return null;
  }

  if (!hook.exercise.repetitions.length) {
    return null;
  }

  if (
    hook.exercise.repetitions.length === 1 &&
    !!hook.exercise.repetitions[0]
  ) {
    return (
      <Card
        leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_REPETITIONS)}
        rightLabel={hook.exercise.repetitions.toString()}
      />
    );
  }

  return (
    <Card
      leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_REPETITIONS)}
      rightLabel={hook.exercise.repetitions
        .map((rep) => rep.toString())
        .join(", ")}
    />
  );
};

export default function ExerciseTab({ hook, t }: TabProps) {
  const { colors } = useCustomStyle();
  const gpsMetricsTemp = useSelector(
    (state: RootReduxState) => state.gpsMetricsTemp,
  );

  const savedWeight = useMemo(() => hook.exercise?.clientWeight || null, []);

  const [completedSets, setCompletedSets] = useState<number>(0);

  const customStyle = useMemo(() => {
    return {
      labelWeight: {
        backgroundColor: colors.gray300,
      },
      orientationWrapper: {
        borderColor: colors.tint,
      },
    };
  }, [colors]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          hook?.exercise?.hasGps && styles.scrollContentWithButton,
        ]}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {hook.exercise && "imagePath" in hook.exercise && (
          <View style={styles.imageContainer}>
            <ImageWrapper
              defaultImage={require("@/assets/images/default-exercise.jpg")}
              isLoading={false}
              object={hook.exercise}
            />
          </View>
        )}

        <View style={styles.detailsWrapper}>
          {Boolean(hook.exercise?.sets) && (
            <Card
              leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_SERIES)}
              rightLabel={hook.exercise?.sets?.toString()}
            />
          )}

          <Repetitions hook={hook} t={t} />

          {!!hook.exercise?.clientWeight && (
            <Card
              leftLabel={t(AppMessagesEnum.USER_EXERCISE_WEIGHT)}
              rightLabel={`${savedWeight}kg`}
            />
          )}

          {!!hook.exercise?.duration && (
            <Card
              leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_DURATION)}
              rightLabel={`${hook.exercise?.duration.toString()}min`}
            />
          )}

          {!!hook.exercise?.goal && (
            <Card
              leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_GOAL)}
              rightLabel={hook.exercise?.goal.toString()}
            />
          )}

          {!!hook.exercise?.distance && !!hook.exercise?.distanceUnit && (
            <Card
              leftLabel={t(AppMessagesEnum.EXERCISE_SCREEN_DISTANCE)}
              rightLabel={`${hook.exercise?.distance} ${hook.exercise?.distanceUnit}`}
            />
          )}
        </View>

        {!!hook.exercise?.exerciseOrientations && (
          <View
            style={[styles.orientationWrapper, customStyle.orientationWrapper]}
          >
            <Text>{t(AppMessagesEnum.EXERCISE_SCREEN_DESCRIPTION_TAB)}</Text>
            <Text>{hook.exercise?.exerciseOrientations}</Text>
          </View>
        )}

        {!!hook.exercise?.restTimeBetweenSets && !!hook.exercise?.sets && (
          <Collapsable
            title={t(AppMessagesEnum.EXERCISE_REST_TIME_BETWEEN_SETS)}
            isCollapsed={true}
            onlyHideContent
          >
            <RestTimeBetweenSets
              completedSets={completedSets}
              setCompletedSets={setCompletedSets}
              restTime={hook.exercise?.restTimeBetweenSets || 0}
              sets={hook.exercise?.sets || 0}
            />
          </Collapsable>
        )}

        {hook?.exercise?.hasStopwatch && (
          <Collapsable
            title={t(AppMessagesEnum.STOPWATCH_TITLE)}
            isCollapsed={true}
            onlyHideContent
          >
            <View style={styles.modalContent}>
              <Timer mode={ButtonModeEnum.UP} />
            </View>
          </Collapsable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  scrollView: {
    // flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    paddingTop: 0,
    paddingBottom: 16,
  },
  scrollContentWithButton: {
    paddingBottom: 90,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },

  detailsWrapper: {
    padding: 10,
    gap: 10,
  },
  details: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  inputWeight: {
    width: 60,
  },
  labelWeight: {
    padding: 5,
    paddingHorizontal: 10,
  },
  modalContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    marginBottom: 10,
  },
  orientationWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
  },
  description: {
    width: "100%",
    height: 120,
  },
});
